import React, { useRef, useState } from "react";
import { Play, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "../types";

interface VideoStackProps {
  videos: Video[];
}

const getVideoCode = (url: string) =>
  url.split("v=")[1] || url.split("/").pop() || "";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const VideoStack: React.FC<VideoStackProps> = ({ videos }) => {
  const [index, setIndex] = useState(0);
  const total = videos.length;

  if (total === 0) return null;

  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + total) % total);

  const current = videos[index];
  const touchStart = useRef<number | null>(null);

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
  };

  return (
    <div>
      {/* Carrousel : une piste horizontale qui glisse d'une vidéo à l'autre. */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {videos.map((video, videoIndex) => {
            const isCurrent = videoIndex === index;

            return (
              <div
                key={video.id}
                className="aspect-video w-full shrink-0"
                aria-hidden={!isCurrent}
              >
                <a
                  href={`/video/${video.id}`}
                  tabIndex={isCurrent ? undefined : -1}
                  className="group block h-full overflow-hidden rounded-2xl border border-ink-line bg-ink-soft shadow-2xl shadow-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
                >
                  <div className="relative h-full">
                    <img
                      src={`https://img.youtube.com/vi/${getVideoCode(
                        video.url
                      )}/maxresdefault.jpg`}
                      onError={(event) => {
                        event.currentTarget.src = `https://img.youtube.com/vi/${getVideoCode(
                          video.url
                        )}/hqdefault.jpg`;
                      }}
                      alt=""
                      loading={videoIndex < 2 ? "eager" : "lazy"}
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-brand-bright backdrop-blur">
                      {videoIndex === 0 ? "Dernière vidéo" : "Déjà sortie"}
                    </span>
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs text-gray-300 backdrop-blur">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {video.duration}
                    </span>
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E5322D]">
                        <Play className="ml-1 h-7 w-7 fill-white text-white" />
                      </span>
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Titre de la vidéo courante, hors de la pile pour rester lisible.
          La hauteur est réservée pour deux lignes : la zone ne bouge plus d'une
          vidéo à l'autre, quel que soit le titre. */}
      <div key={current.id} className="animate-swap mt-6">
        <a
          href={`/video/${current.id}`}
          className="group block min-h-[3.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright md:min-h-[4.25rem]"
        >
          <h2 className="line-clamp-2 font-display text-xl font-semibold leading-snug text-white transition-colors group-hover:text-brand-bright md:text-2xl">
            {current.title}
          </h2>
        </a>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatDate(current.publishedAt)}
          </span>
          {current.tags?.[0] && (
            <span className="rounded-full border border-ink-line px-3 py-0.5 text-xs text-gray-400">
              {current.tags[0]}
            </span>
          )}
        </div>
      </div>

      {/* Commandes : le carrousel ne bouge que sur action */}
      {total > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Voir la vidéo plus récente"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-line bg-white/5 text-gray-300 transition-all duration-200 hover:-translate-x-0.5 hover:border-brand hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Voir la vidéo plus ancienne"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-line bg-white/5 text-gray-300 transition-all duration-200 hover:translate-x-0.5 hover:border-brand hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex gap-1.5">
            {videos.map((video, position) => (
              <button
                key={video.id}
                type="button"
                aria-current={position === index}
                aria-label={video.title}
                onClick={() => setIndex(position)}
                className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright ${
                  position === index
                    ? "w-8 bg-brand"
                    : "w-1.5 bg-ink-line hover:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <span className="ml-auto text-sm tabular-nums text-gray-600">
            {index + 1} sur {total}
          </span>
        </div>
      )}
    </div>
  );
};
