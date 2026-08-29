import React, { useEffect, useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { Field, Input } from './ui/primitives';

type Status = 'idle' | 'loading' | 'ok' | 'error';

/** URL d'image avec aperçu immédiat : on voit tout de suite si le lien est mort. */
export const ImageField: React.FC<{
  value: string;
  onChange: (next: string) => void;
  label?: string;
}> = ({ value, onChange, label = "URL de l'image" }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [dimensions, setDimensions] = useState<string | null>(null);

  useEffect(() => {
    const url = value.trim();
    if (!url) {
      setStatus('idle');
      setDimensions(null);
      return;
    }
    setStatus('loading');
    setDimensions(null);
    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      setStatus('ok');
      setDimensions(`${img.naturalWidth} × ${img.naturalHeight}`);
    };
    img.onerror = () => !cancelled && setStatus('error');
    // Laisse le temps de finir de coller/taper l'URL
    const timer = window.setTimeout(() => {
      img.src = url;
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
      <Field
        label={label}
        hint={
          status === 'error'
            ? undefined
            : dimensions
            ? `Image chargée · ${dimensions}`
            : 'Colle le lien direct vers le visuel produit'
        }
        error={status === 'error' ? 'Image introuvable à cette URL' : null}
      >
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://cdn2.domadoo.fr/produit.jpg"
          spellCheck={false}
        />
      </Field>

      <div className="flex h-[86px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 sm:mt-6">
        {status === 'ok' ? (
          <img src={value} alt="Aperçu" className="h-full w-full object-contain" />
        ) : status === 'loading' ? (
          <Loader2 size={18} className="animate-spin text-slate-400" />
        ) : (
          <ImageOff size={18} className="text-slate-300" />
        )}
      </div>
    </div>
  );
};
