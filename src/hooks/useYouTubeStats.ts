import { useState, useEffect } from 'react';

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

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

export const useYouTubeStats = () => {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [recentVideos, setRecentVideos] = useState<YouTubeVideo[]>([]);
  const [recentVideosCount, setRecentVideosCount] = useState<number>(0);
  const [averageViews, setAverageViews] = useState<number>(0);
  const [engagementRate, setEngagementRate] = useState<number>(0.0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      fetch('/youtube-stats.json') // Chemin depuis /public
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats); 
        setRecentVideos(data.videos)
        setRecentVideosCount(data.recentVideosCount)
        setAverageViews(data.averageViews)
        setEngagementRate(data.engagementRate)
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement stats:', err);
        setError(err)
        setLoading(false);
      });
    }
    fetchYouTubeData()
  }, []);

  return {
    stats,
    recentVideos,
    recentVideosCount,
    averageViews,
    engagementRate: Math.round(engagementRate * 10) / 10, // Arrondi à 1 décimale
    loading,
    error,
    refetch: () => window.location.reload()
  };
};