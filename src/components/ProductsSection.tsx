import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useProducts } from "../hooks/useMarkdownContent";
import { Product } from "../types";

const formatMonth = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
};

const Price: React.FC<{ product: Product; className?: string }> = ({
  product,
  className = "",
}) =>
  product.promoPrice ? (
    <span className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-display font-bold text-brand">
        {product.promoPrice} €
      </span>
      <span className="text-sm text-gray-400 line-through">
        {product.price} €
      </span>
    </span>
  ) : (
    <span className={`font-display font-bold text-[#141414] ${className}`}>
      {product.price} €
    </span>
  );

/** Le produit mis en avant, au centre de la section. */
const FeaturedProduct: React.FC<{ product: Product }> = ({ product }) => (
  <div className="animate-swap grid h-full overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-2">
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 sm:aspect-auto sm:h-full">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover"
      />
    </div>

    <div className="flex flex-col justify-center p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
          {product.category}
        </span>
        <span className="text-xs text-gray-500">
          Testé en {formatMonth(product.testedDate)}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-xl font-bold leading-tight text-[#141414]">
        {product.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {product.verdict || product.description}
      </p>

      {product.pros && product.pros.length > 0 && (
        <ul className="mt-3 space-y-1">
          {product.pros.slice(0, 2).map((pro) => (
            <li
              key={pro}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                aria-hidden="true"
              />
              <span className="line-clamp-1">{pro}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Price product={product} className="text-xl" />
        <Link
          to={`/produit/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#141414] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Lire le test
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </div>
);

export const ProductSections: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [featuredSlug, setFeaturedSlug] = useState<string | null>(null);

  const latestProducts = products
    .filter((p) => new Date(p.testedDate) < new Date())
    .slice(0, 7);

  // Par défaut le plus récent ; un clic dans la colonne le remplace, et le
  // produit sortant reprend sa place dans la liste.
  const featured =
    latestProducts.find((p) => p.slug === featuredSlug) ?? latestProducts[0];
  const others = latestProducts.filter((p) => p.slug !== featured?.slug);

  return (
    <section id="products" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#141414] md:text-4xl">
              Passés sur l'établi
            </h2>
            <p className="mt-2 text-gray-600">
              Chaque produit est acheté ou prêté, installé chez moi, puis testé
              dans la durée.
            </p>
          </div>
          <Link
            to="/produits-testes"
            className="group inline-flex items-center gap-2 font-semibold text-brand transition-colors hover:text-brand-deep"
          >
            Tous les produits testés
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {loading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-brand" />
            <p className="mt-4 text-gray-500">Chargement des produits…</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && featured && (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FeaturedProduct key={featured.slug} product={featured} />
            </div>

            {/* Les autres tests récents, en visuels seuls : un clic envoie le
                produit au centre. Le nom vit dans l'étiquette accessible. */}
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-2 lg:content-between">
              {others.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => setFeaturedSlug(product.slug)}
                  aria-label={`Mettre en avant ${product.name}`}
                  title={product.name}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-brand hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
