import type { Session } from '../entities/GitHubUser';

export interface AuthRepository {
  /** Session en cours, ou null si personne n'est connecté. */
  currentSession(): Promise<Session | null>;
  /** Envoie le navigateur sur l'écran d'autorisation GitHub. */
  startLogin(): void;
  logout(): Promise<void>;
}
