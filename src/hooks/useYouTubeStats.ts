import { useState, useEffect } from 'react';
import {
  averageViewsOf,
  engagementRateOf,
  normalizeVideos,
  parseHidden,
  publishedRecently,
  selectVideos,
  type YouTubeVideo,
} from '../utils/youtubeStats';

interface YouTubeStats {
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  channelTitle: string;
  channelDescription: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  customUrl?: string;
  publishedAt: string;
}

export const useYouTubeStats = () => {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
  const [recentVideosCount, setRecentVideosCount] = useState<number>(0);
  const [averageViews, setAverageViews] = useState<number>(0);
  const [engagementRate, setEngagementRate] = useState<number>(0.0);
  const [hiddenCount, setHiddenCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        const [data, hiddenFile] = await Promise.all([
          fetch('/youtube-stats.json').then((res) => res.json()),
          // La banlist est facultative : son absence ne casse rien.
          fetch('/hidden-videos.json')
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        const hidden = parseHidden(hiddenFile);
        const all = normalizeVideos(data.videos);
        const selected = selectVideos(all, hidden);

        setStats(data.stats);
        setRecentVideos(selected);
        setHiddenCount(all.filter((video) => hidden.has(video.id)).length);

        if (selected.length > 0) {
          // Les valeurs du JSON sont calculées par n8n sur toutes les vidéos :
          // dès qu'on en masque une, il faut refaire le calcul ici.
          setAverageViews(averageViewsOf(selected));
          setEngagementRate(engagementRateOf(selected));
          setRecentVideosCount(publishedRecently(selected));
        } else {
          setAverageViews(data.averageViews ?? 0);
          setEngagementRate(data.engagementRate ?? 0);
          setRecentVideosCount(data.recentVideosCount ?? 0);
        }
      } catch (err) {
        console.error('Erreur chargement stats:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchYouTubeData();
  }, []);

  return {
    stats,
    recentVideos,
    recentVideosCount,
    averageViews,
    engagementRate: Math.round(engagementRate * 10) / 10, // Arrondi à 1 décimale
    /** Nombre de vidéos écartées par la banlist parmi celles du fichier. */
    hiddenCount,
    loading,
    error,
    refetch: () => window.location.reload()
  };
};
