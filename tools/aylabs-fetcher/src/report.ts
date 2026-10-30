/**
 * Construction de `public/youtube-stats.json` à partir des réponses de l'API,
 * sans effet de bord. Le site et le Studio relisent ce fichier : garder sa forme
 * (voir `src/utils/youtubeStats.ts`).
 */

export interface ApiChannel {
  statistics: { subscriberCount?: string; viewCount?: string; videoCount?: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: unknown;
    customUrl: string;
    publishedAt: string;
  };
}

export interface ApiVideo {
  id: string;
  statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
  contentDetails: { duration: string };
  snippet: { title: string; publishedAt: string; thumbnails: unknown };
}

export interface VideoStats {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  thumbnails: unknown;
}

export interface StatsReport {
  stats: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    channelTitle: string;
    channelDescription: string;
    thumbnails: unknown;
    customUrl: string;
    publishedAt: string;
  };
  videos: VideoStats[];
  averageViews: number;
  engagementRate: number;
  recentVideosCount: number;
}

const RECENT_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

const count = (value: string | undefined): number => parseInt(value ?? '0', 10);

const toVideoStats = (video: ApiVideo): VideoStats => ({
  id: video.id,
  title: video.snippet.title,
  publishedAt: video.snippet.publishedAt,
  viewCount: count(video.statistics.viewCount),
  likeCount: count(video.statistics.likeCount),
  commentCount: count(video.statistics.commentCount),
  duration: video.contentDetails.duration,
  thumbnails: video.snippet.thumbnails,
});

export const buildReport = (
  channel: ApiChannel,
  apiVideos: ApiVideo[],
  now: Date = new Date()
): StatsReport => {
  const videos = apiVideos
    .map(toVideoStats)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
  const totalReactions = videos.reduce(
    (sum, video) => sum + video.likeCount + video.commentCount,
    0
  );
  const averageViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;
  const engagementRate =
    averageViews > 0 ? (totalReactions / (averageViews * videos.length)) * 100 : 0;

  const recentSince = now.getTime() - RECENT_WINDOW_DAYS * DAY_MS;

  return {
    stats: {
      subscriberCount: count(channel.statistics.subscriberCount),
      viewCount: count(channel.statistics.viewCount),
      videoCount: count(channel.statistics.videoCount),
      channelTitle: channel.snippet.title,
      channelDescription: channel.snippet.description,
      thumbnails: channel.snippet.thumbnails,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
    },
    videos,
    averageViews,
    engagementRate: Math.round(engagementRate * 10) / 10,
    recentVideosCount: videos.filter(
      (video) => Date.parse(video.publishedAt) >= recentSince
    ).length,
  };
};

/** Le fichier est versionné : format stable et lisible dans une diff. */
export const serializeReport = (report: StatsReport): string =>
  `${JSON.stringify(report, null, 2)}\n`;
