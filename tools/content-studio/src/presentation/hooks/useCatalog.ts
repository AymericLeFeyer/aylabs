import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadCatalog, type Catalog } from '../../application/content/usecases/LoadCatalog';
import type { PendingChange } from '../../domain/changes/entities/PendingChange';
import type { ContentFile, ContentKind } from '../../domain/content/entities/ContentItem';
import { parseMarkdown } from '../../domain/content/services/frontmatter';
import { buildSuggestions } from '../../domain/content/services/suggestions';
import { GitHubContentRepository } from '../../infrastructure/content/GitHubContentRepository';

/**
 * Les fiches enregistrées mais pas commitées remplacent (ou complètent) celles
 * de la branche : le tableau de bord et les éditeurs montrent ce qui partira au
 * prochain commit.
 */
const withPending = (files: ContentFile[], pending: PendingChange[]): ContentFile[] => {
  const staged = pending.filter((change) => change.scope === 'video' || change.scope === 'product');
  if (staged.length === 0) return files;
  const byPath = new Map(files.map((file) => [file.path, file]));
  for (const change of staged) {
    const parsed = parseMarkdown(change.content);
    byPath.set(change.path, {
      kind: change.scope === 'video' ? 'video' : 'product',
      slug: change.path.split('/').pop()!.replace(/\.md$/, ''),
      path: change.path,
      frontmatter: parsed.frontmatter,
      body: parsed.body,
    });
  }
  return [...byPath.values()];
};

/**
 * Le catalogue s'affiche d'abord depuis le dépôt local (instantané),
 * puis se réaligne sur GitHub — seule source de vérité pour l'écriture.
 * `pending` (modifications en attente) est superposé par-dessus.
 */
export const useCatalog = (pending: PendingChange[]) => {
  const repository = useMemo(() => new GitHubContentRepository(), []);
  const loader = useMemo(() => new LoadCatalog(repository), [repository]);

  const [catalog, setCatalog] = useState<Catalog>(() => loader.local());
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      setCatalog(await loader.synced());
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Synchronisation impossible');
    } finally {
      setSyncing(false);
    }
  }, [loader]);

  useEffect(() => {
    void sync();
  }, [sync]);

  const files = useMemo(() => withPending(catalog.files, pending), [catalog.files, pending]);
  const videos = useMemo(() => files.filter((f) => f.kind === 'video'), [files]);
  const products = useMemo(() => files.filter((f) => f.kind === 'product'), [files]);
  const suggestions = useMemo(() => buildSuggestions(files), [files]);

  const byKind = useCallback(
    (kind: ContentKind): ContentFile[] => (kind === 'video' ? videos : products),
    [videos, products]
  );

  const slugs = useCallback(
    (kind: ContentKind) => new Set(byKind(kind).map((f) => f.slug)),
    [byKind]
  );

  return {
    catalog,
    videos,
    products,
    suggestions,
    byKind,
    slugs,
    syncing,
    syncError,
    sync,
    repository,
  };
};
