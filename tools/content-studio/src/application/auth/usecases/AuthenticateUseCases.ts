import type { AuthRepository } from '../../../domain/auth/repositories/AuthRepository';
import type { Session } from '../../../domain/auth/entities/GitHubUser';

/**
 * L'accès à l'outil se résume à une question posée à GitHub : ce compte peut-il
 * pousser sur le dépôt ? Aucune liste d'utilisateurs n'est maintenue ici.
 *
 * Une session sans droit d'écriture est conservée volontairement : elle permet
 * d'afficher un refus explicite plutôt qu'une boucle de connexion.
 */
export class SignIn {
  constructor(private readonly repository: AuthRepository) {}

  restore(): Promise<Session | null> {
    return this.repository.currentSession();
  }

  start(): void {
    this.repository.startLogin();
  }

  signOut(): Promise<void> {
    return this.repository.logout();
  }
}
