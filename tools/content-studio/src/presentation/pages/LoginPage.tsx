import React from 'react';
import { AlertCircle, Github, LogOut, ShieldCheck, ShieldX } from 'lucide-react';
import type { Session } from '../../domain/auth/entities/GitHubUser';
import { REPO } from '../../shared/config';
import { Button, Card, Spinner } from '../components/ui/primitives';

interface Props {
  phase: string;
  session: Session | null;
  error: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const LoginPage: React.FC<Props> = ({ phase, session, error, onLogin, onLogout }) => {
  const denied = phase === 'denied';

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">AyLabs Content Studio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestion des vidéos et des produits de{' '}
            <span className="font-medium text-slate-600">
              {REPO.owner}/{REPO.name}
            </span>
          </p>
        </div>

        <Card className="p-6">
          {denied ? (
            <div className="space-y-5 text-center">
              <div className="flex flex-col items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <ShieldX size={22} className="text-red-600" />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Accès refusé</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Le compte <span className="font-medium">{session?.user.login}</span> n&apos;a pas
                    le droit d&apos;écriture sur {REPO.owner}/{REPO.name}.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={onLogout} className="w-full">
                <LogOut size={15} />
                Changer de compte
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-start gap-3 rounded-lg bg-brand-light p-3 text-sm text-brand-dark">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                <p>
                  L&apos;accès est réservé aux comptes disposant du droit d&apos;écriture sur le
                  dépôt. Chaque enregistrement crée un commit signé de ton compte GitHub.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {phase === 'restoring' ? (
                <div className="flex justify-center py-2">
                  <Spinner label="Vérification de la session" />
                </div>
              ) : (
                <Button onClick={onLogin} className="w-full bg-slate-900 hover:bg-slate-800">
                  <Github size={16} />
                  Se connecter avec GitHub
                </Button>
              )}
            </>
          )}
        </Card>

        <p className="mt-4 text-center text-xs text-slate-400">
          Le jeton GitHub reste côté serveur, dans un cookie chiffré.
        </p>
      </div>
    </main>
  );
};
