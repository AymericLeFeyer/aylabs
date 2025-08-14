import React from 'react';
import { Play, BarChart3, Handshake } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#398FBA] to-[#2a6d94] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenue dans le
          </h1>
          <div className="mb-6">
            <img
              src="/logo-text-full.svg"
              alt="AyLabs"
              className="h-16 md:h-20 mx-auto"
            />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Domoticien en herbe, maker en devenir et homelaber du dimanche 🚀<br />
            J'aime découvrir de nouvelles choses et les partager sur ma chaîne ✨
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://youtube.com/@ay_labs"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              target='_blank'
            >
              <Play className="h-5 w-5" />
              <span>S'abonner à la chaîne</span>
            </a>
          </div>
          
          {/* Liens rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button
              onClick={() => scrollToSection('videos')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-2">
                <Play className="h-8 w-8" />
              </div>
              <div className="font-medium">Vidéos</div>
            </button>
            
            <button
              onClick={() => scrollToSection('partners')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-2">
                <Handshake className="h-8 w-8" />
              </div>
              <div className="font-medium">Partenaires</div>
            </button>
            
            <button
              onClick={() => scrollToSection('media-kit')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="flex justify-center mb-2">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="font-medium">Media Kit</div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};