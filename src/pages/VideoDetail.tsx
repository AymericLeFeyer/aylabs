import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, Play } from "lucide-react";
import { useProducts, useVideos } from "../hooks/useMarkdownContent";
import { MarkdownRenderer } from "../utils/markdownRenderer";
import { SEO } from "../components/SEO";
import { VideoCard } from "../components/VideoCard";

const videoCodeOf = (url: string) =>
  url.split("v=")[1] || url.split("/").pop() || "";

export const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { videos, loading: videosLoading } = useVideos();
  const { products } = useProducts();
  const video = videos.find((v) => v.id === id);

  if (videosLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-brand" />
          <p className="text-gray-500">Chargement de la vidéo…</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#141414]">
            Vidéo introuvable
          </h1>
          <p className="mt-2 text-gray-600">
            Cette page n'existe pas ou a été renommée.
          </p>
          <Link
            to="/videos"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#141414] px-5 py-3 font-semibold text-white transition-colors hover:bg-brand"
          >
            Voir toutes les vidéos
          </Link>
        </div>
      </div>
    );
  }

  const code = videoCodeOf(video.url);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Les fiches produit portent le code de la vidéo où elles ont été testées.
  const testedProducts = products.filter((p) => p.videoCode === code);

  const published = videos.filter((v) => v.id !== video.id);
  const related = published
    .filter((v) => v.tags?.some((tag) => video.tags?.includes(tag)))
    .slice(0, 3);
  const suggestions = related.length > 0 ? related : published.slice(0, 3);

  return (
    <div className="bg-white">
      <SEO
        title={`${video.title} - AyLabs`}
        description={video.description}
        url={`https://aylabs.fr/video/${video.id}`}
        image={`https://img.youtube.com/vi/${code}/hqdefault.jpg`}
      />

      {/* Le lecteur occupe le haut de page, sur le fond sombre du site */}
      <div className="relative overflow-hidden bg-ink pb-10 pt-6">
        <div
          className="pointer-events-none absolute inset-0 bg-grid"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-[110px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/videos"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Toutes les vidéos
          </Link>

          <div className="aspect-video overflow-hidden rounded-2xl border border-ink-line bg-black shadow-2xl shadow-black/50">
            <iframe
              src={`https://www.youtube.com/embed/${code}`}
              title={video.title}
              className="h-full w-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold leading-tight text-[#141414] md:text-4xl">
          {video.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatDate(video.publishedAt)}
          </span>
          {video.duration && video.duration !== "0:00" && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {video.duration}
            </span>
          )}
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#E5322D] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#c22824]"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Regarder sur YouTube
          </a>
        </div>

        {video.tags && video.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-8 border-l-2 border-brand pl-5 text-lg leading-relaxed text-gray-700">
          {video.description}
        </p>

        {video.content?.trim() && (
          <div className="prose mt-8 max-w-none">
            <MarkdownRenderer content={video.content} />
          </div>
        )}
      </article>

      {/* Produits testés dans cette vidéo */}
      {testedProducts.length > 0 && (
        <section className="border-t border-gray-200 bg-[#F4F7F9] py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-[#141414]">
              {testedProducts.length > 1
                ? "Les produits de cette vidéo"
                : "Le produit de cette vidéo"}
            </h2>
            <div className="mt-5 space-y-3">
              {testedProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={`/produit/${product.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand/40 hover:shadow-md"
                >
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    className="h-16 w-20 shrink-0 rounded-lg bg-gray-50 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-[#141414] transition-colors group-hover:text-brand">
                      {product.name}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-sm text-gray-500">
                      {product.description}
                    </span>
                  </span>
                  <span className="hidden shrink-0 font-display font-bold text-[#141414] sm:block">
                    {product.promoPrice ?? product.price} €
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Suite du visionnage */}
      {suggestions.length > 0 && (
        <section className="border-t border-gray-200 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
              <h2 className="font-display text-xl font-bold text-[#141414]">
                À voir ensuite
              </h2>
              <a
                href="/videos"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-deep"
              >
                Toutes les vidéos
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => (
                <VideoCard key={suggestion.id} video={suggestion} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
