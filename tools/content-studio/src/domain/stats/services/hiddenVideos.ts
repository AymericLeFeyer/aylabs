import type { ChannelVideo, HiddenVideo } from '../entities/ChannelVideo';

/** Fenêtre utilisée par le site pour ses moyennes, une fois la banlist appliquée. */
export const STATS_WINDOW = 10;

/**
 * Déballe les vidéos du fichier de stats. n8n écrit chaque élément sous la forme
 * `{ json, pairedItem }` ; on accepte aussi la forme plate.
 */
export const parseChannelVideos = (raw: string): ChannelVideo[] => {
  const data = JSON.parse(raw) as { videos?: unknown };
  if (!Array.isArray(data.videos)) return [];
  return data.videos
    .map((item) =>
      item && typeof item === 'object' && 'json' in item
        ? (item as { json: ChannelVideo }).json
        : (item as ChannelVideo)
    )
    .filter((video): video is ChannelVideo => Boolean(video?.id))
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
};

export const parseHiddenVideos = (raw: string): HiddenVideo[] => {
  const data = JSON.parse(raw) as { hidden?: unknown };
  if (!Array.isArray(data.hidden)) return [];
  return data.hidden
    .map((entry) =>
      typeof entry === 'string'
        ? { code: entry, title: '', hiddenAt: '' }
        : (entry as HiddenVideo)
    )
    .filter((entry): entry is HiddenVideo => Boolean(entry?.code));
};

/** Le fichier est versionné : format stable et lisible dans une diff. */
export const serializeHiddenVideos = (entries: HiddenVideo[]): string =>
  `${JSON.stringify({ hidden: entries }, null, 2)}\n`;

/**
 * Codes YouTube des fiches du dépôt — la liste des vidéos ajoutées à la main.
 * `code` est un scalaire du frontmatter, d'où le passage par `String`.
 */
export const knownVideoCodes = (
  files: { frontmatter: Record<string, unknown> }[]
): Set<string> =>
  new Set(
    files
      .map((file) => String(file.frontmatter.code ?? '').trim())
      .filter((code) => code !== '')
  );

/**
 * Ce que le site retiendra pour ses calculs : d'abord les vidéos qui ont une
 * fiche (`known`), puis la banlist retirée, puis les `STATS_WINDOW` plus
 * récentes de ce qui reste.
 *
 * `known` absent ou vide désactive le premier filtre, exactement comme
 * `selectVideos` dans `src/utils/youtubeStats.ts` — **les deux implémentations
 * doivent rester alignées.**
 */
export const retainedVideos = (
  videos: ChannelVideo[],
  hidden: Set<string>,
  known?: Set<string>
): ChannelVideo[] =>
  videos
    .filter((video) => !known || known.size === 0 || known.has(video.id))
    .filter((video) => !hidden.has(video.id))
    .slice(0, STATS_WINDOW);

export const averageViews = (videos: ChannelVideo[]): number => {
  if (videos.length === 0) return 0;
  const total = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  return Math.round(total / videos.length);
};

export const engagementRate = (videos: ChannelVideo[]): number => {
  const views = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  if (views === 0) return 0;
  const interactions = videos.reduce(
    (sum, video) => sum + (video.likeCount || 0) + (video.commentCount || 0),
    0
  );
  return Math.round((interactions / views) * 1000) / 10;
};
