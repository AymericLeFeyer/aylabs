// Le navigateur ne parle jamais directement à api.github.com : tout passe par le
// relais `/api/github/*`, qui ajoute le jeton depuis le cookie de session. Le
// jeton reste ainsi hors de portée du JavaScript de la page.

const RELAY = '/api/github';

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export class SessionExpiredError extends GitHubError {
  constructor() {
    super('Session expirée, reconnecte-toi', 401);
    this.name = 'SessionExpiredError';
  }
}

/** Encodage base64 correct pour du contenu UTF-8 (accents, emojis). */
export const toBase64 = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

export const fromBase64 = (b64: string): string => {
  const binary = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export class GitHubApiClient {
  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${RELAY}${path}`, {
      ...init,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });

    if (response.status === 204) return undefined as T;

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) throw new SessionExpiredError();
      const message =
        payload && typeof payload === 'object'
          ? String(
              (payload as { message?: unknown; error?: unknown }).message ??
                (payload as { error?: unknown }).error ??
                `Erreur GitHub ${response.status}`
            )
          : `Erreur GitHub ${response.status}`;
      throw new GitHubError(message, response.status);
    }

    return payload as T;
  }
}
