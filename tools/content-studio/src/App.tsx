import React, { useCallback, useState } from 'react';
import { LogOut } from 'lucide-react';
import type { ContentKind } from './domain/content/entities/ContentItem';
import type { GitHubUser } from './domain/auth/entities/GitHubUser';
import { REPO } from './shared/config';
import { DashboardPage } from './presentation/pages/DashboardPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { ProductEditorPage } from './presentation/pages/ProductEditorPage';
import { VideoEditorPage } from './presentation/pages/VideoEditorPage';
import { useCatalog } from './presentation/hooks/useCatalog';
import { useSession } from './presentation/hooks/useSession';
import type { EditorMode } from './presentation/hooks/useDraftEditor';

type Route =
  | { name: 'dashboard' }
  | { name: 'editor'; kind: ContentKind; mode: EditorMode; slug?: string };

export const App: React.FC = () => {
  const { phase, session, error, login, logout } = useSession();

  if (phase !== 'authenticated' || !session) {
    return (
      <LoginPage phase={phase} session={session} error={error} onLogin={login} onLogout={logout} />
    );
  }

  return <Studio user={session.user} onLogout={logout} />;
};

const Studio: React.FC<{ user: GitHubUser; onLogout: () => void }> = ({ user, onLogout }) => {
  const { catalog, videos, products, suggestions, byKind, slugs, syncing, syncError, sync, repository } =
    useCatalog();
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });

  const goDashboard = useCallback(() => setRoute({ name: 'dashboard' }), []);

  const handleSaved = useCallback(() => {
    // Le commit vient d'être créé : on relit GitHub pour repartir sur l'état réel.
    void sync();
  }, [sync]);

  if (route.name === 'editor') {
    const source = route.slug ? byKind(route.kind).find((f) => f.slug === route.slug) : undefined;
    const common = {
      mode: route.mode,
      source,
      videos,
      suggestions,
      takenSlugs: slugs(route.kind),
      repository,
      onBack: goDashboard,
      onSaved: handleSaved,
    };
    return route.kind === 'video' ? (
      <VideoEditorPage key={`${route.mode}-${route.slug ?? 'new'}`} {...common} />
    ) : (
      <ProductEditorPage key={`${route.mode}-${route.slug ?? 'new'}`} {...common} />
    );
  }

  return (
    <>
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3">
          <span className="text-sm font-semibold text-brand">AyLabs Content Studio</span>
          <span className="text-xs text-slate-400">
            {REPO.owner}/{REPO.name}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
              {user.login}
            </span>
            <button
              onClick={onLogout}
              className="rounded p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              title="Se déconnecter"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      <DashboardPage
        videos={videos}
        products={products}
        syncing={syncing}
        syncError={syncError}
        outOfSync={catalog.outOfSync}
        onSync={sync}
        onCreate={(kind) => setRoute({ name: 'editor', kind, mode: 'create' })}
        onEdit={(kind, slug) => setRoute({ name: 'editor', kind, mode: 'edit', slug })}
        onDuplicate={(kind, slug) => setRoute({ name: 'editor', kind, mode: 'duplicate', slug })}
      />
    </>
  );
};
