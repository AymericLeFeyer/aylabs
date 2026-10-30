import type { ApiChannel, ApiVideo } from './report.ts';

const API_URL = 'https://www.googleapis.com/youtube/v3';
const MAX_RESULTS = 50;
const TIMEOUT_MS = 30_000;

/** La clé passe en en-tête : une URL finit trop facilement dans un message d'erreur. */
const get = async <T>(
  apiKey: string,
  endpoint: string,
  params: Record<string, string>
): Promise<T> => {
  const url = `${API_URL}/${endpoint}?${new URLSearchParams(params)}`;
  const response = await fetch(url, {
    headers: { 'X-Goog-Api-Key': apiKey },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      `YouTube ${endpoint} : ${response.status} ${body?.error?.message ?? ''}`.trim()
    );
  }
  return (await response.json()) as T;
};

export const fetchChannel = async (
  apiKey: string,
  channelId: string
): Promise<ApiChannel> => {
  const { items } = await get<{ items?: ApiChannel[] }>(apiKey, 'channels', {
    part: 'statistics,snippet',
    id: channelId,
  });
  const channel = items?.[0];
  if (!channel) throw new Error(`YouTube : chaîne ${channelId} introuvable`);
  return channel;
};

/** Les dernières vidéos : `search` donne les identifiants, `videos` les chiffres. */
export const fetchRecentVideos = async (
  apiKey: string,
  channelId: string
): Promise<ApiVideo[]> => {
  const search = await get<{ items?: { id: { videoId: string } }[] }>(apiKey, 'search', {
    part: 'snippet',
    channelId,
    maxResults: String(MAX_RESULTS),
    order: 'date',
    type: 'video',
  });
  const ids = (search.items ?? []).map((item) => item.id.videoId);
  // Une liste vide viderait les graphiques du site : mieux vaut échouer.
  if (ids.length === 0) throw new Error('YouTube : aucune vidéo renvoyée');

  const { items } = await get<{ items?: ApiVideo[] }>(apiKey, 'videos', {
    part: 'statistics,contentDetails,snippet',
    id: ids.join(','),
  });
  return items ?? [];
};
