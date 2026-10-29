import type { CommitResult } from '../entities/PendingChange';

export interface CommitRepository {
  /** SHA du blob actuel sur la branche, `null` si le fichier n'existe pas. */
  fetchBlobSha(path: string): Promise<string | null>;
  /** Un seul commit pour tous les fichiers, posé au bout de la branche. */
  commitFiles(input: {
    files: { path: string; content: string }[];
    message: string;
  }): Promise<CommitResult>;
}
