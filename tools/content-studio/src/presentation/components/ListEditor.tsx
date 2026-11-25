import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { defaultGenericLabel, detectPlatform, isKnownPlatform, joinBuyLink, splitBuyLink } from '../../domain/content/services/buyLinks';
import { Button, Input } from './ui/primitives';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  /** Affiche la plateforme détectée et un avertissement si le site ne sait pas la router. */
  variant?: 'text' | 'link';
  addLabel?: string;
}

/** Liste ordonnée éditable : pros, cons, liens d'achat. */
export const ListEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  variant = 'text',
  addLabel = 'Ajouter',
}) => {
  const [draft, setDraft] = useState('');

  const update = (index: number, next: string) =>
    onChange(value.map((item, i) => (i === index ? next : item)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const add = () => {
    const clean = draft.trim();
    if (!clean) return;
    onChange([...value, clean]);
    setDraft('');
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="group flex items-start gap-1.5">
          <div className="flex flex-col pt-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="rounded p-0.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
              aria-label="Monter"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === value.length - 1}
              className="rounded p-0.5 text-slate-300 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
              aria-label="Descendre"
            >
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            {variant === 'link' ? <LinkRow item={item} onChange={(next) => update(index, next)} /> : (
              <Input value={item} onChange={(e) => update(index, e.target.value)} spellCheck />
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="mt-2 rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-600"
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <div className="flex gap-2 pl-[26px]">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={variant === 'link' ? 'text-xs' : ''}
        />
        <Button type="button" variant="secondary" onClick={add} className="shrink-0">
          <Plus size={15} />
          {addLabel}
        </Button>
      </div>
    </div>
  );
};

/** Ligne d'un lien d'achat : URL + plateforme détectée, et label perso pour les liens génériques. */
const LinkRow: React.FC<{ item: string; onChange: (next: string) => void }> = ({ item, onChange }) => {
  const { url, label } = splitBuyLink(item);
  const known = isKnownPlatform(url);
  return (
    <>
      <Input
        value={url}
        onChange={(e) => onChange(known ? e.target.value : joinBuyLink(e.target.value, label))}
        className="text-xs"
      />
      {url && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={`chip ${known ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {detectPlatform(url)}
          </span>
          {!known && (
            <input
              value={label}
              onChange={(e) => onChange(joinBuyLink(url, e.target.value))}
              placeholder={`Label affiché (défaut : ${defaultGenericLabel(url)})`}
              className="min-w-[200px] flex-1 rounded border border-amber-200 bg-amber-50/50 px-2 py-1 text-xs text-slate-700 placeholder:text-amber-600/60 focus:border-amber-400 focus:outline-none"
            />
          )}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-slate-400 hover:text-brand"
          >
            Tester <ExternalLink size={11} />
          </a>
        </div>
      )}
    </>
  );
};
