import type { RecentYouTubeVideo } from '../../domain/youtube/entities/RecentYouTubeVideo';
import type { YouTubeFeedRepository } from '../../domain/youtube/repositories/YouTubeFeedRepository';

/** YouTube est lu par le serveur du Studio (pas de CORS côté navigateur). */
export class HttpYouTubeFeedRepository implements YouTubeFeedRepository {
  async fetchRecent(): Promise<RecentYouTubeVideo[]> {
    const response = await fetch('/api/youtube/recent', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    const payload = (await response.json().catch(() => null)) as
      | { videos?: RecentYouTubeVideo[]; error?: string }
      | null;
    if (!response.ok) throw new Error(payload?.error ?? `Erreur ${response.status}`);
    return payload?.videos ?? [];
  }
}
