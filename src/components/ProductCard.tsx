import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, FileText, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useComments } from '../hooks/useComments';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { comments, loading } = useComments(product.id, 'product');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/produit/${product.slug}`} className="relative block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-[#398FBA] text-white px-2 py-1 rounded text-sm font-medium">
          {product.category}
        </div>
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-bold">
          {product.price}€
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FileText className="h-12 w-12 text-white" />
        </div>
      </Link>
      
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 text-[#141414] group-hover:text-[#398FBA] transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Testé en {formatDate(product.testedDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{loading ? '...' : comments.length}</span>
          </div>
        </div>
        
        <Link
          to={`/produit/${product.slug}`}
          className="block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded-lg font-medium transition-colors"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
};