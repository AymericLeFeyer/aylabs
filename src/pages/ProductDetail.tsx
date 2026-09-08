import React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from "lucide-react";
import { useProduct, useProducts } from "../hooks/useMarkdownContent";
import { MarkdownRenderer } from "../utils/markdownRenderer";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";
import { Product } from "../types";
import ReactGA from "react-ga4";

const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex w-full items-center justify-between gap-2 rounded-lg border border-dashed border-amber-400 bg-white px-3 py-2.5 transition-colors hover:bg-amber-50"
    >
      <span className="font-display text-lg font-bold tracking-widest text-amber-900">
        {code}
      </span>
      {copied ? (
        <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600">
          <Check className="h-4 w-4" />
          copié
        </span>
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-amber-500" />
      )}
    </button>
  );
};

/** Tailwind ne génère que les classes présentes littéralement dans le source. */
const SPEC_COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

const trackEvent = (name: string, params: Record<string, unknown>) => {
  if (!import.meta.env.VITE_GA_ID) return;
  ReactGA.gtag("event", name, params);
};

/**
 * Boutiques routées par `markdownLoader` : chacune garde sa couleur de marque.
 * Ajouter une plateforme impose aussi de toucher `markdownLoader.ts` et
 * `tools/content-studio/src/domain/content/services/buyLinks.ts`.
 */
