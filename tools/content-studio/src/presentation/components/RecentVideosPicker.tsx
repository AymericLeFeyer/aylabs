import React, { useState } from 'react';
import { Check, Download, RefreshCw, Youtube } from 'lucide-react';
import type { ImportCandidate } from '../../domain/youtube/services/videoImport';
import { formatSeconds } from '../../domain/youtube/services/videoImport';
import { extractVideoCode, thumbnailUrl } from './VideoCodeField';
import { Button, Card, Input, SectionTitle, Spinner } from './ui/primitives';

interface Props {
  candidates: ImportCandidate[];
  loading: boolean;
  error: string | null;
  /** Code de la vidéo déjà importée dans le brouillon. */
  selected: string;
  onPick: (candidate: ImportCandidate) => void;
  onReload: () => void;
  /** Lecture d'une vidéo absente du flux, par son code. */
  onFetchCode: (code: string) => Promise<ImportCandidate>;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Le flux RSS ne voit ni les vidéos non répertoriées ni celles sorties des 15
 * dernières publications : on peut alors coller le code ou le lien.
 */
const CodeImport: React.FC<Pick<Props, 'onPick' | 'onFetchCode'>> = ({ onPick, onFetchCode }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = extractVideoCode(value);
    if (!YOUTUBE_ID.test(code)) {
      setError('Code YouTube invalide : 11 caractères, ou un lien vers la vidéo');
      return;
    }
    setLoading(true);
    setError(null);
    setMissing([]);
    try {
      const candidate = await onFetchCode(code);
      if (candidate.hasCard) {
        setError('Une fiche existe déjà pour cette vidéo');
        return;
      }
      onPick(candidate);
      setValue('');
      // Sans clé d'API, YouTube peut ne livrer que le titre au serveur.
      const { video } = candidate;
      setMissing(
        [
          !video.description && 'description',
          !video.publishedAt && 'date et heure',
          video.durationSeconds === null && 'durée',
        ].filter((field): field is string => Boolean(field))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lecture de la vidéo impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-slate-100 px-5 py-3">
      <p className="mb-2 text-xs text-slate-500">
        Vidéo absente de la liste ? Colle son code ou son lien.
      </p>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
            setMissing([]);
          }}
          placeholder="dQw4w9WgXcQ ou https://youtu.be/…"
          className="font-mono"
        />
        <Button type="submit" variant="secondary" loading={loading} disabled={!value.trim() || loading}>
          {!loading && <Download size={15} />}
          Importer
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {missing.length > 0 && (
        <p className="mt-2 text-sm text-amber-700">
          Import partiel, YouTube n'a pas tout transmis : {missing.join(', ')} à compléter.
        </p>
      )}
    </form>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * Dernières vidéos de la chaîne : un clic remplit titre, description, code,
 * date, heure et durée. Il ne reste que les tags à choisir.
 */
export const RecentVideosPicker: React.FC<Props> = ({
  candidates,
  loading,
  error,
  selected,
  onPick,
  onReload,
  onFetchCode,
}) => (
  <Card>
    <div className="flex items-center justify-between border-b border-slate-100 pr-3">
      <div className="flex-1 [&>h2]:border-0">
        <SectionTitle icon={<Youtube size={15} />}>Importer depuis YouTube</SectionTitle>
      </div>
      <button
        onClick={onReload}
        disabled={loading}
        className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        title="Relire la chaîne"
      >
        <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
      </button>
    </div>

    <div className="p-3">
      {loading ? (
        <div className="px-2 py-3">
          <Spinner label="Lecture de la chaîne YouTube…" />
        </div>
      ) : error ? (
        <p className="px-2 py-3 text-sm text-red-600">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="px-2 py-3 text-sm text-slate-500">
          Aucune vidéo longue parmi les dernières publications de la chaîne.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {candidates.map((candidate) => {
            const { video, hasCard } = candidate;
            const isSelected = video.code === selected;
            return (
              <li key={video.code}>
                <button
                  type="button"
                  onClick={() => onPick(candidate)}
                  disabled={hasCard}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                    isSelected
                      ? 'border-brand bg-brand/5'
                      : 'border-slate-200 hover:border-brand/50 hover:bg-slate-50'
                  } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-transparent`}
                >
                  <img
                    src={thumbnailUrl(video.code, 'mq')}
                    alt=""
                    loading="lazy"
                    className="h-12 w-[85px] shrink-0 rounded object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-medium text-slate-800">{video.title}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                      <span>{formatDate(video.publishedAt)}</span>
                      {video.durationSeconds !== null && <span>· {formatSeconds(video.durationSeconds)}</span>}
                      {hasCard && <span className="chip bg-slate-100 text-slate-600">Fiche existante</span>}
                    </span>
                  </span>
                  {isSelected && <Check size={16} className="shrink-0 text-brand" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>

    <CodeImport onPick={onPick} onFetchCode={onFetchCode} />
  </Card>
);
