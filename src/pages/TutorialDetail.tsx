import React from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { useTutorial } from "../hooks/useMarkdownContent";
import { MarkdownRenderer } from "../utils/markdownRenderer";
import { SEO } from "../components/SEO";

export const TutorialDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { tutorial, loading, error } = useTutorial(slug || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement du tutoriel...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#141414] mb-4">
            {error || "Tutoriel non trouvé"}
          </h1>
          <Link
            to="/tutoriels"
            className="bg-[#398FBA] text-white px-6 py-3 rounded-lg hover:bg-[#2a6d94] transition-colors"
          >
            Retour aux tutoriels
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${tutorial.title} - AyLabs`}
        description={tutorial.description}
        url={`https://aylabs.fr/tutoriel/${tutorial.id}`}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/tutoriels"
          className="inline-flex items-center space-x-2 text-[#398FBA] hover:text-[#2a6d94] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux tutoriels</span>
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative overflow-hidden bg-ink p-8 text-white">
            <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center mb-6">
              <BookOpen className="w-14 h-14 text-brand-bright" />
            </div>
            <h1 className="relative font-display text-3xl md:text-4xl font-bold text-center mb-4">
              {tutorial.title}
            </h1>
            <div className="relative flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(tutorial.publishedAt)}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {tutorial.description}
              </p>
              <MarkdownRenderer content={tutorial.content} />
            </div>
          </div>
        </article>

      </div>
    </div>
  );
};
