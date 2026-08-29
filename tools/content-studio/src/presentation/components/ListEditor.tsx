import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { detectPlatform, isKnownPlatform } from '../../domain/content/services/buyLinks';
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
            <Input
              value={item}
              onChange={(e) => update(index, e.target.value)}
              spellCheck={variant === 'text'}
              className={variant === 'link' ? 'text-xs' : ''}
            />
            {variant === 'link' && item.trim() && (
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span
                  className={`chip ${
                    isKnownPlatform(item) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {detectPlatform(item)}
                </span>
                {!isKnownPlatform(item) && (
                  <span className="text-amber-600">affiché comme lien générique sur le site</span>
                )}
                <a
                  href={item}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-slate-400 hover:text-brand"
                >
                  Tester <ExternalLink size={11} />
                </a>
              </div>
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
