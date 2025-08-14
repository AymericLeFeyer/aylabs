import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { Tutorial } from '../types';
import { useComments } from '../hooks/useComments';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  const { comments, loading } = useComments(tutorial.id, 'tutorial');
  
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
      <Link to={`/tutoriel/${tutorial.slug}`} className="relative bg-gradient-to-br from-[#398FBA] to-[#2a6d94] p-8 block">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <h3 className="font-bold text-lg text-white text-center line-clamp-2">
          {tutorial.title}
        </h3>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FileText className="h-12 w-12 text-white" />
        </div>
      </Link>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {tutorial.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(tutorial.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{loading ? '...' : comments.length}</span>
          </div>
        </div>
        
        <Link
          to={`/tutoriel/${tutorial.slug}`}
          className="block bg-[#398FBA] hover:bg-[#2a6d94] text-white text-center py-2 rounded-lg font-medium transition-colors"
        >
          Lire le tutoriel
        </Link>
      </div>
    </article>
  );
};