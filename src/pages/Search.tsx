import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search as SearchIcon, Calendar, BookOpen, Play, ShoppingCart } from 'lucide-react';
import { useTutorials, useProducts, useVideos } from '../hooks/useMarkdownContent';
import { SEO } from '../components/SEO';

export const Search: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  
  const { tutorials, loading: tutorialsLoading } = useTutorials();
  const { products, loading: productsLoading } = useProducts();
  const { videos, loading: videosLoading } = useVideos();

  const loading = tutorialsLoading || productsLoading || videosLoading;

  // Fonction de recherche
  const searchResults = useMemo(() => {
  if (!searchQuery.trim()) return { tutorials: [], products: [], videos: [], total: 0 };

  const searchTerm = searchQuery.toLowerCase();

  const filteredTutorials = tutorials.filter(tutorial =>
    (tutorial.title?.toLowerCase() || '').includes(searchTerm) ||
    (tutorial.description?.toLowerCase() || '').includes(searchTerm)
  );

  const filteredProducts = products.filter(product =>
    (product.name?.toLowerCase() || '').includes(searchTerm) ||
    (product.description?.toLowerCase() || '').includes(searchTerm) ||
    (product.category?.toLowerCase() || '').includes(searchTerm) ||
    (product.tags && product.tags.some(tag => (tag?.toLowerCase() || '').includes(searchTerm)))
  );

  const filteredVideos = videos.filter(video =>
    (video.title?.toLowerCase() || '').includes(searchTerm) ||
    (video.description?.toLowerCase() || '').includes(searchTerm) ||
    (video.tags && video.tags.some(tag => (tag?.toLowerCase() || '').includes(searchTerm)))
  );

  return {
    tutorials: filteredTutorials,
    products: filteredProducts,
    videos: filteredVideos,
    total: filteredTutorials.length + filteredProducts.length + filteredVideos.length
  };
}, [searchQuery, tutorials, products, videos]);


  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#398FBA] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">🔍 Recherche</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Trouvez rapidement le contenu qui vous intéresse
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Recherche - AyLabs"
        description="Tu cherches quelque chose ? Trouve le ici !"
        url="https://aylabs.fr/search"
      />
      <div className="bg-[#398FBA] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔍 Recherche</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Trouvez rapidement le contenu qui vous intéresse
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Barre de recherche principale */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans tous les contenus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent text-lg"
            />
          </div>
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600">
              <strong>{searchResults.total}</strong> résultat{searchResults.total > 1 ? 's' : ''} pour "{searchQuery}"
            </div>
          )}
        </div>

        {!searchQuery.trim() ? (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Commencez votre recherche</h2>
            <p className="text-gray-500">
              Tapez un mot-clé pour rechercher dans les tutoriels, produits testés et vidéos
            </p>
          </div>
        ) : searchResults.total === 0 ? (
          <div className="text-center py-16">
            <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Aucun résultat trouvé</h2>
            <p className="text-gray-500">
              Essayez avec d'autres mots-clés ou vérifiez l'orthographe
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Tutoriels */}
            {searchResults.tutorials.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#141414] mb-6 flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-[#398FBA]" />
                  <span>📖 Tutoriels ({searchResults.tutorials.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="bg-gradient-to-br from-[#398FBA] to-[#2a6d94] p-6">
                        <BookOpen className="w-8 h-8 text-white mb-2" />
                        <h3 className="font-bold text-white line-clamp-2">{tutorial.title}</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(tutorial.publishedAt)}</span>
                          </div>
                        </div>
                        <Link
                          to={`/tutoriel/${tutorial.slug}`}
                          className="block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded text-sm font-medium transition-colors"
                        >
                          Lire le tutoriel
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Produits */}
            {searchResults.products.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#141414] mb-6 flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-[#398FBA]" />
                  <span>🧪 Produits testés ({searchResults.products.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#398FBA] text-white px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </div>
                        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.price}€
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#141414] mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>Testé en {formatDate(product.testedDate)}</span>
                        </div>
                        <Link
                          to={`/produit/${product.slug}`}
                          className="block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded text-sm font-medium transition-colors"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vidéos */}
            {searchResults.videos.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#141414] mb-6 flex items-center space-x-2">
                  <Play className="h-6 w-6 text-[#398FBA]" />
                  <span>🎥 Vidéos ({searchResults.videos.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.videos.map((video) => (
                    <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img
                          src={getThumbnailUrl(video.url)}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        {video.tags && video.tags.length > 0 && (
                          <div className="absolute top-2 left-2 bg-[#398FBA] text-white px-2 py-1 rounded text-xs font-medium">
                            {video.tags[0]}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#141414] mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(video.publishedAt)}</span>
                        </div>
                        <Link
                          to={`/video/${video.id}`}
                          className="block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded text-sm font-medium transition-colors"
                        >
                          Voir l'article associé
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};