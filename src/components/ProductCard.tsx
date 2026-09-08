import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link
      to={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#141414] shadow-sm backdrop-blur">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-[#141414] transition-colors group-hover:text-brand">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            {product.promoPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold text-brand">
                  {product.promoPrice} €
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.price} €
                </span>
              </div>
            ) : (
              <span className="font-display text-xl font-bold text-[#141414]">
                {product.price} €
              </span>
            )}
            <p className="mt-0.5 text-xs text-gray-500">
              Testé en {formatDate(product.testedDate)}
            </p>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};
