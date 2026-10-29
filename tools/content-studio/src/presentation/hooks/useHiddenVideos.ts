import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ManageHiddenVideos } from '../../application/stats/usecases/ManageHiddenVideos';
import type { PendingChange } from '../../domain/changes/entities/PendingChange';
import type { ChannelVideo, HiddenVideo } from '../../domain/stats/entities/ChannelVideo';
import { GitHubStatsRepository } from '../../infrastructure/stats/GitHubStatsRepository';
import {
  averageViews,
  engagementRate,
  retainedVideos,
} from '../../domain/stats/services/hiddenVideos';

/**
 * Pilote la banlist : elle vit dans `public/hidden-videos.json`, lu sur GitHub
 * et enregistré dans les modifications en attente comme n'importe quelle fiche.
 *
 * `knownCodes` sont les codes des fiches du dépôt : l'aperçu reproduit le filtre
 * du site, qui écarte d'office les vidéos de l'API sans fiche.
 * `pending` est la banlist déjà enregistrée mais pas commitée, `onStage` reçoit
 * la nouvelle.
 */
export const useHiddenVideos = (
  knownCodes: Set<string> | undefined,
  pending: PendingChange | undefined,
  onStage: (change: PendingChange) => void
) => {
  const useCase = useMemo(() => new ManageHiddenVideos(new GitHubStatsRepository()), []);

  const [videos, setVideos] = useState<ChannelVideo[]>([]);
  const [hidden, setHidden] = useState<HiddenVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Lu par `load` sans en être une dépendance : chaque enregistrement change
  // `pending`, et ne doit pas recharger la page.
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = await useCase.load(pendingRef.current);
      setVideos(state.videos);
      setHidden(state.hidden);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    void load();
  }, [load]);

  const hiddenCodes = useMemo(
    () => new Set(hidden.map((entry) => entry.code)),
    [hidden]
  );

  /** Bascule locale : rien n'est commité tant que `save` n'est pas appelé. */
  const toggle = useCallback((code: string, title: string) => {
    setHidden((current) =>
      current.some((entry) => entry.code === code)
        ? current.filter((entry) => entry.code !== code)
        : [
            ...current,
            { code, title, hiddenAt: new Date().toISOString().slice(0, 10) },
          ]
    );
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      onStage(await useCase.save(hidden));
      setSavedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  }, [useCase, hidden, onStage]);

  // Aperçu de ce que le site calculera avec cette banlist.
  const retained = useMemo(
    () => retainedVideos(videos, hiddenCodes, knownCodes),
    [videos, hiddenCodes, knownCodes]
  );

  return {
    videos,
    hidden,
    hiddenCodes,
    retained,
    preview: {
      averageViews: averageViews(retained),
      engagementRate: engagementRate(retained),
    },
    loading,
    saving,
    error,
    savedAt,
    toggle,
    save,
    reload: load,
  };
};
