import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Code2, GitCommit, Save } from 'lucide-react';
import { REPO } from '../../shared/config';
import { Button, Card } from './ui/primitives';

export interface SaveState {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
  commitUrl?: string;
}

interface Props {
  title: string;
  subtitle: string;
  path: string;
  markdown: string;
  errors: string[];
  saveState: SaveState;
  dirty: boolean;
  onBack: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

/** Cadre commun aux deux éditeurs : validation, aperçu du fichier, commit. */
export const EditorShell: React.FC<Props> = ({
  title,
  subtitle,
  path,
  markdown,
  errors,
  saveState,
  dirty,
  onBack,
  onSave,
  children,
}) => {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} />
            Retour
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-slate-800">{title}</h1>
            <p className="truncate text-xs text-slate-500">{subtitle}</p>
          </div>
          <Button variant="ghost" onClick={() => setShowSource((s) => !s)}>
            <Code2 size={15} />
            {showSource ? 'Masquer' : 'Aperçu'} du fichier
          </Button>
          <Button onClick={onSave} loading={saveState.status === 'saving'} disabled={errors.length > 0}>
            <Save size={15} />
            Enregistrer
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-5 px-6 py-6">
        {errors.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="mb-1 flex items-center gap-2 font-medium">
              <AlertCircle size={15} />
              À compléter avant d&apos;enregistrer
            </p>
            <ul className="list-inside list-disc space-y-0.5 pl-1">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {saveState.status === 'error' && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{saveState.message}</span>
          </div>
        )}

        {saveState.status === 'saved' && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Fiche commitée sur {REPO.branch}.</span>
            {saveState.commitUrl && (
              <a
                href={saveState.commitUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 font-medium hover:underline"
              >
                <GitCommit size={14} />
                Voir le commit
              </a>
            )}
          </div>
        )}

        {showSource && (
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
              <code className="text-xs text-slate-600">{path}</code>
              <span className="text-xs text-slate-400">{markdown.length} caractères</span>
            </div>
            <pre className="scroll-thin max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-slate-700">
              {markdown}
            </pre>
          </Card>
        )}

        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3">
          <code className="truncate text-xs text-slate-500">{path}</code>
          <span className="ml-auto text-xs text-slate-400">
            {dirty ? 'Modifications non enregistrées' : 'Aucune modification'}
          </span>
          <Button onClick={onSave} loading={saveState.status === 'saving'} disabled={errors.length > 0}>
            <GitCommit size={15} />
            Commit sur {REPO.branch}
          </Button>
        </div>
      </div>
    </div>
  );
};
