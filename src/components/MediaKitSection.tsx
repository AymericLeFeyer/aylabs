import React from "react";
import {
  BarChart3,
  Users,
  Eye,
  VideoIcon,
  TrendingUp,
  Award,
  Calendar,
  Mail,
} from "lucide-react";
import { useYouTubeStats } from "../hooks/useYouTubeStats";

export const MediaKitSection: React.FC = () => {
  const {
    stats,
    averageViews,
    engagementRate,
    recentVideosCount,
    loading,
    error,
  } = useYouTubeStats();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <section id="media-kit" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
              <BarChart3 className="h-8 w-8 text-[#398FBA]" />
              <span>Media Kit</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Statistiques en temps réel et informations pour les collaborations
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
            <p className="text-gray-500 mt-4">
              Chargement des statistiques YouTube...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !stats) {
    return (
      <section id="media-kit" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
              <BarChart3 className="h-8 w-8 text-[#398FBA]" />
              <span>Media Kit</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Statistiques en temps réel et informations pour les collaborations
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || "Erreur lors du chargement des statistiques"}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="media-kit" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
            <BarChart3 className="h-8 w-8 text-[#398FBA]" />
            <span>Media Kit</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Statistiques en temps réel et informations pour les collaborations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {formatNumber(stats.subscriberCount)}
            </h3>
            <p className="text-gray-600">Abonnés</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Eye className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {formatNumber(stats.viewCount)}
            </h3>
            <p className="text-gray-600">Vues totales</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <VideoIcon className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {stats.videoCount}
            </h3>
            <p className="text-gray-600">Vidéos publiées</p>
            <div className="mt-2 text-[#398FBA] text-sm font-medium">
              {recentVideosCount} ce mois
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {formatNumber(averageViews)}
            </h3>
            <p className="text-gray-600">Vues moyennes par vidéo</p>
            <p className="text-xs text-gray-500 mt-1">(sur les 10 dernières)</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {engagementRate}%
            </h3>
            <p className="text-gray-600">Taux d'engagement</p>
            <p className="text-xs text-gray-500 mt-1">
              (likes + commentaires / vues)
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
            <div className="bg-[#398FBA]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-[#398FBA]" />
            </div>
            <h3 className="text-3xl font-bold text-[#141414] mb-2">
              {(() => {
                const startDate = new Date("2024-06-01");
                const now = new Date();
                const diffInMonths =
                  (now.getFullYear() - startDate.getFullYear()) * 12 +
                  (now.getMonth() - startDate.getMonth());
                return diffInMonths < 12
                  ? `${diffInMonths} mois`
                  : `${Math.floor(diffInMonths / 12)} an${
                      Math.floor(diffInMonths / 12) > 1 ? "s" : ""
                    }`;
              })()}
            </h3>
            <p className="text-gray-600">Années d'activité</p>
            <div className="mt-2 text-[#398FBA] text-sm font-medium">
              Depuis juin 2024
            </div>
          </div>
        </div>

        {/* Collaborations */}
        <div className="bg-gradient-to-br from-[#398FBA] to-[#2a6d94] rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Collaborations</h2>
          <p className="text-xl opacity-90 mb-8">
            Vous proposez des produits en lien direct avec mon activité ?<br />
            Vous avez un projet qui pourrait m'intéresser ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <VideoIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Tests produits</h3>
              <p className="opacity-90 text-sm">
                Reviews honnêtes et détaillées
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Partenariats</h3>
              <p className="opacity-90 text-sm">Collaborations long terme</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Placements de produits</h3>
              <p className="opacity-90 text-sm">
                Si pertinent avec le sujet de la vidéo
              </p>
            </div>
          </div>

          <a
            href="mailto:contact@aylabs.fr?subject=Collaboration"
            className="bg-white text-[#398FBA] hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center space-x-3"
          >
            <Mail className="h-5 w-5" />
            <span>Proposer une collaboration</span>
          </a>
        </div>
      </div>
    </section>
  );
};
