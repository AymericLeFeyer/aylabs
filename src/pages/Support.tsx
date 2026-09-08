import React from "react";
import {
  Youtube,
  ThumbsUp,
  MessageSquareText,
  Share2,
  HandCoins,
  Handshake,
  PiggyBank,
  ArrowRightFromLine,
  Video,
  Spotlight,
  Laugh,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";

export const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Me soutenir - AyLabs"
        description="Tu veux soutenir mon travail ? Ça se passe ici"
        url="https://aylabs.fr/support"
      />
      {/* Hero Section */}
      <PageHeader
        title="Soutenir mon travail"
        description="Si vous aimez ce que je fais, voici tous les moyens de donner un coup de pouce à la chaîne."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Free */}
        <div className="bg-white/90 rounded-2xl p-8 text-gray-900 text-center mb-16 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Gratuitement</h2>
          <p className="text-xl opacity-80 mb-8">
            Parfois même les plus petits gestes sont les plus importants
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-gray-200 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Like</h3>
              <p className="opacity-80 text-sm">
                Pour faire monter le taux d'engagement
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquareText className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Commente</h3>
              <p className="opacity-80 text-sm">
                Pour me donner des idées de prochaines vidéos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Partage</h3>
              <p className="opacity-80 text-sm">
                Pour que tes proches puissent eux aussi me découvrir
              </p>
            </div>
          </div>
        </div>

        {/* Transparent */}
        <div className="bg-blue-200/70 rounded-2xl p-8 text-gray-900 text-center mb-16 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">De manière transparente</h2>
          <p className="text-xl opacity-80 mb-8">
            Grâce aux liens affiliés sur le site et les vidéos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-white/30 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <HandCoins className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Commission</h3>
              <p className="opacity-80 text-sm">
                Je récupère un petit pourcentage de ce que vous dépensez
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/30 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Handshake className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Opportunités</h3>
              <p className="opacity-80 text-sm">
                Les marques voient votre engagement et m’ouvrent de nouvelles
                opportunités
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/30 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PiggyBank className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-bold mb-2">Aucun surcoût</h3>
              <p className="opacity-80 text-sm">
                Pour vous, ça ne change rien au prix
              </p>
            </div>
          </div>
        </div>

        {/* AyLaber */}
        <div className="relative mb-16 overflow-hidden rounded-2xl bg-ink p-8 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-[100px]"
            aria-hidden="true"
          />
          <h2 className="relative font-display text-3xl font-bold mb-4">
            En devenant membre
          </h2>
          <p className="relative text-lg text-gray-400 mb-8">
            Les membres ont divers avantages, contre un abonnement mensuel sur
            YouTube
          </p>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-brand-bright">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Avant-premières</h3>
              <p className="opacity-90 text-sm">
                Voyez les vidéos au minimum 24h avant la sortie
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ArrowRightFromLine className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Prioritaire</h3>
              <p className="opacity-90 text-sm">
                Priorité de réponse sur les commentaires
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Discord</h3>
              <p className="opacity-90 text-sm">
                Obtenez un rôle exclusif sur le Discord communautaire
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Spotlight className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Mise en avant</h3>
              <p className="opacity-90 text-sm">
                Votre nom est affiché dans les crédits de la vidéo
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Laugh className="h-8 w-8" />
              </div>
              <h3 className="font-bold mb-2">Émojis</h3>
              <p className="opacity-90 text-sm">
                Accès à des émojis exclusifs sur la chaîne YouTube
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/channel/UClCAe7FyrIwpkt9H56XRndA/join"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center space-x-3 rounded-xl bg-white px-8 py-4 font-bold text-ink transition-all duration-300 hover:scale-105 hover:bg-brand hover:text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
          >
            <Youtube className="h-5 w-5" />
            <span>Devenir membre — 2,99 € par mois</span>
          </a>
        </div>
      </div>
    </div>
  );
};
