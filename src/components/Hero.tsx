import React, { useEffect } from "react";
import { Play } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useVideos } from "../hooks/useMarkdownContent";
import { useYouTubeStats } from "../hooks/useYouTubeStats";
import { VideoStack } from "./VideoStack";

const formatCount = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(".", ",")} M`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)} K`;
  }
  return value.toString();
};

export const Hero: React.FC = () => {
  const location = useLocation();
  const { videos, loading } = useVideos();
  const { stats } = useYouTubeStats();

  // loadVideos trie déjà du plus récent au plus ancien
  const latestVideos = videos
    .filter((video) => new Date(video.publishedAt) < new Date())
    .slice(0, 5);

  useEffect(() => {
    if (!location.hash) return;

    const anchor = location.hash.replace("#", "");

    const scroll = () => {
      const el = document.getElementById(anchor);
      if (el) {
        // petit délai pour laisser le layout finir
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };

    if (document.readyState === "complete") {
      scroll();
    } else {
      window.addEventListener("load", scroll);
      return () => window.removeEventListener("load", scroll);
    }
  }, [location]);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Trame et halo : le fond du labo, jamais au premier plan */}
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Identité */}
          <div className="lg:col-span-5">
            <img
              src="/logo-text-full.svg"
              alt="AyLabs"
              className="h-14 md:h-16"
            />
            <h1 className="mt-8 font-display text-4xl font-bold leading-[1.1] md:text-5xl">
              La tech à la maison.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-400">
              Domotique, Homelab, Tech, Impression 3D... Je teste,
              j'installe, je partage ce que j'aime faire sur le moment.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://youtube.com/@ay_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5322D] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#c22824] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>Découvrir la chaîne</span>
              </a>
              <a
                href="/videos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-line bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-brand hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
              >
                Parcourir les vidéos
              </a>
            </div>

            {stats && (
              <dl className="mt-10 flex max-w-md divide-x divide-ink-line border-t border-ink-line pt-6">
                <div className="pr-6">
                  <dd className="font-display text-2xl font-bold text-white">
                    {formatCount(stats.subscriberCount)}
                  </dd>
                  <dt className="mt-1 text-sm text-gray-500">abonnés</dt>
                </div>
                <div className="px-6">
                  <dd className="font-display text-2xl font-bold text-white">
                    {formatCount(stats.viewCount)}
                  </dd>
                  <dt className="mt-1 text-sm text-gray-500">vues</dt>
                </div>
                <div className="pl-6">
                  <dd className="font-display text-2xl font-bold text-white">
                    {stats.videoCount}
                  </dd>
                  <dt className="mt-1 text-sm text-gray-500">vidéos</dt>
                </div>
              </dl>
            )}
          </div>

          {/* Les dernières vidéos, empilées */}
          <div className="lg:col-span-7">
            {loading || latestVideos.length === 0 ? (
              <div className="mr-[13%] aspect-video w-auto animate-pulse rounded-2xl border border-ink-line bg-white/5" />
            ) : (
              <VideoStack videos={latestVideos} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
