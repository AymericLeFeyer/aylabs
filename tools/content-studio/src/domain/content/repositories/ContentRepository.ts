export interface RemoteFileState {
  path: string;
  sha: string;
  content: string;
}

export interface SaveResult {
  path: string;
  commitUrl: string;
  commitSha: string;
}

/** Écriture : tout passe par l'API GitHub (commit direct sur la branche cible). */
export interface ContentWriteRepository {
  fetchRemote(path: string): Promise<RemoteFileState | null>;
  /** Liste path -> sha de blob pour un dossier, en une requête. */
  fetchTree(): Promise<Map<string, string>>;
  fetchBlob(sha: string): Promise<string>;
  commit(input: {
    path: string;
    content: string;
    message: string;
    sha?: string;
  }): Promise<SaveResult>;
}
