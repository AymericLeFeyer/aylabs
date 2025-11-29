import React from 'react';
import { FileText, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Video } from '../types';
import { useComments } from '../hooks/useComments';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { comments, loading } = useComments(video.id, 'video');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <a href={`/video/${video.id}`} className="relative block">
        <img
          src={getThumbnailUrl(video.url)}
          alt={video.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {video.tags && video.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-[#398FBA] text-white px-2 py-1 rounded text-sm font-medium">
            {video.tags[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FileText className="h-12 w-12 text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </a>
      
      <div className="p-6">
        <h3 className="font-bold text-lg mb-3 text-[#141414] group-hover:text-[#398FBA] transition-colors line-clamp-2">
          {video.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(video.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{loading ? '...' : comments.length}</span>
          </div>
        </div>
        
        <a
          href={`/video/${video.id}`}
          className="mt-4 block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded-lg font-medium transition-colors"
        >
          Voir l'article associé
        </a>
      </div>
    </div>
  );
};