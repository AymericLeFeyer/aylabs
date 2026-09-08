import React from "react";
import { Mail, TrendingUp, Award, Calendar, ArrowRight } from "lucide-react";
import { useYouTubeStats } from "../hooks/useYouTubeStats";
import { ViewsChart } from "./ViewsChart";

const formatNumber = (num: number, decimals: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimals).replace(".", ",")} M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimals).replace(".", ",")} K`;
  }
  return num.toString();
};

const monthsSinceStart = () => {
  const start = new Date("2024-06-01");
  const now = new Date();
  return (
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())
  );
};

const formatSeniority = () => {
  const months = monthsSinceStart();
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return `${years} an${years > 1 ? "s" : ""}`;
};

export const MediaKitSection: React.FC = () => {
  const {
    stats,
    recentVideos,
    averageViews,
    engagementRate,
    recentVideosCount,
    hiddenCount,
    loading,
    error,
  } = useYouTubeStats();

  const collaborations = [
    {
      title: "Tests produits",
      detail: "Review honnête et détaillée, du déballage à l'usage réel.",
    },
    {
      title: "Partenariats",
      detail: "Collaboration sur la durée, pas un one-shot.",
    },
    {
      title: "Placements",
      detail: "Uniquement si le produit colle au sujet de la vidéo.",
    },
  ];

  return (
    <section id="media-kit" className="bg-[#F4F7F9] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-gray-200 pb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#141414] md:text-4xl">
              Media Kit
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Les chiffres de la chaîne {" "}
              <a
                href="https://youtube.com/@ay_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand hover:underline"
              >
                AyLabs
              </a>
              , mis à jour automatiquement. <br/>De quoi décider si on travaille
              ensemble.
            </p>
          </div>
          <a
            href="mailto:contact@aylabs.fr?subject=Collaboration"
            className="inline-flex items-center gap-2 rounded-lg bg-[#141414] px-5 py-3 font-semibold text-white transition-colors hover:bg-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Proposer une collaboration
          </a>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-brand" />
            <p className="mt-4 text-gray-500">
              Chargement des statistiques YouTube…
            </p>
          </div>
        )}

        {(error || (!loading && !stats)) && (
          <div className="mt-10 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error || "Erreur lors du chargement des statistiques"}
          </div>
        )}

        {!loading && stats && (
          <>
            {/* Les trois chiffres qui comptent, sur une ligne dès le mobile */}
            <dl className="mt-8 grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 pb-8 sm:mt-10 sm:pb-10">
              <div className="pr-3 sm:pr-8">
                <dd className="font-display text-2xl font-bold text-[#141414] sm:text-4xl md:text-5xl">
                  {formatNumber(stats.subscriberCount, 1)}
                </dd>
                <dt className="mt-1 text-sm text-gray-600 sm:text-base">
                  abonnés
                </dt>
              </div>
              <div className="px-3 sm:px-8">
                <dd className="font-display text-2xl font-bold text-[#141414] sm:text-4xl md:text-5xl">
                  {formatNumber(stats.viewCount, 0)}
                </dd>
                <dt className="mt-1 text-sm text-gray-600 sm:text-base">
                  vues cumulées
                </dt>
              </div>
              <div className="pl-3 sm:pl-8">
                <dd className="font-display text-2xl font-bold text-[#141414] sm:text-4xl md:text-5xl">
                  {stats.videoCount}
                </dd>
                <dt className="mt-1 text-sm text-gray-600 sm:text-base">
                  vidéos publiées
                  {recentVideosCount > 0 && (
                    <span className="mt-1 block w-fit rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand sm:ml-2 sm:mt-0 sm:inline sm:text-sm">
                      {recentVideosCount} récemment
                    </span>
                  )}
                </dt>
              </div>
            </dl>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 lg:h-full">
                <ViewsChart
                  videos={recentVideos}
                  averageViews={averageViews}
                  hiddenCount={hiddenCount}
                />
              </div>

              {/* Trois indicateurs sur une ligne, y compris en mobile : les
                  libellés y sont raccourcis plutôt que tronqués. */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-1">
                <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
                  <TrendingUp
                    className="h-5 w-5 text-brand"
                    aria-hidden="true"
                  />
                  <p className="mt-2 font-display text-xl font-bold text-[#141414] sm:mt-3 sm:text-2xl">
                    {formatNumber(averageViews, 1)}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    <span className="sm:hidden">vues / vidéo</span>
                    <span className="hidden sm:inline">
                      vues par vidéo en moyenne
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
                  <Award className="h-5 w-5 text-brand" aria-hidden="true" />
                  <p className="mt-2 font-display text-xl font-bold text-[#141414] sm:mt-3 sm:text-2xl">
                    {engagementRate} %
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    <span className="sm:hidden">d'engagement</span>
                    <span className="hidden sm:inline">
                      d'engagement (likes et commentaires sur les vues)
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
                  <Calendar className="h-5 w-5 text-brand" aria-hidden="true" />
                  <p className="mt-2 font-display text-xl font-bold text-[#141414] sm:mt-3 sm:text-2xl">
                    {formatSeniority()}
                  </p>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    <span className="sm:hidden">d'activité</span>
                    <span className="hidden sm:inline">
                      d'activité, depuis juin 2024
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Collaborations */}
            <div className="relative mt-10 overflow-hidden rounded-2xl bg-ink p-8 text-white md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-[100px]"
                aria-hidden="true"
              />

              <div className="relative md:flex md:items-end md:justify-between md:gap-10">
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl font-bold md:text-3xl">
                    Travailler ensemble
                  </h3>
                  <p className="mt-3 leading-relaxed text-gray-400">
                    Vous proposez un produit en lien direct avec la domotique, le
                    homelab ou l'impression 3D ? Écrivez-moi, je réponds à tout
                    le monde.
                  </p>
                </div>
                <a
                  href="mailto:contact@aylabs.fr?subject=Collaboration"
                  className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-ink transition-colors hover:bg-brand hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright md:mt-0"
                >
                  contact@aylabs.fr
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="relative mt-8 grid gap-px overflow-hidden rounded-xl border border-ink-line bg-ink-line sm:grid-cols-3">
                {collaborations.map((item) => (
                  <div key={item.title} className="bg-ink-soft p-5">
                    <h4 className="font-display font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-snug text-gray-400">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
