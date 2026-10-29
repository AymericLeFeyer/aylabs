import { useCallback, useEffect, useMemo, useState } from 'react';
import { CommitPendingChanges } from '../../application/changes/usecases/CommitPendingChanges';
import type { CommitResult, PendingChange } from '../../domain/changes/entities/PendingChange';
import { upsertChange } from '../../domain/changes/services/pendingChanges';
import { GitHubCommitRepository } from '../../infrastructure/changes/GitHubCommitRepository';
import { LocalPendingChangesStore } from '../../infrastructure/changes/LocalPendingChangesStore';

/**
 * Modifications enregistrées mais pas commitées. « Enregistrer » les accumule,
 * `commit` les envoie toutes dans un seul commit — un seul déploiement du site.
 */
export const usePendingChanges = () => {
  const store = useMemo(() => new LocalPendingChangesStore(), []);
  const committer = useMemo(() => new CommitPendingChanges(new GitHubCommitRepository()), []);

  const [changes, setChanges] = useState<PendingChange[]>(() => store.load());
  const [committing, setCommitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCommit, setLastCommit] = useState<CommitResult | null>(null);

  useEffect(() => {
    store.save(changes);
  }, [store, changes]);

  const stage = useCallback((change: PendingChange) => {
    setChanges((current) => upsertChange(current, change));
    setLastCommit(null);
  }, []);

  const discard = useCallback((path: string) => {
    setChanges((current) => current.filter((change) => change.path !== path));
  }, []);

  const commit = useCallback(async (): Promise<CommitResult | null> => {
    setCommitting(true);
    setError(null);
    try {
      const result = await committer.execute(changes);
      setChanges([]);
      setLastCommit(result);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Le commit a échoué');
      return null;
    } finally {
      setCommitting(false);
    }
  }, [committer, changes]);

  const byPath = useCallback(
    (path: string) => changes.find((change) => change.path === path),
    [changes]
  );

  return { changes, stage, discard, commit, committing, error, lastCommit, byPath };
};
