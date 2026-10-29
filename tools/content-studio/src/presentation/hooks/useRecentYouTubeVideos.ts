import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImportVideoByCode } from '../../application/youtube/usecases/ImportVideoByCode';
import { ListRecentVideos } from '../../application/youtube/usecases/ListRecentVideos';
import type { ImportCandidate } from '../../domain/youtube/services/videoImport';
import { HttpYouTubeFeedRepository } from '../../infrastructure/youtube/HttpYouTubeFeedRepository';

/**
 * Dernières vidéos longues de la chaîne, proposées à l'import dans une
 * nouvelle fiche. `knownCodes` marque celles qui ont déjà une fiche.
 */
export const useRecentYouTubeVideos = (knownCodes: Set<string>, enabled: boolean) => {
  const repository = useMemo(() => new HttpYouTubeFeedRepository(), []);
  const useCase = useMemo(() => new ListRecentVideos(repository), [repository]);
  const byCode = useMemo(() => new ImportVideoByCode(repository), [repository]);

  const [candidates, setCandidates] = useState<ImportCandidate[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCandidates(await useCase.execute(knownCodes));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lecture de YouTube impossible');
    } finally {
      setLoading(false);
    }
  }, [useCase, knownCodes]);

  useEffect(() => {
    if (enabled) void load();
  }, [enabled, load]);

  /** Vidéo absente du flux : lue par son code. Rejette avec un message lisible. */
  const fetchByCode = useCallback(
    (code: string) => byCode.execute(code, knownCodes),
    [byCode, knownCodes]
  );

  return { candidates, loading, error, reload: load, fetchByCode };
};
