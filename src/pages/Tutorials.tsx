import React from 'react';
import { TutorialCard } from '../components/TutorialCard';
import { useTutorials } from '../hooks/useMarkdownContent';

export const Tutorials: React.FC = () => {
  const { tutorials, loading, error } = useTutorials();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#398FBA] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutoriels</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Guides pratiques et tutoriels détaillés pour vos projets 
              domotique, homelab et tech.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto"></div>
          <p className="text-gray-500 mt-4">Chargement des tutoriels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#398FBA] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutoriels</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Guides pratiques et tutoriels détaillés pour vos projets 
              domotique, homelab et tech.
            </p>
          </div>
        </div>
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
      <div className="bg-[#398FBA] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutoriels</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Guides pratiques et tutoriels détaillés pour vos projets 
            domotique, homelab et tech.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {tutorials.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun tutoriel disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};