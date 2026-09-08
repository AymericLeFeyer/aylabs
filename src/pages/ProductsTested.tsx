import React from "react";
import { useState, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
import { FilterSection } from "../components/FilterSection";
import { useProducts } from "../hooks/useMarkdownContent";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";

export const ProductsTested: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [selectedCompatible, setSelectedCompatible] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Construction dynamique des options de filtrage
  const filterOptions = useMemo(() => {
    const tagCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    const protocolCounts = new Map<string, number>();
    const compatibleCounts = new Map<string, number>();

    products.forEach((product) => {
      // Tags
      if (product.tags) {
        product.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }

      // Catégories
      if (product.category) {
        categoryCounts.set(
          product.category,
          (categoryCounts.get(product.category) || 0) + 1
        );
      }

      // Protocoles
      if (product.protocols) {
        product.protocols.forEach((protocol) => {
          protocolCounts.set(protocol, (protocolCounts.get(protocol) || 0) + 1);
        });
      }

      // Compatible
      if (product.compatible) {
        product.compatible.forEach((comp) => {
          compatibleCounts.set(comp, (compatibleCounts.get(comp) || 0) + 1);
        });
      }
    });

    return {
      tags: Array.from(tagCounts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value)),
      categories: Array.from(categoryCounts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value)),
      protocols: Array.from(protocolCounts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value)),
      compatible: Array.from(compatibleCounts.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => new Date(p.testedDate) <= new Date());

    // Filtrage par catégories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filtrage par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.tags && product.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Filtrage par protocoles
    if (selectedProtocols.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.protocols &&
          product.protocols.some((protocol) =>
            selectedProtocols.includes(protocol)
          )
      );
    }

    // Filtrage par compatibilité
    if (selectedCompatible.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.compatible &&
          product.compatible.some((comp) => selectedCompatible.includes(comp))
      );
    }

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [
    products,
    selectedTags,
    selectedCategories,
    selectedProtocols,
    selectedCompatible,
    searchQuery,
  ]);

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedProtocols([]);
    setSelectedCompatible([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedTags.length > 0 ||
    selectedCategories.length > 0 ||
    selectedProtocols.length > 0 ||
    selectedCompatible.length > 0 ||
    searchQuery.trim().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Produits testés"
          description="Tous les produits passés entre mes mains, avec analyse détaillée et verdict honnête."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Produits testés"
          description="Tous les produits passés entre mes mains, avec analyse détaillée et verdict honnête."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Produits testés - AyLabs"
        description="Tu retrouveras ici tous les produits que j'ai pu testé lors de mes tests"
        url="https://aylabs.fr/produits-testes"
      />
      <PageHeader
        title="Produits testés"
        description="Tous les produits passés entre mes mains, avec analyse détaillée et verdict honnête."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tapez le nom d'un produit..."
          filters={[
            {
              label: "Catégorie",
              options: filterOptions.categories,
              selected: selectedCategories,
              onChange: setSelectedCategories,
            },
            {
              label: "Tags",
              options: filterOptions.tags,
              selected: selectedTags,
              onChange: setSelectedTags,
            },
            {
              label: "Protocoles",
              options: filterOptions.protocols,
              selected: selectedProtocols,
              onChange: setSelectedProtocols,
            },
            {
              label: "Compatibilité",
              options: filterOptions.compatible,
              selected: selectedCompatible,
              onChange: setSelectedCompatible,
            },
          ]}
          resultCount={filteredProducts.length}
          itemName="produit"
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <p className="font-display text-lg font-semibold text-[#141414]">
              {hasActiveFilters
                ? "Aucun produit ne correspond"
                : "Aucun produit testé pour le moment"}
            </p>
            {hasActiveFilters && (
              <>
                <p className="mt-1 text-gray-500">
                  Essayez avec moins de filtres, ou un autre mot-clé.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 rounded-lg bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
                >
                  Effacer les filtres
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
