import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";
import { useProduct } from "../hooks/useMarkdownContent";
import { Product } from "../types";

export const Deals: React.FC = () => {
  const domadoo = [
    { ...(useProduct("slzb-06m").product as Product), promoPrice: 29.74 },
    { ...(useProduct("owon-pc321z").product as Product), promoPrice: 56.09 },
    {
      ...(useProduct("nodon-fil-pilote").product as Product),
      promoPrice: 33.91,
    },
    { ...(useProduct("aqara-g4").product as Product), promoPrice: 101.15 },
    {
      ...(useProduct("sonoff-zigbee-3e").product as Product),
      promoPrice: 23.79,
    },
    { ...(useProduct("zb-mini-l2").product as Product), promoPrice: 12.74 },
    { ...(useProduct("heiman-hs1cge").product as Product), promoPrice: 25.49 },
    { ...(useProduct("nodon-sem-4-1-00").product as Product), promoPrice: 34 },
    {
      ...(useProduct("nodon-stph-4-1-00").product as Product),
      promoPrice: 42.42,
    },
    { ...(useProduct("snzb-04p").product as Product), promoPrice: 12.74 },
    { ...(useProduct("snzb-06p").product as Product), promoPrice: 15.29 },
    { ...(useProduct("frient-keyboard").product as Product), promoPrice: 75 },
    { ...(useProduct("nous-a1z").product as Product), promoPrice: 14.44 },
  ];

  const reolink = [
    { ...(useProduct("reolink-e1-zoom").product as Product) },
    { ...(useProduct("reolink-r340b").product as Product) },
    {
      ...(useProduct("reolink-r340w").product as Product)
      
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Bonnes affaires - AyLabs"
        description="J'ai cherché pour toi les bonnes affaires du moment"
        url="https://aylabs.fr/deals"
      />
      {/* Hero Section */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-6">Reolink</h1>
        <h3 className="text-lg font-medium text-gray-600 mb-4">
          À utiliser sur{" "}
          <a
            href="https://go.aylabs.fr/reolink/e1-zoom"
            className="underline"
            target="_blank"
          >
            reolink.com
          </a>
        </h3>
        <ul className="space-y-2">
          <li className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="font-bold text-[#398FBA]">
              <a href="https://go.aylabs.fr/reolink/e1-zoom">AyLabs5</a>
            </span>{" "}
            : -5% sur Reolink
          </li>
        </ul>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 pb-2 mt-6">
          Ma sélection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reolink.map((product, index) =>
            product ? <ProductCard key={index} product={product} /> : null
          )}
        </div>
      </div>
    </div>
  );
};
