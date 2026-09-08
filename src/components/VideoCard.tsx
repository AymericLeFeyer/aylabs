import React from 'react';
import { ArrowRight, Calendar, Play } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
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
    <a
      href={`/video/${video.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={getThumbnailUrl(video.url)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5322D]">
            <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
          </span>
        </span>

        {video.tags && video.tags.length > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#141414] shadow-sm backdrop-blur">
            {video.tags[0]}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-[#141414] transition-colors group-hover:text-brand">
          {video.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {video.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatDate(video.publishedAt)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  );
};
