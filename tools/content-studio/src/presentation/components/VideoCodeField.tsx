import React, { useMemo, useState } from 'react';
import { Search, Youtube } from 'lucide-react';
import type { ContentFile } from '../../domain/content/entities/ContentItem';
import { formatFr } from '../../shared/date';
import { Button, Field, Input, Modal } from './ui/primitives';

export const thumbnailUrl = (code: string, quality: 'mq' | 'hq' | 'maxres' = 'hq') =>
  `https://i.ytimg.com/vi/${code}/${quality}default.jpg`;

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** Extrait l'identifiant d'une URL YouTube collée telle quelle. */
export const extractVideoCode = (input: string): string => {
  const raw = input.trim();
  if (YOUTUBE_ID.test(raw)) return raw;
  const match = raw.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : raw;
};

interface Props {
  value: string;
  onChange: (code: string) => void;
  /** Vidéos déjà publiées sur le site, servant de catalogue de sélection. */
  videos: ContentFile[];
  label?: string;
  hint?: string;
}

export const VideoCodeField: React.FC<Props> = ({
  value,
  onChange,
  videos,
  label = 'Code vidéo YouTube',
  hint,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [thumbError, setThumbError] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...videos].sort(
      (a, b) =>
        new Date(String(b.frontmatter.pubDate ?? 0)).getTime() -
        new Date(String(a.frontmatter.pubDate ?? 0)).getTime()
    );
    if (!q) return sorted;
    return sorted.filter((v) => {
      const tags = (v.frontmatter.tags as string[] | undefined)?.join(' ') ?? '';
      return `${v.frontmatter.title} ${v.slug} ${v.frontmatter.code} ${tags}`
        .toLowerCase()
        .includes(q);
    });
  }, [videos, query]);

  const handleChange = (raw: string) => {
    setThumbError(false);
    onChange(extractVideoCode(raw));
  };

  const usedBy = videos.find((v) => v.frontmatter.code === value);

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
      <Field
        label={label}
        hint={
          usedBy
            ? `Vidéo du site : ${usedBy.frontmatter.title}`
            : hint ?? 'Colle un identifiant ou une URL YouTube complète'
        }
        error={value && !YOUTUBE_ID.test(value) ? 'Identifiant YouTube attendu (11 caractères)' : null}
      >
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="XMsyoy2Ketw"
            spellCheck={false}
            className="font-mono"
          />
          <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)} className="shrink-0">
            <Youtube size={15} className="text-red-500" />
            Parcourir
          </Button>
        </div>
      </Field>

      <div className="flex h-[86px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 sm:mt-6">
        {value && YOUTUBE_ID.test(value) && !thumbError ? (
          <a href={`https://youtu.be/${value}`} target="_blank" rel="noreferrer" title="Ouvrir sur YouTube">
            <img
              src={thumbnailUrl(value)}
              alt="Miniature"
              className="h-full w-full object-cover"
              onError={() => setThumbError(true)}
            />
          </a>
        ) : (
          <Youtube size={20} className="text-slate-300" />
        )}
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={`Choisir parmi les ${videos.length} vidéos du site`}
        width="max-w-3xl"
      >
        <div className="border-b border-slate-100 p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un titre, un tag..."
              className="pl-9"
            />
          </div>
        </div>
        <ul className="scroll-thin max-h-[55vh] divide-y divide-slate-100 overflow-auto">
          {results.map((video) => {
            const code = String(video.frontmatter.code ?? '');
            return (
              <li key={video.slug}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(code);
                    setThumbError(false);
                    setPickerOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50"
                >
                  <img
                    src={thumbnailUrl(code, 'mq')}
                    alt=""
                    loading="lazy"
                    className="h-12 w-[85px] shrink-0 rounded bg-slate-200 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {String(video.frontmatter.title ?? video.slug)}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {formatFr(String(video.frontmatter.pubDate ?? ''))} · {String(video.frontmatter.duration ?? '')}
                    </span>
                  </span>
                  <code className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">{code}</code>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-slate-500">Aucune vidéo ne correspond</li>
          )}
        </ul>
      </Modal>
    </div>
  );
};
