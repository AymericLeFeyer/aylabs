import React, { useState } from 'react';
import { AlertCircle, BarChart3, CheckCircle2, GitCommit, Package, Video, X } from 'lucide-react';
import type { ChangeScope, CommitResult, PendingChange } from '../../domain/changes/entities/PendingChange';
import { REPO } from '../../shared/config';
import { Button, Modal } from './ui/primitives';

interface Props {
  changes: PendingChange[];
  committing: boolean;
  error: string | null;
  lastCommit: CommitResult | null;
  onDiscard: (path: string) => void;
  onCommit: () => void;
}

const SCOPE_ICONS: Record<ChangeScope, React.ReactNode> = {
  video: <Video size={15} />,
  product: <Package size={15} />,
  stats: <BarChart3 size={15} />,
};

/**
 * Bouton de la barre du Studio : compte les modifications en attente et ouvre
 * la liste, d'où on retire un fichier ou on commite le tout en une fois.
 */
export const PendingChangesPanel: React.FC<Props> = ({
  changes,
  committing,
  error,
  lastCommit,
  onDiscard,
  onCommit,
}) => {
  const [open, setOpen] = useState(false);
  const count = changes.length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 rounded px-2 py-1.5 text-sm ${
          count > 0
            ? 'bg-amber-50 font-medium text-amber-800 hover:bg-amber-100'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        }`}
        title="Modifications enregistrées, pas encore commitées"
      >
        <GitCommit size={15} />
        {count > 0 ? `${count} en attente` : 'Commit'}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Modifications en attente">
        <div className="space-y-4 p-5">
          <p className="text-sm text-slate-500">
            Tout part dans <strong>un seul commit</strong> sur <code>{REPO.branch}</code>, donc
            un seul déploiement du site.
          </p>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {lastCommit && count === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Commit envoyé, le déploiement démarre.</span>
              <a
                href={lastCommit.commitUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto font-medium hover:underline"
              >
                Voir le commit
              </a>
            </div>
          )}

          {count === 0 ? (
            !lastCommit && (
              <p className="py-6 text-center text-sm text-slate-500">
                Rien en attente. « Enregistrer » dans un éditeur ajoute la fiche ici.
              </p>
            )
          ) : (
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {changes.map((change) => (
                <li key={change.path} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-slate-400">{SCOPE_ICONS[change.scope]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-800">{change.message}</span>
                    <code className="block truncate text-xs text-slate-400">{change.path}</code>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {new Date(change.stagedAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={() => onDiscard(change.path)}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Abandonner cette modification"
                    disabled={committing}
                  >
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button onClick={onCommit} loading={committing} disabled={count === 0}>
            <GitCommit size={15} />
            Commiter et déployer{count > 0 ? ` (${count})` : ''}
          </Button>
        </footer>
      </Modal>
    </>
  );
};
