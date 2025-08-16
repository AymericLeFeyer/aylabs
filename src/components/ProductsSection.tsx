import React from "react";
import { Package } from "lucide-react";
import { useProducts } from "../hooks/useMarkdownContent";
import { ProductCard } from "./ProductCard";

export const ProductSections: React.FC = () => {
  const { products, loading, error } = useProducts();

  // Afficher seulement les 3 dernières vidéos
  const latestProducts = products
    .filter((p) => new Date(p.testedDate) < new Date())
    .slice(0, 3);

  if (loading) {
    return (
      <section id="products" className="py-16 bg-gray-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des produits...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-16 bg-gray-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-gray-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
            <Package className="h-8 w-8 text-[#398FBA]" />
            <span>Mes derniers produits testés</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/produits-testes"
            className="bg-[#398FBA] hover:bg-[#2a6d94] text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <span>Voir tous les produits</span>
          </a>
        </div>
      </div>
    </section>
  );
};