const STORES: {
  key: keyof Product;
  label: string;
  className: string;
}[] = [
  {
    key: "amazonLink",
    label: "Amazon",
    className: "bg-[#FF9900] hover:bg-[#e08800] text-[#141414]",
  },
  {
    key: "domadooLink",
    label: "Domadoo",
    className: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  {
    key: "geekbuyingLink",
    label: "GeekBuying",
    className: "bg-red-600 hover:bg-red-700 text-white",
  },
  {
    key: "minixLink",
    label: "Minix",
    className: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    key: "reolinkLink",
    label: "Reolink",
    className: "bg-sky-600 hover:bg-sky-700 text-white",
  },
  {
    key: "bambuLink",
    label: "BambuLab",
    className: "bg-green-600 hover:bg-green-700 text-white",
  },
  {
    key: "merossLink",
    label: "Meross",
    className: "bg-teal-600 hover:bg-teal-700 text-white",
  },
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || "");
  const { products } = useProducts();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-brand" />
          <p className="text-gray-500">Chargement du produit…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#141414]">
            {error || "Produit introuvable"}
          </h1>
          <Link
            to="/produits-testes"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#141414] px-5 py-3 font-semibold text-white transition-colors hover:bg-brand"
          >
            Voir tous les produits testés
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const stores = STORES.filter((store) => Boolean(product[store.key]));
  const hasStores = stores.length > 0 || (product.otherLinks?.length ?? 0) > 0;

  const specs = [
    { label: "Type", values: product.tags ?? [] },
    { label: "Protocoles", values: product.protocols ?? [] },
    { label: "Compatible avec", values: product.compatible ?? [] },
  ].filter((spec) => spec.values.length > 0);

  const similar = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="bg-white">
      <SEO
        title={`${product.name} - AyLabs`}
        description={product.description}
        url={`https://aylabs.fr/produit/${id}`}
        image={product.image}
      />

      <PageHeader
        title={product.name}
        description={product.description}
        eyebrow={
          <Link
            to="/produits-testes"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Tous les produits testés
          </Link>
        }
      >
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-brand/15 px-3 py-1 font-semibold text-brand-bright">
            {product.category}
          </span>
          <span className="text-gray-400">
            Testé le {formatDate(product.testedDate)}
          </span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Visuel et caractéristiques */}
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            {specs.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <h2 className="border-b border-gray-200 bg-gray-50 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Fiche technique
                </h2>
                {/* Une colonne par famille : la comparaison se fait d'un coup
                    d'oeil, sans faire défiler des lignes. */}
                <dl
                  className={`grid divide-y divide-gray-100 sm:divide-x sm:divide-y-0 ${SPEC_COLUMNS[specs.length]}`}
                >
                  {specs.map((spec) => (
                    <div key={spec.label} className="p-5">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {spec.label}
                      </dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {spec.values.map((value) => (
                          <span
                            key={value}
                            className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-sm font-medium text-[#141414]"
                          >
                            {value}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Achat : suit la lecture sur grand écran */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-gray-200 p-6">
              <div className="flex items-baseline gap-3">
                {product.promoPrice ? (
                  <>
                    <span className="font-display text-3xl font-bold text-brand">
                      {product.promoPrice} €
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {product.price} €
                    </span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-bold text-[#141414]">
                    {product.price} €
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Prix indicatif au moment du test
              </p>

              {product.promoCode && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    Code promo {product.promoCode.platform} : −
                    {product.promoCode.percent} %
                  </p>
                  {product.promoCode.expiresAt && (
                    <p className="mt-0.5 text-xs text-amber-700">
                      Valable jusqu'au {product.promoCode.expiresAt}
                    </p>
                  )}
                  <div className="mt-2">
                    <CopyCodeButton code={product.promoCode.code} />
                  </div>
                </div>
              )}

              {hasStores && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-gray-700">
                    Où l'acheter
                  </h2>
                  <div className="mt-3 space-y-2">
                    {stores.map((store) => (
                      <a
                        key={store.label}
                        href={product[store.key] as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("click_partner_link", {
                            partner: store.label,
                            product_id: product.id,
                            product_name: product.name,
                          })
                        }
                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${store.className}`}
                      >
                        <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                        {store.label}
                      </a>
                    ))}

                    {product.otherLinks?.map((link) => {
                      const host = new URL(link).hostname
                        .replace(/^www\./, "")
                        .split(".")[0];
                      const label = host.charAt(0).toUpperCase() + host.slice(1);
                      return (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent("click_partner_link", {
                              partner: label,
                              product_id: product.id,
                              product_name: product.name,
                            })
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#141414] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                          {label}
                        </a>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-gray-400">
                    Liens affiliés : ils soutiennent la chaîne sans surcoût pour
                    vous.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Bilan du test : une seule carte, deux colonnes séparées par un filet */}
        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <div className="grid md:grid-cols-2 md:divide-x md:divide-gray-200">
              {product.pros?.length > 0 && (
                <div className="p-6 md:p-7">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-[#141414]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                    </span>
                    Ce qui marche
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {product.pros.map((pro) => (
                      <li
                        key={pro}
                        className="flex items-start gap-3 rounded-lg bg-emerald-50/60 px-3.5 py-2.5"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.cons?.length > 0 && (
                <div className="border-t border-gray-200 p-6 md:border-t-0 md:p-7">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-[#141414]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Minus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                    </span>
                    Ce qui coince
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {product.cons.map((con) => (
                      <li
                        key={con}
                        className="flex items-start gap-3 rounded-lg bg-red-50/60 px-3.5 py-2.5"
                      >
                        <X
                          className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        <span className="leading-relaxed text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verdict : le mot de la fin, traité comme tel */}
        {product.verdict && (
          <div className="relative mt-6 overflow-hidden rounded-2xl bg-ink p-6 text-white md:p-10">
            <div
              className="pointer-events-none absolute inset-0 bg-grid"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-[100px]"
              aria-hidden="true"
            />

            <div className="relative md:flex md:items-start md:gap-8">
              <div className="flex items-center gap-3 md:w-40 md:shrink-0 md:flex-col md:items-start">
                <img
                  src="/aylabs.jpg"
                  alt=""
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/40"
                />
                <div>
                  <p className="font-display text-lg font-bold">Mon verdict</p>
                  <p className="text-sm text-gray-500">après le test</p>
                </div>
              </div>

              <div className="mt-5 border-l-2 border-brand pl-5 text-xl leading-relaxed text-gray-200 [&_a]:text-brand-bright [&_p:last-child]:mb-0 md:mt-0 md:text-2xl">
                <MarkdownRenderer content={product.verdict} />
              </div>
            </div>
          </div>
        )}

        {/* Vidéo de test */}
        {product.videoCode && (
          <div className="mt-6">
            <h2 className="font-display text-xl font-bold text-[#141414]">
              Le test en vidéo
            </h2>
            <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-ink-line bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${product.videoCode}`}
                title={`Test vidéo de ${product.name}`}
                className="h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Dans la même catégorie */}
      {similar.length > 0 && (
        <section className="mt-6 border-t border-gray-200 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">
              <h2 className="font-display text-xl font-bold text-[#141414]">
                Dans la même catégorie
              </h2>
              <Link
                to="/produits-testes"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-deep"
              >
                Tous les produits
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <Link
                  key={item.slug}
                  to={`/produit/${item.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand/40 hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-16 w-20 shrink-0 rounded-lg bg-gray-50 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-[#141414] transition-colors group-hover:text-brand">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block font-display text-sm font-bold text-gray-500">
                      {item.promoPrice ?? item.price} €
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
