import React from "react";
import { Play } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { useVideos } from "../hooks/useMarkdownContent";

export const VideoSection: React.FC = () => {
  const { videos, loading, error } = useVideos();

  // Afficher seulement les 3 dernières vidéos
  const latestVideos = videos.slice(0, 3);

  if (loading) {
    return (
      <section id="videos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des vidéos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="videos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
            <Play className="h-8 w-8 text-[#398FBA]" />
            <span>Mes dernières vidéoss</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/videos"
            className="bg-[#398FBA] hover:bg-[#2a6d94] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <span>Voir toutes les vidéos</span>
          </a>
        </div>
      </div>
    </section>
  );
};
