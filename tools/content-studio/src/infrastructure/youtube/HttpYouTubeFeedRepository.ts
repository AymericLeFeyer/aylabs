import type { RecentYouTubeVideo } from '../../domain/youtube/entities/RecentYouTubeVideo';
import type { YouTubeFeedRepository } from '../../domain/youtube/repositories/YouTubeFeedRepository';

/** YouTube est lu par le serveur du Studio (pas de CORS côté navigateur). */
export class HttpYouTubeFeedRepository implements YouTubeFeedRepository {
  async fetchRecent(): Promise<RecentYouTubeVideo[]> {
    const payload = await this.get<{ videos?: RecentYouTubeVideo[] }>('/api/youtube/recent');
    return payload.videos ?? [];
  }

  async fetchByCode(code: string): Promise<RecentYouTubeVideo> {
    const payload = await this.get<{ video?: RecentYouTubeVideo }>(
      `/api/youtube/video?code=${encodeURIComponent(code)}`
    );
    if (!payload.video) throw new Error('Réponse YouTube vide');
    return payload.video;
  }

  private async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
    const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!response.ok) throw new Error(payload?.error ?? `Erreur ${response.status}`);
    return payload ?? ({} as T);
  }
}
