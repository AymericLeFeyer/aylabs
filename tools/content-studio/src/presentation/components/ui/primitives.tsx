import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark disabled:bg-brand/50',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-200/70',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }
> = ({ variant = 'primary', loading, children, className = '', disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium
                transition disabled:cursor-not-allowed disabled:opacity-70 ${VARIANTS[variant]} ${className}`}
  >
    {loading && <Loader2 size={15} className="animate-spin" />}
    {children}
  </button>
);

export const Field: React.FC<{
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, error, required, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    {children}
    {error ? (
      <span className="mt-1 block text-xs text-red-600">{error}</span>
    ) : hint ? (
      <span className="mt-1 block text-xs text-slate-500">{hint}</span>
    ) : null}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} {...props} className={`field-input ${className}`} />
  )
);
Input.displayName = 'Input';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = '',
  ...props
}) => <textarea {...props} className={`field-input resize-y leading-relaxed ${className}`} />;

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {children}
  </section>
);

export const SectionTitle: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <h2 className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5 text-sm font-semibold uppercase tracking-wide text-slate-500">
    {icon}
    {children}
  </h2>
);

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}> = ({ open, onClose, title, children, width = 'max-w-2xl' }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-[8vh]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${width} overflow-hidden rounded-xl bg-white shadow-2xl`}>
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100" aria-label="Fermer">
            ✕
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-2 text-sm text-slate-500">
    <Loader2 size={15} className="animate-spin" />
    {label}
  </span>
);
