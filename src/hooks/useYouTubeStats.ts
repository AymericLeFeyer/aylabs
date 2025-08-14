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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCYourChannelId'; // Remplacez par votre ID de chaîne

  useEffect(() => {
    const fetchYouTubeData = async () => {
      if (!API_KEY) {
        setError('Clé API YouTube manquante');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Récupérer les statistiques de la chaîne
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
        );

        if (!channelResponse.ok) {
          throw new Error('Erreur lors de la récupération des données de la chaîne');
        }

        const channelData = await channelResponse.json();
        
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error('Chaîne non trouvée');
        }

        const channel = channelData.items[0];
        const channelStats: YouTubeStats = {
          subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
          viewCount: parseInt(channel.statistics.viewCount || '0'),
          videoCount: parseInt(channel.statistics.videoCount || '0'),
          channelTitle: channel.snippet.title,
          channelDescription: channel.snippet.description,
          thumbnails: channel.snippet.thumbnails,
          customUrl: channel.snippet.customUrl,
          publishedAt: channel.snippet.publishedAt
        };

        setStats(channelStats);

        // Récupérer les vidéos récentes
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`
        );

        if (!videosResponse.ok) {
          throw new Error('Erreur lors de la récupération des vidéos');
        }

        const videosData = await videosResponse.json();
        const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');

        // Récupérer les statistiques détaillées des vidéos
        const videoStatsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
        );

        if (!videoStatsResponse.ok) {
          throw new Error('Erreur lors de la récupération des statistiques des vidéos');
        }

        const videoStatsData = await videoStatsResponse.json();
        
        const videos: YouTubeVideo[] = videoStatsData.items.map((video: any) => ({
          id: video.id,
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          viewCount: parseInt(video.statistics.viewCount || '0'),
          likeCount: parseInt(video.statistics.likeCount || '0'),
          commentCount: parseInt(video.statistics.commentCount || '0'),
          duration: video.contentDetails.duration,
          thumbnails: video.snippet.thumbnails
        }));

        setRecentVideos(videos);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données YouTube');
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeData();
  }, [API_KEY, CHANNEL_ID]);

  // Calculer les statistiques dérivées
  const averageViews = recentVideos.length > 0 
    ? Math.round(recentVideos.reduce((sum, video) => sum + video.viewCount, 0) / recentVideos.length)
    : 0;

  const totalLikes = recentVideos.reduce((sum, video) => sum + video.likeCount, 0);
  const totalComments = recentVideos.reduce((sum, video) => sum + video.commentCount, 0);
  
  // Calculer le nombre de vidéos des 30 derniers jours
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentVideosCount = recentVideos.filter(video => 
    new Date(video.publishedAt) >= thirtyDaysAgo
  ).length;

  // Calcul approximatif du taux d'engagement (likes + commentaires / vues moyennes)
  const engagementRate = averageViews > 0 
    ? ((totalLikes + totalComments) / (averageViews * recentVideos.length) * 100)
    : 0;

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