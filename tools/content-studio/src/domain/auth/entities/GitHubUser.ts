export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
}

/**
 * Session telle que le client la connaît : le jeton GitHub n'y figure pas,
 * il ne quitte jamais le serveur (cookie chiffré, relais `/api/github`).
 */
export interface Session {
  user: GitHubUser;
  /** true uniquement si le compte a le droit de pousser sur le dépôt cible. */
  canWrite: boolean;
}
