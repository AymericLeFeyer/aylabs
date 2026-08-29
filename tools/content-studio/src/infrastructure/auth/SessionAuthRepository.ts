import type { AuthRepository } from '../../domain/auth/repositories/AuthRepository';
import type { Session } from '../../domain/auth/entities/GitHubUser';

/**
 * Toute l'authentification vit côté serveur (OAuth Web Flow + cookie chiffré).
 * Le client se contente de demander qui est connecté et de déclencher la
 * redirection : il ne manipule ni code, ni state, ni jeton.
 */
export class SessionAuthRepository implements AuthRepository {
  async currentSession(): Promise<Session | null> {
    const response = await fetch('/api/auth/me', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

    if (response.status === 401) return null;
    if (!response.ok) throw new Error('Impossible de lire la session');

    const data = (await response.json()) as {
      login: string;
      name: string | null;
      avatarUrl: string;
      canWrite: boolean;
    };

    return {
      user: { login: data.login, name: data.name, avatarUrl: data.avatarUrl },
      canWrite: data.canWrite,
    };
  }

  startLogin(): void {
    window.location.href = '/api/auth/login';
  }

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  }
}
