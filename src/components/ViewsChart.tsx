import React, { useState } from "react";

interface ChartVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
}

interface ViewsChartProps {
  videos: ChartVideo[];
  averageViews: number;
  /** Vidéos écartées via la banlist du Studio, signalées sous le graphique. */
  hiddenCount?: number;
}

const formatViews = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(".", ",")} M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(".", ",")} K`;
  return value.toString();
};

const formatShortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

/**
 * Vues des dernières vidéos, une seule série : pas de légende, la moyenne sert
 * de repère et seule la meilleure vidéo porte une étiquette directe. Les
 * miniatures tiennent lieu d'étiquettes d'axe — un titre ne rentre pas dans
 * 50 px de large, une miniature se reconnaît.
 */
export const ViewsChart: React.FC<ViewsChartProps> = ({
  videos,
  averageViews,
  hiddenCount = 0,
}) => {
  const [active, setActive] = useState<number | null>(null);

  const ordered = [...videos].sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );

  if (ordered.length === 0) return null;

  const max = Math.max(...ordered.map((video) => video.viewCount), 1);
  const best = ordered.reduce((top, video) =>
    video.viewCount > top.viewCount ? video : top
  );
  const averageRatio = averageViews > 0 ? averageViews / max : 0;

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-[#141414]">
          Vues des {ordered.length} dernières vidéos
        </h3>
        <span className="text-sm text-gray-500">
          Moyenne {formatViews(averageViews)} vues
        </span>
      </figcaption>

      {/* Barres : seule zone qui s'étire, pour aligner la carte sur la colonne
          voisine sans déformer les miniatures. */}
      <div className="relative mt-8 min-h-[9rem] flex-1" aria-hidden="true">
        {/* Repère de moyenne */}
        {averageRatio > 0 && (
          <div
            className="absolute inset-x-0 border-t border-dashed border-gray-300"
            style={{ bottom: `${averageRatio * 100}%` }}
          />
        )}

        <div className="flex h-full items-end gap-2">
          {ordered.map((video, index) => {
            const height = Math.max((video.viewCount / max) * 100, 2);
            const isBest = video.id === best.id;
            const isActive = active === index;
            return (
              <div
                key={video.id}
                className="relative flex h-full flex-1 flex-col justify-end"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                {(isBest || isActive) && (
                  <span
                    className={`mb-1 truncate text-center text-xs font-semibold ${
                      isActive ? "text-[#141414]" : "text-brand"
                    }`}
                  >
                    {formatViews(video.viewCount)}
                  </span>
                )}
                <div
                  className={`w-full rounded-t transition-colors ${
                    isActive
                      ? "bg-brand-deep"
                      : isBest
                        ? "bg-brand"
                        : "bg-brand/35"
                  }`}
                  style={{ height: `${height}%` }}
                />

                {/* Infobulle : miniature, titre, vues et date */}
                {isActive && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-lg">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="line-clamp-2 text-xs font-semibold text-[#141414]">
                        {video.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatViews(video.viewCount)} vues, le{" "}
                        {formatShortDate(video.publishedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Les miniatures servent d'axe : même largeur et même gouttière que les
          barres, pour rester alignées colonne par colonne. */}
      <div className="mt-2 flex gap-2">
        {ordered.map((video, index) => (
          <a
            key={video.id}
            // `video.id` est le code YouTube, pas le slug d'une fiche du site :
            // toutes ces vidéos n'ont pas forcément de page ici.
            href={`https://youtu.be/${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${video.title} — voir sur YouTube`}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
            className="min-w-0 flex-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
              alt=""
              loading="lazy"
              className={`aspect-video w-full rounded object-cover transition-all duration-200 ${
                active === index
                  ? "opacity-100 ring-2 ring-brand"
                  : "opacity-60"
              }`}
            />
          </a>
        ))}
      </div>

      <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-xs text-gray-500">
        <span>{formatShortDate(ordered[0].publishedAt)}</span>
        <span>{formatShortDate(ordered[ordered.length - 1].publishedAt)}</span>
      </div>

      {hiddenCount > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          {hiddenCount} vidéo{hiddenCount > 1 ? 's' : ''} exclue
          {hiddenCount > 1 ? 's' : ''} de ces statistiques.
        </p>
      )}

      {/* Même contenu, lisible par les lecteurs d'écran */}
      <table className="sr-only">
        <caption>Vues des dernières vidéos publiées</caption>
        <thead>
          <tr>
            <th scope="col">Vidéo</th>
            <th scope="col">Date</th>
            <th scope="col">Vues</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((video) => (
            <tr key={video.id}>
              <td>{video.title}</td>
              <td>{formatShortDate(video.publishedAt)}</td>
              <td>{video.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};
