import type { CommitResult, PendingChange } from '../../../domain/changes/entities/PendingChange';
import type { CommitRepository } from '../../../domain/changes/repositories/CommitRepository';
import { commitMessage } from '../../../domain/changes/services/pendingChanges';

export class ConflictError extends Error {
  constructor(readonly paths: string[]) {
    super(
      `Modifié sur GitHub depuis ton enregistrement : ${paths.join(', ')}. ` +
        'Retire ces fichiers des modifications en attente, actualise et recommence.'
    );
    this.name = 'ConflictError';
  }
}

export class CommitPendingChanges {
  constructor(private readonly repository: CommitRepository) {}

  /**
   * Vérifie qu'aucun fichier n'a bougé sur la branche depuis son premier
   * enregistrement, puis commite le tout d'un bloc : un commit, un déploiement.
   */
  async execute(changes: PendingChange[]): Promise<CommitResult> {
    if (changes.length === 0) throw new Error('Aucune modification à commiter');

    const current = await Promise.all(
      changes.map((change) => this.repository.fetchBlobSha(change.path))
    );
    const conflicts = changes
      .filter((change, i) => (current[i] ?? undefined) !== change.baseSha)
      .map((change) => change.path);
    if (conflicts.length > 0) throw new ConflictError(conflicts);

    return this.repository.commitFiles({
      files: changes.map(({ path, content }) => ({ path, content })),
      message: commitMessage(changes),
    });
  }
}
