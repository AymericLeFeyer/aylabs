import React from 'react';
import { ArrowLeft, Check, Eye, EyeOff, RefreshCw, Save } from 'lucide-react';
import { formatFr } from '../../shared/date';
import { useHiddenVideos } from '../hooks/useHiddenVideos';
import { STATS_WINDOW } from '../../domain/stats/services/hiddenVideos';
import { Button, Card, SectionTitle, Spinner } from '../components/ui/primitives';

interface Props {
  onBack: () => void;
}

const formatCount = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value);

/** PT12M34S -> 12:34 ; les durées viennent de l'API YouTube au format ISO 8601. */
const formatDuration = (iso: string): string => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso ?? '');
  if (!match) return '';
  const [, h, m, s] = match;
  const hours = Number(h ?? 0);
  const minutes = Number(m ?? 0);
  const seconds = Number(s ?? 0);
  const mm = String(minutes).padStart(hours ? 2 : 1, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const HiddenVideosPage: React.FC<Props> = ({ onBack }) => {
  const {
    videos,
    hiddenCodes,
    retained,
    preview,
    loading,
    saving,
    error,
    savedAt,
    toggle,
    save,
    reload,
  } = useHiddenVideos();

  const retainedCodes = new Set(retained.map((video) => video.id));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="-ml-2 mb-2">
            <ArrowLeft size={15} />
            Retour
          </Button>
          <h1 className="text-xl font-semibold text-slate-800">Vidéos masquées</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Les vidéos cochées sont exclues des statistiques du Media Kit. Le site
            garde ensuite les {STATS_WINDOW} vidéos les plus récentes parmi celles
            qui restent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={reload} disabled={loading || saving}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
            Recharger
          </Button>
          <Button onClick={save} loading={saving} disabled={loading}>
            <Save size={15} />
            Enregistrer
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {savedAt && !error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check size={15} />
          Banlist enregistrée à {savedAt.toLocaleTimeString('fr-FR')}. Le site en
          tiendra compte à la prochaine image publiée.
        </div>
      )}

      {loading ? (
        <Spinner label="Lecture de youtube-stats.json…" />
      ) : videos.length === 0 ? (
        <Card className="p-6 text-sm text-slate-500">
          Aucune vidéo dans <code>public/youtube-stats.json</code>. Le workflow n8n
          ne l'a peut-être pas encore alimenté.
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <SectionTitle icon={<EyeOff size={15} />}>
              {videos.length} dernières vidéos
            </SectionTitle>
            <ul className="divide-y divide-slate-100">
              {videos.map((video) => {
                const isHidden = hiddenCodes.has(video.id);
                const isRetained = retainedCodes.has(video.id);
                return (
                  <li
                    key={video.id}
                    className={`flex items-center gap-3 px-5 py-3 ${
                      isHidden ? 'bg-slate-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`hide-${video.id}`}
                      checked={isHidden}
                      onChange={() => toggle(video.id, video.title)}
                      className="h-4 w-4 shrink-0 accent-brand"
                    />
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt=""
                      className={`h-10 w-[70px] shrink-0 rounded object-cover ${
                        isHidden ? 'opacity-40 grayscale' : ''
                      }`}
                    />
                    <label
                      htmlFor={`hide-${video.id}`}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <span
                        className={`block truncate text-sm ${
                          isHidden
                            ? 'text-slate-400 line-through'
                            : 'font-medium text-slate-800'
                        }`}
                      >
                        {video.title}
                      </span>
                      <span className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-500">
                        <span>{formatFr(video.publishedAt.slice(0, 10))}</span>
                        <span>{formatDuration(video.duration)}</span>
                        <span>{formatCount(video.viewCount)} vues</span>
                      </span>
                    </label>

                    {isHidden ? (
                      <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                        masquée
                      </span>
                    ) : isRetained ? (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                        <Eye size={12} />
                        comptée
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-1 text-xs text-slate-400">
                        hors fenêtre
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="h-fit">
            <SectionTitle icon={<Eye size={15} />}>Ce que verra le site</SectionTitle>
            <dl className="space-y-4 px-5 py-4">
              <div>
                <dt className="text-xs text-slate-500">Vidéos comptées</dt>
                <dd className="text-2xl font-semibold text-slate-800">
                  {retained.length}
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    sur {videos.length}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Vues moyennes par vidéo</dt>
                <dd className="text-2xl font-semibold text-slate-800">
                  {formatCount(preview.averageViews)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Taux d'engagement</dt>
                <dd className="text-2xl font-semibold text-slate-800">
                  {preview.engagementRate} %
                </dd>
              </div>
            </dl>
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Aperçu calculé ici avec la même règle que le site. Les chiffres
              publiés ne bougeront qu'après la prochaine construction de l'image.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
