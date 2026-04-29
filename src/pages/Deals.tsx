import React, { useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";
import { useProducts } from "../hooks/useMarkdownContent";
import { Product } from "../types";
import { Copy, Check } from "lucide-react";

const CopyCodeButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-sm transition-colors"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span>{code}</span>
    </button>
  );
};

export const Deals: React.FC = () => {
  const { products, loading } = useProducts();

  const groupedByPlatform = useMemo(() => {
    const withPromo = (products as Product[]).filter((p) => p.promoCode?.code);
    const groups: Record<string, Product[]> = {};
    for (const product of withPromo) {
      const platform = product.promoCode!.platform || "Autre";
      if (!groups[platform]) groups[platform] = [];
      groups[platform].push(product);
    }
    return groups;
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Bonnes affaires - AyLabs"
        description="J'ai cherché pour toi les bonnes affaires du moment"
        url="https://aylabs.fr/deals"
      />
      <div className="bg-gradient-to-br from-[#398FBA] to-[#2a6d94] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bonnes affaires
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Je vous affiche ici les bonnes affaires et les codes promos du
            moment !
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA]" />
          </div>
        ) : Object.keys(groupedByPlatform).length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            Aucun code promo disponible pour le moment.
          </p>
        ) : (
          Object.entries(groupedByPlatform).map(([platform, platformProducts]) => {
            const promo = platformProducts[0].promoCode!;
            return (
              <section key={platform}>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {platform}
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-sm text-gray-600">
                      Code promo -{promo.percent}%
                      {promo.expiresAt && (
                        <span className="text-yellow-600 ml-1">
                          · jusqu'au {promo.expiresAt}
                        </span>
                      )}
                    </span>
                    <CopyCodeButton code={promo.code} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {platformProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
