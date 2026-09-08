import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import { Tutorial } from '../types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Link
      to={`/tutoriel/${tutorial.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden bg-ink">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/30 blur-3xl"
          aria-hidden="true"
        />
        <BookOpen
          className="relative h-10 w-10 text-brand-bright transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-[#141414] transition-colors group-hover:text-brand">
          {tutorial.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {tutorial.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatDate(tutorial.publishedAt)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};
