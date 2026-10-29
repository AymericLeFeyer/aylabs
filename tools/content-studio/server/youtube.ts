// Client HTTP centralisé pour YouTube, côté serveur : le navigateur ne peut pas
// lire ces pages lui-même (pas de CORS). Aucune clé d'API : le flux RSS public de
// la chaîne donne titre, description et date, la page de la vidéo donne la durée.

const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=';
const WATCH_URL = 'https://www.youtube.com/watch?v=';
const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Sans ces cookies, une IP européenne peut être renvoyée vers la page de
// consentement de Google, qui ne contient pas la durée.
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  Cookie: 'CONSENT=YES+cb; SOCS=CAI',
};

export interface RecentYouTubeVideo {
  code: string;
  title: string;
  description: string;
  /** Date de mise en ligne, ISO 8601 UTC. */
  publishedAt: string;
  /** Durée en secondes, `null` si la page de la vidéo n'a pas pu être lue. */
  durationSeconds: number | null;
  /** Le flux pointe les shorts vers `/shorts/<code>` plutôt que `/watch`. */
  isShort: boolean;
}

let cache: { channelId: string; at: number; videos: RecentYouTubeVideo[] } | null = null;

const decodeXml = (value: string): string =>
  value
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const tag = (xml: string, name: string): string => {
  const match = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(xml);
  return match ? decodeXml(match[1]).trim() : '';
};

/** Le flux n'a que les 15 dernières publications, shorts compris. */
export const parseFeed = (xml: string): Omit<RecentYouTubeVideo, 'durationSeconds'>[] =>
  [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => ({
      code: tag(entry, 'yt:videoId'),
      title: tag(entry, 'title'),
      description: tag(entry, 'media:description'),
      publishedAt: tag(entry, 'published'),
      isShort: /<link rel="alternate" href="[^"]*\/shorts\//.test(entry),
    }))
    .filter((video) => video.code !== '');

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`YouTube ${url} → ${response.status}`);
  return response.text();
};

/** Lit `"lengthSeconds"` dans la page de la vidéo. Best effort : `null` en cas d'échec. */
const fetchDuration = async (code: string): Promise<number | null> => {
  try {
    const html = await fetchText(`${WATCH_URL}${code}`);
    const match = /"lengthSeconds":"(\d+)"/.exec(html);
    return match ? Number(match[1]) : null;
  } catch {
    return null;
  }
};

export async function fetchRecentVideos(channelId: string): Promise<RecentYouTubeVideo[]> {
  if (cache && cache.channelId === channelId && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.videos;
  }

  const entries = parseFeed(await fetchText(`${FEED_URL}${encodeURIComponent(channelId)}`));
  // La durée ne sert qu'aux vidéos longues : pas de requête pour les shorts.
  const videos = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      durationSeconds: entry.isShort ? null : await fetchDuration(entry.code),
    }))
  );

  cache = { channelId, at: Date.now(), videos };
  return videos;
}
