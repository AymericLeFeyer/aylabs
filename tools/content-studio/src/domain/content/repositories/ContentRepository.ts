export interface RemoteFileState {
  path: string;
  sha: string;
  content: string;
}

/**
 * Lecture de la branche cible. L'écriture passe par le domaine `changes` :
 * modifications en attente, puis un seul commit.
 */
export interface ContentWriteRepository {
  fetchRemote(path: string): Promise<RemoteFileState | null>;
  /** Liste path -> sha de blob pour un dossier, en une requête. */
  fetchTree(): Promise<Map<string, string>>;
  fetchBlob(sha: string): Promise<string>;
}
