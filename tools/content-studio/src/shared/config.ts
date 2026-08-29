/**
 * Configuration publique du client, servie par `/config.js` (généré à la volée
 * par le serveur à partir de ses variables d'environnement). Le client id, le
 * client secret et le jeton GitHub restent côté serveur : rien de secret ici.
 */
declare global {
  interface Window {
    __STUDIO_CONFIG__?: Record<string, string | undefined>;
  }
}

const runtime = (): Record<string, string | undefined> =>
  (typeof window !== 'undefined' ? window.__STUDIO_CONFIG__ : undefined) ?? {};

const setting = (key: string, fallback: string): string => {
  const value = runtime()[key];
  return value && value.trim() !== '' ? value.trim() : fallback;
};

export const REPO = {
  owner: setting('REPO_OWNER', 'AymericLeFeyer'),
  name: setting('REPO_NAME', 'aylabs'),
  branch: setting('REPO_BRANCH', 'main'),
} as const;

/** Message posé par le serveur quand une variable d'environnement manque. */
export const CONFIG_ERROR: string | null = runtime().CONFIG_ERROR ?? null;

export const CONTENT_DIRS = {
  video: 'src/content/videos',
  product: 'src/content/products',
} as const;
