import type { PendingChange } from '../entities/PendingChange';

/**
 * Remplace la modification du même fichier, s'il y en a une. Le `baseSha` du
 * premier enregistrement est conservé : c'est la version de la branche sur
 * laquelle toute la série de modifications a été faite.
 */
export const upsertChange = (changes: PendingChange[], change: PendingChange): PendingChange[] => {
  const previous = changes.find((entry) => entry.path === change.path);
  if (!previous) return [...changes, change];
  return changes.map((entry) =>
    entry.path === change.path ? { ...change, baseSha: previous.baseSha } : entry
  );
};

/** Une modification garde son message ; plusieurs sont listées dans le corps. */
export const commitMessage = (changes: PendingChange[]): string => {
  if (changes.length === 1) return changes[0].message;
  const lines = changes.map((change) => `- ${change.message}`).join('\n');
  return `content: ${changes.length} changes\n\n${lines}`;
};
