import React from 'react';
import { Mail, Youtube, Instagram, Wrench } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#398FBA] to-[#2a6d94] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rejoignez la communauté ! 
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Connectons-nous sur mes différents réseaux ! Discussions, 
            partage de projets, entraide communautaire... Choisissez votre plateforme préférée !
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Réseaux sociaux dans une div flottante */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Mes réseaux sociaux</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Retrouvez-moi sur vos plateformes préférées pour du contenu exclusif, 
            des discussions en direct et une communauté passionnée !
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* YouTube */}
            <a
              href="https://youtube.com/@ay_labs"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-red-500 rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <Youtube className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">YouTube</h3>
                  <p className="text-gray-600">@ay_labs</p>
                </div>
              </div>
            </a>

            {/* Discord */}
            <a
              href="https://discord.gg/hnu4CV2TK9"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-500 rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Discord</h3>
                  <p className="text-gray-600">AyLabs</p>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/aylabs_yt"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Instagram</h3>
                  <p className="text-gray-600">@aylabs_yt</p>
                </div>
              </div>
            </a>

            {/* Mail */}
            <a
              href="mailto:contact@aylabs.fr"
              className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">contact@aylabs.fr</p>
                </div>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@ay_labs"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-black rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.33 6.33 0 0 0 10.86-4.43V7.83a8.24 8.24 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">TikTok</h3>
                  <p className="text-gray-600">@ay_labs</p>
                </div>
              </div>
            </a>

            {/* MakerWorld */}
            <a
              href="https://makerworld.com/@aylabs"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-orange-500 rounded-xl p-3 group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">MakerWorld</h3>
                  <p className="text-gray-600">@aylabs</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};