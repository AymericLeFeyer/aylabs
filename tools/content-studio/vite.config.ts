import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './server/handler';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');

/**
 * Le code serveur lit `process.env` (il tourne aussi hors de Vite, en production).
 * En développement, les valeurs viennent de `.env.local` : on les y recopie.
 */
const loadServerEnv = (mode: string): void => {
  const env = loadEnv(mode, here, '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  // Le callback OAuth doit pointer sur le serveur de développement.
  process.env.APP_URL ??= 'http://127.0.0.1:5180';
};

/**
 * Monte les routes serveur dans le serveur de développement : l'authentification
 * OAuth et le relais GitHub sont ainsi exercés par le même code qu'en production.
 */
const studioApi = (): Plugin => ({
  name: 'studio-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      handleApi(req, res).then((handled) => {
        if (!handled) next();
      }, next);
    });
  },
});

export default defineConfig(({ mode }) => {
  loadServerEnv(mode);

  return {
    plugins: [react(), studioApi()],
    server: {
      port: 5180,
      strictPort: true,
      host: '127.0.0.1',
      // Autorise la lecture des .md du site (hors racine de cette app)
      fs: { allow: [repoRoot] },
    },
    optimizeDeps: { exclude: ['lucide-react'] },
  };
});
