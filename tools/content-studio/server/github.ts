import type { ServerConfig } from './config';

// Client HTTP centralisé pour l'API GitHub : aucun `fetch` direct ailleurs côté
// serveur. Pas d'Octokit — on n'utilise qu'une poignée d'endpoints, et une
// dépendance de moins c'est une image plus légère.

const API_ROOT = 'https://api.github.com';
const USER_AGENT = 'aylabs-content-studio';

export class GitHubApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

export async function githubRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    accessToken: string;
    allowStatuses?: number[];
  }
): Promise<{ status: number; data: T }> {
  const { method = 'GET', body, accessToken, allowStatuses = [] } = options;

  // Le fetch de Node ne met rien en cache : le contenu reflète toujours l'état
  // réel de la branche, sans avoir à le demander explicitement.

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': USER_AGENT,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok && !allowStatuses.includes(response.status)) {
    const detail = await response.text().catch(() => '');
    throw new GitHubApiError(
      response.status,
      `GitHub ${method} ${path} → ${response.status}${detail ? ` : ${detail.slice(0, 300)}` : ''}`
    );
  }

  const data = response.status === 204 ? (undefined as T) : ((await response.json()) as T);
  return { status: response.status, data };
}

export function authorizationUrl(state: string, config: ServerConfig): string {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: `${config.appUrl}/api/auth/callback`,
    // `repo` couvre la lecture et l'écriture, y compris si le dépôt devenait privé.
    scope: 'repo read:user',
    state,
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/** Échange du code OAuth — cet endpoint est hors de l'API REST (host différent). */
export async function exchangeOAuthCode(code: string, config: ServerConfig): Promise<string> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
      redirect_uri: `${config.appUrl}/api/auth/callback`,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    access_token?: string;
    error_description?: string;
    error?: string;
  } | null;

  if (!payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || "Échange du code OAuth refusé");
  }
  return payload.access_token;
}

export interface AuthenticatedUser {
  login: string;
  name: string;
  avatarUrl: string;
  canWrite: boolean;
}

/**
 * Le contrôle d'accès n'est PAS géré par l'outil : il n'existe aucune liste
 * d'utilisateurs à maintenir. On demande à GitHub si le compte connecté a la
 * permission `push` sur le dépôt — n'importe qui peut donc se connecter, mais
 * sans ce droit il ne voit rien et ne peut rien publier.
 */
export async function fetchUser(
  accessToken: string,
  config: ServerConfig
): Promise<AuthenticatedUser> {
  const { data: user } = await githubRequest<{
    login: string;
    name: string | null;
    avatar_url: string;
  }>('/user', { accessToken });

  // 404 = dépôt privé invisible pour ce compte : GitHub ne distingue pas
  // « n'existe pas » de « vous n'y avez pas accès ». Dans les deux cas, pas de droit.
  const { status, data: repo } = await githubRequest<{ permissions?: { push?: boolean; admin?: boolean } }>(
    `/repos/${config.repoOwner}/${config.repoName}`,
    { accessToken, allowStatuses: [403, 404] }
  );

  return {
    login: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
    canWrite: status === 200 && Boolean(repo.permissions?.push || repo.permissions?.admin),
  };
}
