import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadCatalog, type Catalog } from '../../application/content/usecases/LoadCatalog';
import type { ContentFile, ContentKind } from '../../domain/content/entities/ContentItem';
import { buildSuggestions } from '../../domain/content/services/suggestions';
import { GitHubContentRepository } from '../../infrastructure/content/GitHubContentRepository';

/**
 * Le catalogue s'affiche d'abord depuis le dépôt local (instantané),
 * puis se réaligne sur GitHub — seule source de vérité pour l'écriture.
 */
export const useCatalog = () => {
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

  const videos = useMemo(() => catalog.files.filter((f) => f.kind === 'video'), [catalog.files]);
  const products = useMemo(() => catalog.files.filter((f) => f.kind === 'product'), [catalog.files]);
  const suggestions = useMemo(() => buildSuggestions(catalog.files), [catalog.files]);

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
