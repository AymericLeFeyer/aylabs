import React, { useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  /** Valeurs déjà utilisées ailleurs dans le contenu, les plus fréquentes en tête. */
  suggestions: string[];
  placeholder?: string;
  allowCreate?: boolean;
}

/**
 * Saisie multi-valeurs : propose systématiquement ce qui existe déjà dans le
 * contenu pour éviter les doublons ("Mini PC" vs "Mini-PC").
 */
export const TagCombobox: React.FC<Props> = ({
  value,
  onChange,
  suggestions,
  placeholder = 'Ajouter…',
  allowCreate = true,
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const available = useMemo(() => {
    const selected = new Set(value.map((v) => v.toLowerCase()));
    const q = query.trim().toLowerCase();
    return suggestions
      .filter((s) => !selected.has(s.toLowerCase()))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true));
  }, [suggestions, value, query]);

  const exactExists = available.some((s) => s.toLowerCase() === query.trim().toLowerCase());
  const canCreate = allowCreate && query.trim().length > 0 && !exactExists &&
    !value.some((v) => v.toLowerCase() === query.trim().toLowerCase());

  const add = (tag: string) => {
    const clean = tag.trim();
    if (!clean || value.some((v) => v.toLowerCase() === clean.toLowerCase())) return;
    onChange([...value, clean]);
    setQuery('');
    setHighlight(0);
    inputRef.current?.focus();
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  const options = canCreate ? [...available, `__create__${query.trim()}`] : available;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = options[highlight];
      if (picked) add(picked.startsWith('__create__') ? picked.slice(10) : picked);
      else if (query.trim()) add(query);
    } else if (e.key === 'Backspace' && !query && value.length) {
      remove(value[value.length - 1]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5
                   focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span key={tag} className="chip bg-brand-light text-brand-dark">
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              className="rounded-full p-0.5 hover:bg-brand/20"
              aria-label={`Retirer ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[120px] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {open && options.length > 0 && (
        <ul className="scroll-thin absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((option, index) => {
            const isCreate = option.startsWith('__create__');
            const label = isCreate ? option.slice(10) : option;
            return (
              <li key={option}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => add(label)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${
                    index === highlight ? 'bg-brand-light text-brand-dark' : 'text-slate-700'
                  }`}
                >
                  {isCreate && <Plus size={13} className="shrink-0" />}
                  <span className="truncate">{label}</span>
                  {isCreate && <span className="ml-auto text-xs text-slate-400">nouvelle valeur</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
