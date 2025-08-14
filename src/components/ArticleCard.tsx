import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { useComments } from '../hooks/useComments';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { comments, loading } = useComments(article.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#398FBA]/10 text-[#398FBA] px-2 py-1 rounded text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="font-bold text-lg mb-3 text-[#141414] group-hover:text-[#398FBA] transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min de lecture</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{loading ? '...' : comments.length}</span>
          </div>
        </div>
        
        <Link
          to={`/article/${article.id}`}
          className="group/link flex items-center justify-between bg-[#398FBA] hover:bg-[#2a6d94] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <span>Lire l'article</span>
          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};