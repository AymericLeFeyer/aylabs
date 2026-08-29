import type { IncomingMessage, ServerResponse } from 'node:http';
import { getConfig, type ServerConfig } from './config';
import { authorizationUrl, exchangeOAuthCode, fetchUser, githubRequest, GitHubApiError } from './github';
import {
  clearSessionCookie,
  clearStateCookie,
  issueOAuthState,
  readSession,
  sessionCookie,
  verifyOAuthState,
} from './session';

const json = (res: ServerResponse, status: number, payload: unknown, cookies: string[] = []) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...(cookies.length ? { 'Set-Cookie': cookies } : {}),
  });
  res.end(JSON.stringify(payload));
};

const redirect = (res: ServerResponse, location: string, cookies: string[] = []) => {
  res.writeHead(302, {
    Location: location,
    'Cache-Control': 'no-store',
    ...(cookies.length ? { 'Set-Cookie': cookies } : {}),
  });
  res.end();
};

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

/**
 * Le relais n'accepte que ce dont l'interface a besoin : lecture et écriture
 * dans le dépôt configuré. Sans cette restriction, une session ouverte
 * transformerait l'outil en proxy vers toute l'API GitHub de l'utilisateur.
 */
function allowedGitHubPath(path: string, method: string, config: ServerConfig): boolean {
  if (method !== 'GET' && method !== 'PUT') return false;
  const prefix = `/repos/${config.repoOwner}/${config.repoName}/`;
  return path.startsWith(prefix);
}

/**
 * Routeur des routes serveur, partagé entre le serveur de production
 * (`server/index.ts`) et le serveur de développement Vite (`vite.config.ts`),
 * pour qu'il n'existe qu'une seule implémentation de l'authentification.
 *
 * Renvoie `false` quand la requête ne le concerne pas.
 */
export async function handleApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname;

  if (path !== '/config.js' && !path.startsWith('/api/')) return false;

  let config: ServerConfig;
  try {
    config = getConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Configuration invalide';
    // Panne de configuration : on le dit franchement plutôt que de tomber en
    // marche dégradée avec un écran de connexion qui ne mènerait nulle part.
    if (path === '/config.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(`window.__STUDIO_CONFIG__ = ${JSON.stringify({ CONFIG_ERROR: message })};\n`);
      return true;
    }
    json(res, 500, { error: message });
    return true;
  }

  /* ─────────────── Configuration publique du client ─────────────── */

  if (path === '/config.js') {
    const payload = {
      REPO_OWNER: config.repoOwner,
      REPO_NAME: config.repoName,
      REPO_BRANCH: config.branch,
    };
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(`window.__STUDIO_CONFIG__ = ${JSON.stringify(payload)};\n`);
    return true;
  }

  /* ────────────────────────── Authentification ────────────────────────── */

  if (path === '/api/auth/login') {
    const { state, cookie } = issueOAuthState(config);
    redirect(res, authorizationUrl(state, config), [cookie]);
    return true;
  }

  if (path === '/api/auth/callback') {
    // L'utilisateur a cliqué « Cancel » sur l'écran d'autorisation GitHub.
    if (url.searchParams.get('error')) {
      redirect(res, `${config.appUrl}/?erreur=refus`, [clearStateCookie(config)]);
      return true;
    }

    const code = url.searchParams.get('code');
    if (!verifyOAuthState(req.headers.cookie, url.searchParams.get('state')) || !code) {
      redirect(res, `${config.appUrl}/?erreur=state`, [clearStateCookie(config)]);
      return true;
    }

    try {
      const accessToken = await exchangeOAuthCode(code, config);
      const user = await fetchUser(accessToken, config);
      // La session est ouverte MÊME sans droit d'écriture : c'est ce qui permet
      // d'afficher un refus explicite plutôt qu'une boucle de connexion.
      redirect(res, config.appUrl, [
        sessionCookie({ ...user, accessToken }, config),
        clearStateCookie(config),
      ]);
    } catch (error) {
      console.error('[auth/callback]', error);
      redirect(res, `${config.appUrl}/?erreur=connexion`, [clearStateCookie(config)]);
    }
    return true;
  }

  if (path === '/api/auth/logout') {
    // POST et non GET : une déconnexion change l'état, elle ne doit pas pouvoir
    // être déclenchée par une simple image ou un lien tiers.
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Méthode non autorisée' });
      return true;
    }
    json(res, 200, { ok: true }, [clearSessionCookie(config)]);
    return true;
  }

  if (path === '/api/auth/me') {
    const session = readSession(req.headers.cookie, config);
    if (!session) {
      json(res, 401, { error: 'Non authentifié' });
      return true;
    }
    // Le jeton GitHub reste côté serveur : il n'est jamais renvoyé au navigateur.
    json(res, 200, {
      login: session.login,
      name: session.name,
      avatarUrl: session.avatarUrl,
      canWrite: session.canWrite,
    });
    return true;
  }

  /* ─────────── Relais authentifié vers l'API GitHub ─────────── */

  if (path.startsWith('/api/github/')) {
    const session = readSession(req.headers.cookie, config);
    if (!session) {
      json(res, 401, { error: 'Session expirée, reconnecte-toi' });
      return true;
    }
    if (!session.canWrite) {
      json(res, 403, { error: "Ce compte n'a pas le droit d'écriture sur le dépôt" });
      return true;
    }

    const target = path.slice('/api/github'.length) + url.search;
    const method = req.method ?? 'GET';
    if (!allowedGitHubPath(target.split('?')[0], method, config)) {
      json(res, 403, { error: 'Requête GitHub non autorisée par le relais' });
      return true;
    }

    try {
      const rawBody = method === 'PUT' ? await readBody(req) : '';
      const { status, data } = await githubRequest<unknown>(target, {
        method,
        body: rawBody ? JSON.parse(rawBody) : undefined,
        accessToken: session.accessToken,
        allowStatuses: [404, 409, 422],
      });
      json(res, status, data);
    } catch (error) {
      const status = error instanceof GitHubApiError ? error.status : 502;
      const message = error instanceof Error ? error.message : 'Erreur GitHub';
      console.error('[api/github]', message);
      json(res, status, { message });
    }
    return true;
  }

  json(res, 404, { error: 'Route inconnue' });
  return true;
}
