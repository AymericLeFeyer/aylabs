import React, { useMemo, useState } from 'react';
import {
  Copy,
  ExternalLink,
  FileText,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Video,
} from 'lucide-react';
import type { ContentFile, ContentKind } from '../../domain/content/entities/ContentItem';
import { formatFr, toIsoDate } from '../../shared/date';
import { REPO } from '../../shared/config';
import { thumbnailUrl } from '../components/VideoCodeField';
import { Button, Card, Input, Spinner } from '../components/ui/primitives';

interface Props {
  videos: ContentFile[];
  products: ContentFile[];
  syncing: boolean;
  syncError: string | null;
  outOfSync: string[];
  onSync: () => void;
  onCreate: (kind: ContentKind) => void;
  onEdit: (kind: ContentKind, slug: string) => void;
  onDuplicate: (kind: ContentKind, slug: string) => void;
}

const TABS: { kind: ContentKind; label: string; icon: React.ReactNode }[] = [
  { kind: 'video', label: 'Vidéos', icon: <Video size={15} /> },
  { kind: 'product', label: 'Produits', icon: <Package size={15} /> },
];

export const DashboardPage: React.FC<Props> = ({
  videos,
  products,
  syncing,
  syncError,
  outOfSync,
  onSync,
  onCreate,
  onEdit,
  onDuplicate,
}) => {
  const [kind, setKind] = useState<ContentKind>('video');
  const [query, setQuery] = useState('');

  const items = kind === 'video' ? videos : products;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...items].sort(
      (a, b) =>
        new Date(toIsoDate(String(b.frontmatter.pubDate ?? ''))).getTime() -
        new Date(toIsoDate(String(a.frontmatter.pubDate ?? ''))).getTime()
    );
    if (!q) return sorted;
    return sorted.filter((item) => {
      const fm = item.frontmatter;
      const haystack = [
        fm.title,
        fm.description,
        item.slug,
        fm.category,
        (fm.tags as string[] | undefined)?.join(' '),
        (fm.protocols as string[] | undefined)?.join(' '),
        (fm.compatible as string[] | undefined)?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contenu du site</h1>
          <p className="mt-1 text-sm text-slate-500">
            {videos.length} vidéos · {products.length} produits ·{' '}
            <span className="text-slate-400">branche {REPO.branch}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {syncing ? (
            <Spinner label="Synchronisation GitHub" />
          ) : (
            <Button variant="ghost" onClick={onSync} title="Recharger depuis GitHub">
              <RefreshCw size={15} />
              Actualiser
            </Button>
          )}
          <Button onClick={() => onCreate(kind)}>
            <Plus size={16} />
            {kind === 'video' ? 'Nouvelle vidéo' : 'Nouveau produit'}
          </Button>
        </div>
      </header>

      {syncError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Impossible de lire GitHub ({syncError}). Les fiches affichées viennent du dépôt local et
          peuvent être en retard sur <code>{REPO.branch}</code>.
        </div>
      )}
      {!syncing && !syncError && outOfSync.length > 0 && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {outOfSync.length} fiche{outOfSync.length > 1 ? 's' : ''} diffèrent de{' '}
          {import.meta.env.DEV ? 'ta copie locale' : "l'instantané embarqué dans l'image"} — les
          versions affichées sont celles de GitHub
          {import.meta.env.DEV ? ', pense à git pull.' : '.'}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((tab) => (
            <button
              key={tab.kind}
              onClick={() => setKind(tab.kind)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
                kind === tab.kind ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={kind === tab.kind ? 'text-white/70' : 'text-slate-400'}>
                {tab.kind === 'video' ? videos.length : products.length}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un titre, un tag, un slug..."
            className="pl-9"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {filtered.map((item) => (
            <Row
              key={item.slug}
              item={item}
              kind={kind}
              onEdit={() => onEdit(kind, item.slug)}
              onDuplicate={() => onDuplicate(kind, item.slug)}
            />
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-slate-500">
              Aucun résultat pour « {query} »
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

const Row: React.FC<{
  item: ContentFile;
  kind: ContentKind;
  onEdit: () => void;
  onDuplicate: () => void;
}> = ({ item, kind, onEdit, onDuplicate }) => {
  const fm = item.frontmatter;
  const code = String((kind === 'video' ? fm.code : fm.videoCode) ?? '');
  const image = kind === 'product' ? String(fm.image ?? '') : '';
  const tags = (fm.tags as string[] | undefined) ?? [];

  return (
    <li className="group flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
      <div className="h-12 w-[85px] shrink-0 overflow-hidden rounded bg-slate-100">
        {kind === 'product' && image ? (
          <img src={image} alt="" loading="lazy" className="h-full w-full object-contain" />
        ) : code ? (
          <img src={thumbnailUrl(code, 'mq')} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText size={16} className="text-slate-300" />
          </div>
        )}
      </div>

      <button onClick={onEdit} className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-medium text-slate-800">
          {String(fm.title ?? item.slug)}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span>{formatFr(String(fm.pubDate ?? ''))}</span>
          {kind === 'video' && fm.duration ? <span>· {String(fm.duration)}</span> : null}
          {kind === 'product' && fm.price !== undefined ? <span>· {String(fm.price)} €</span> : null}
          {kind === 'product' && fm.promoCode ? (
            <span className="chip bg-orange-50 text-orange-700">
              {String((fm.promoCode as Record<string, unknown>).code)}
            </span>
          ) : null}
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip bg-slate-100 text-slate-600">
              {tag}
            </span>
          ))}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
        {code && (
          <a
            href={`https://youtu.be/${code}`}
            target="_blank"
            rel="noreferrer"
            className="rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            title="Voir sur YouTube"
          >
            <ExternalLink size={15} />
          </a>
        )}
        <button
          onClick={onDuplicate}
          className="rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          title="Dupliquer cette fiche"
        >
          <Copy size={15} />
        </button>
        <button
          onClick={onEdit}
          className="rounded p-2 text-slate-400 hover:bg-slate-200 hover:text-brand"
          title="Modifier"
        >
          <Pencil size={15} />
        </button>
      </div>
    </li>
  );
};
