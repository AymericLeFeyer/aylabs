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

const API_URL = 'https://www.googleapis.com/youtube/v3/videos';
const OEMBED_URL = 'https://www.youtube.com/oembed?format=json&url=';

/** Fragment de `ytInitialPlayerResponse` utilisé par l'import d'une vidéo précise. */
interface PlayerResponse {
  playabilityStatus?: { status?: string; reason?: string };
  videoDetails?: {
    videoId?: string;
    title?: string;
    shortDescription?: string;
    lengthSeconds?: string;
  };
  microformat?: { playerMicroformatRenderer?: { publishDate?: string; uploadDate?: string } };
}

export class YouTubeVideoNotFoundError extends Error {}

const toIso = (value: string | undefined): string => {
  const parsed = new Date(value ?? '');
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
};

const positiveOrNull = (value: number): number | null =>
  Number.isFinite(value) && value > 0 ? value : null;

/** `PT1H2M5S` → 3725. */
const isoDurationSeconds = (value: string): number | null => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value);
  if (!match) return null;
  const [, h = '0', m = '0', s = '0'] = match;
  return positiveOrNull(Number(h) * 3600 + Number(m) * 60 + Number(s));
};

/** Source complète et fiable, mais demande une clé. */
const fromDataApi = async (code: string, apiKey: string): Promise<RecentYouTubeVideo> => {
  const response = await fetch(
    `${API_URL}?part=snippet,contentDetails&id=${encodeURIComponent(code)}&key=${encodeURIComponent(apiKey)}`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) }
  );
  if (!response.ok) throw new Error(`YouTube Data API → ${response.status}`);
  const payload = (await response.json()) as {
    items?: {
      id: string;
      snippet?: { title?: string; description?: string; publishedAt?: string };
      contentDetails?: { duration?: string };
    }[];
  };
  const item = payload.items?.[0];
  // L'API ne renvoie rien pour une vidéo privée d'une autre chaîne ou inexistante.
  if (!item) throw new YouTubeVideoNotFoundError('Vidéo introuvable ou privée');
  return {
    code: item.id,
    title: item.snippet?.title ?? '',
    description: item.snippet?.description ?? '',
    publishedAt: toIso(item.snippet?.publishedAt),
    durationSeconds: isoDurationSeconds(item.contentDetails?.duration ?? ''),
    isShort: false,
  };
};

const parsePlayerResponse = (html: string): PlayerResponse | null => {
  const match = /var ytInitialPlayerResponse = (\{[\s\S]*?\});(?:var |<\/script>)/.exec(html);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as PlayerResponse;
  } catch {
    return null;
  }
};

const metaContent = (html: string, attribute: string): string => {
  const match = new RegExp(`<meta ${attribute} content="([^"]*)"`).exec(html);
  return match ? decodeXml(match[1]) : '';
};

/**
 * Page watch : `ytInitialPlayerResponse` quand YouTube sert le lecteur, sinon
 * les métadonnées schema.org de la page (titre, date, durée, sans description).
 * `null` si la page n'a rien d'exploitable (contrôle anti-robot, vidéo privée).
 */
const fromWatchPage = async (
  code: string
): Promise<{ video: RecentYouTubeVideo | null; reason: string | null }> => {
  const html = await fetchText(`${WATCH_URL}${encodeURIComponent(code)}`);
  const player = parsePlayerResponse(html);
  const details = player?.videoDetails;
  if (details?.videoId) {
    const micro = player?.microformat?.playerMicroformatRenderer;
    return {
      video: {
        code: details.videoId,
        title: details.title ?? '',
        description: details.shortDescription ?? '',
        publishedAt: toIso(micro?.publishDate ?? micro?.uploadDate),
        durationSeconds: positiveOrNull(Number(details.lengthSeconds)),
        isShort: false,
      },
      reason: null,
    };
  }
  const title = metaContent(html, 'itemprop="name"');
  if (metaContent(html, 'itemprop="identifier"') === code && title) {
    return {
      video: {
        code,
        title,
        description: '',
        publishedAt: toIso(metaContent(html, 'itemprop="datePublished"')),
        durationSeconds: isoDurationSeconds(metaContent(html, 'itemprop="duration"')),
        isShort: false,
      },
      reason: null,
    };
  }
  return { video: null, reason: player?.playabilityStatus?.reason ?? null };
};

/** Dernier recours, rarement bloqué : le titre seul. */
const fromOEmbed = async (code: string): Promise<RecentYouTubeVideo | null> => {
  const response = await fetch(
    `${OEMBED_URL}${encodeURIComponent(`${WATCH_URL}${code}`)}`,
    { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(TIMEOUT_MS) }
  );
  if (!response.ok) return null;
  const payload = (await response.json().catch(() => null)) as { title?: string } | null;
  if (!payload?.title) return null;
  return { code, title: payload.title, description: '', publishedAt: '', durationSeconds: null, isShort: false };
};

/**
 * Une vidéo par son code, pour celles que le flux RSS ne montre pas (non
 * répertoriée, sortie des 15 dernières publications). Sources, de la plus
 * complète à la plus pauvre : API Data (si clé), page watch, oEmbed. Les
 * champs inconnus restent vides et se saisissent à la main.
 */
export async function fetchVideo(code: string, apiKey: string | null): Promise<RecentYouTubeVideo> {
  if (apiKey) return fromDataApi(code, apiKey);

  let reason: string | null = null;
  try {
    const page = await fromWatchPage(code);
    if (page.video) return page.video;
    reason = page.reason;
  } catch (error) {
    console.warn('[api/youtube] page watch illisible', error instanceof Error ? error.message : error);
  }

  const oembed = await fromOEmbed(code).catch(() => null);
  if (oembed) return oembed;
  throw new YouTubeVideoNotFoundError(reason ?? 'Vidéo introuvable ou privée');
}

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
