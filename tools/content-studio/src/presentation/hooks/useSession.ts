import { useCallback, useEffect, useMemo, useState } from 'react';
import { SignIn } from '../../application/auth/usecases/AuthenticateUseCases';
import type { Session } from '../../domain/auth/entities/GitHubUser';
import { SessionAuthRepository } from '../../infrastructure/auth/SessionAuthRepository';
import { CONFIG_ERROR } from '../../shared/config';

type Phase = 'restoring' | 'anonymous' | 'authenticated' | 'denied';

/** Motifs de retour d'OAuth, posés par le serveur dans l'URL. */
const LOGIN_ERRORS: Record<string, string> = {
  refus: "Autorisation refusée sur GitHub.",
  state: 'La connexion a expiré ou n’a pas pu être vérifiée. Réessaie.',
  connexion: "La connexion à GitHub a échoué. Vérifie la configuration de l'OAuth App.",
};

export const useSession = () => {
  const signIn = useMemo(() => new SignIn(new SessionAuthRepository()), []);
  const [phase, setPhase] = useState<Phase>('restoring');
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(CONFIG_ERROR);

  const refresh = useCallback(async () => {
    try {
      const current = await signIn.restore();
      if (!current) {
        setSession(null);
        setPhase('anonymous');
        return;
      }
      setSession(current);
      setPhase(current.canWrite ? 'authenticated' : 'denied');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Session illisible');
      setPhase('anonymous');
    }
  }, [signIn]);

  useEffect(() => {
    // Le serveur redirige avec ?erreur=… quand le flux OAuth n'a pas abouti.
    const params = new URLSearchParams(window.location.search);
    const reason = params.get('erreur');
    if (reason) {
      setError(LOGIN_ERRORS[reason] ?? 'La connexion a échoué.');
      window.history.replaceState({}, '', window.location.pathname);
    }
    void refresh();
  }, [refresh]);

  const login = useCallback(() => {
    setError(null);
    signIn.start();
  }, [signIn]);

  const logout = useCallback(async () => {
    await signIn.signOut();
    setSession(null);
    setPhase('anonymous');
  }, [signIn]);

  return { phase, session, error, login, logout, refresh };
};
