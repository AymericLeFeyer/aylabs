import React, { useState, useMemo } from "react";
import { VideoCard } from "../components/VideoCard";
import { FilterSection } from "../components/FilterSection";
import { useVideos } from "../hooks/useMarkdownContent";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";

export const Videos: React.FC = () => {
  const { videos, loading, error } = useVideos();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Construction dynamique des tags disponibles
  const availableTags = useMemo(() => {
    const tagCounts = new Map<string, number>();

    videos.forEach((video) => {
      if (video.tags) {
        video.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let filtered = videos.filter((v) => new Date(v.publishedAt) <= new Date());

    // Filtrage par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (video) =>
          video.tags && video.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [videos, selectedTags, searchQuery]);

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedTags.length > 0 || searchQuery.trim().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Vidéos"
          description="Toutes mes vidéos, AyLabs et AyLabs Reviews combinées"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des vidéos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Vidéos"
          description="Toutes mes vidéos, AyLabs et AyLabs Reviews combinées"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Vidéos - AyLabs"
        description="Je suis YouTuber avant tout, ici tu trouveras mes vidéos"
        url="https://aylabs.fr/videos"
      />
      <PageHeader
        title="Vidéos"
        description="Toutes mes vidéos, AyLabs et AyLabs Reviews combinées"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tapez le titre d'une vidéo..."
          filters={[
            {
              label: "Catégorie",
              options: availableTags,
              selected: selectedTags,
              onChange: setSelectedTags,
            },
          ]}
          resultCount={filteredVideos.length}
          itemName="vidéo"
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {filteredVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <p className="font-display text-lg font-semibold text-[#141414]">
              {hasActiveFilters
                ? "Aucune vidéo ne correspond"
                : "Aucune vidéo disponible pour le moment"}
            </p>
            {hasActiveFilters && (
              <>
                <p className="mt-1 text-gray-500">
                  Essayez avec moins de filtres, ou un autre mot-clé.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 rounded-lg bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
                >
                  Effacer les filtres
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
