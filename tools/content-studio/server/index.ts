import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { getConfig } from './config';
import { handleApi } from './handler';

// Serveur de production : sert le SPA construit et les routes d'API.
// Aucune dépendance runtime — le bundle esbuild et Node suffisent.

const ROOT = resolve(process.argv[2] ?? join(process.cwd(), 'dist'));

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Empêche qu'un chemin remonte hors de `dist/` (../../etc/passwd). */
function safeJoin(root: string, requested: string): string | null {
  const target = resolve(join(root, normalize(decodeURIComponent(requested))));
  return target === root || target.startsWith(root + (process.platform === 'win32' ? '\\' : '/'))
    ? target
    : null;
}

const server = createServer(async (req, res) => {
  try {
    if (await handleApi(req, res)) return;

    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    const candidate = safeJoin(ROOT, pathname === '/' ? '/index.html' : pathname);

    if (candidate) {
      try {
        const info = await stat(candidate);
        if (info.isFile()) {
          const ext = extname(candidate);
          res.writeHead(200, {
            'Content-Type': MIME[ext] ?? 'application/octet-stream',
            // Les assets sont hashés par Vite ; l'index ne doit jamais être figé.
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
            'X-Robots-Tag': 'noindex, nofollow',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'no-referrer',
          });
          createReadStream(candidate).pipe(res);
          return;
        }
      } catch {
        // Pas de fichier à ce chemin : on retombe sur l'index (routage SPA).
      }
    }

    const index = join(ROOT, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
    createReadStream(index).pipe(res);
  } catch (error) {
    console.error('[server]', error);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Erreur interne');
  }
});

// Échoue au démarrage plutôt qu'à la première connexion : une variable manquante
// doit se voir dans les logs du conteneur, pas dans le navigateur.
const config = getConfig();

server.listen(config.port, '0.0.0.0', () => {
  console.log(
    `Content Studio sur :${config.port} -> ${config.repoOwner}/${config.repoName}@${config.branch}`
  );
  console.log(`Callback OAuth attendu : ${config.appUrl}/api/auth/callback`);
});
