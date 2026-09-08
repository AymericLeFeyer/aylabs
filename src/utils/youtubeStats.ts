/**
 * Règles de calcul des statistiques de chaîne, isolées du hook pour rester
 * testables. **Cette logique est dupliquée dans le Content Studio**
 * (`tools/content-studio/src/domain/stats/services/hiddenVideos.ts`) qui affiche
 * un aperçu avant commit : toute correction ici doit y être reportée.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  thumbnails?: {
    default: string;
    medium: string;
    high: string;
  };
}

/** Nombre de vidéos retenues pour les moyennes, une fois la banlist appliquée. */
export const STATS_WINDOW = 10;

/**
 * n8n écrit chaque vidéo enveloppée dans un objet `{ json, pairedItem }`.
 * On accepte les deux formes pour ne pas dépendre de la version du workflow.
 */
export const normalizeVideos = (raw: unknown): YouTubeVideo[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) =>
      item && typeof item === 'object' && 'json' in item
        ? (item as { json: YouTubeVideo }).json
        : (item as YouTubeVideo)
    )
    .filter((video): video is YouTubeVideo => Boolean(video?.id));
};

/** Identifiants des vidéos masquées depuis le Content Studio. */
export const parseHidden = (raw: unknown): Set<string> => {
  const list = (raw as { hidden?: unknown })?.hidden;
  if (!Array.isArray(list)) return new Set<string>();
  const codes = list
    .map((entry) =>
      typeof entry === 'string' ? entry : (entry as { code?: unknown })?.code
    )
    .filter((code): code is string => typeof code === 'string' && code !== '');
  return new Set(codes);
};

/**
 * Les vidéos retenues : on écarte celles de la banlist, puis on garde les
 * `STATS_WINDOW` plus récentes de ce qui reste. Sans vidéo masquée, cela revient
 * exactement aux 10 dernières publications.
 */
export const selectVideos = (
  videos: YouTubeVideo[],
  hidden: Set<string>
): YouTubeVideo[] =>
  videos
    .filter((video) => !hidden.has(video.id))
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, STATS_WINDOW);

export const averageViewsOf = (videos: YouTubeVideo[]): number => {
  if (videos.length === 0) return 0;
  const total = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  return Math.round(total / videos.length);
};

/** (likes + commentaires) / vues, en pourcentage, sur la fenêtre retenue. */
export const engagementRateOf = (videos: YouTubeVideo[]): number => {
  const views = videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
  if (views === 0) return 0;
  const interactions = videos.reduce(
    (sum, video) => sum + (video.likeCount || 0) + (video.commentCount || 0),
    0
  );
  return (interactions / views) * 100;
};

/** Fenêtre de fraîcheur affichée dans le Media Kit. */
export const RECENT_WINDOW_DAYS = 30;

/**
 * Publications sur les 30 derniers jours glissants — c'est ce que comptait
 * déjà n8n dans `recentVideosCount`, malgré le libellé « ce mois ».
 */
export const publishedRecently = (
  videos: YouTubeVideo[],
  reference: Date = new Date()
): number => {
  const since = reference.getTime() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return videos.filter((video) => {
    const date = new Date(video.publishedAt);
    return !Number.isNaN(date.getTime()) && date.getTime() >= since;
  }).length;
};
