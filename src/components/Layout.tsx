import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Youtube,
  Instagram,
  Github,
  Mail,
  Search,
  Play,
  Package,
  BookOpen,
  BarChart3,
  MessageCircle,
  Heart,
  Star,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const [_, setCookieConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie_consent");
    if (consent === "true") {
      setCookieConsent(true);
    } else if (consent === "false") {
      setCookieConsent(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("cookie_consent", "true", { expires: 365 });
    setCookieConsent(true);
    setShowBanner(false);
  };

  const denyCookies = () => {
    Cookies.set("cookie_consent", "false", { expires: 365 });
    setCookieConsent(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* Bandeau de consentement */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 bg-gray-800 text-white p-4 rounded shadow flex justify-between items-center z-50">
          <span>
            Nous utilisons des cookies pour mémoriser vos informations de
            commentaire. Acceptez-vous ?
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={acceptCookies}
              className="ml-4 bg-[#38B000] px-4 py-2 rounded hover:bg-[#2E8B00]"
            >
              Accepter
            </button>
            <button
              onClick={denyCookies}
              className="ml-4 bg-[#E63946] px-4 py-2 rounded hover:bg-[#B22234]"
            >
              Refuser
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-[#141414] text-white sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/"
                className="flex items-center space-x-2 text-[#398FBA]"
              >
                <img src="/logo-blue.png" alt="AyLabs" className="h-8 w-8" />
                <span className="text-2xl font-bold text-[#398FBA]">Labs</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="/videos"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/video")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Vidéos</span>
                  </div>
                </a>
                <Link
                  to="/produits-testes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/produit")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Produits Testés</span>
                  </div>
                </Link>
                <Link
                  to="/tutoriels"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/tutoriel")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Tutoriels</span>
                  </div>
                </Link>
                <Link
                  to="/reseaux"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/reseaux")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Réseaux</span>
                  </div>
                </Link>

                <Link
                  to="https://docs.aylabs.fr"
                  target="_blank"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/docs")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Docs</span>
                  </div>
                </Link>

                <Link
                  to="/deals"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/deals")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </Link>

                <Link
                  to="/support"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/support")
                      ? "bg-[#398FBA] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                  </div>
                </Link>

                {/* Barre de recherche */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#398FBA] focus:bg-gray-600 transition-colors w-64"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button type="submit" className="sr-only">
                    Rechercher
                  </button>
                </form>
              </div>
              {/* Version mobile */}
              <div className="md:hidden flex items-center space-x-4">
                {/* Recherche mobile */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 px-3 py-2 pl-8 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#398FBA] w-40"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                </form>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="text-gray-300 hover:text-white p-2"
                  aria-label="Menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-[#141414] border-t border-gray-700">
                <div className="px-4 py-2 space-y-1">
                  <a
                    href="/videos"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith("/video")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Vidéos</span>
                    </div>
                  </a>
                  <Link
                    to="/produits-testes"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith("/produit")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Produits Testés</span>
                    </div>
                  </Link>
                  <Link
                    to="/tutoriels"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.startsWith("/tutoriel")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Tutoriels</span>
                    </div>
                  </Link>
                  <Link
                    to="/reseaux"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/reseaux")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Réseaux</span>
                    </div>
                  </Link>
                  <Link
                    to="https://docs.aylabs.fr"
                    target="_blank"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/docs")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Docs</span>
                    </div>
                  </Link>
                  <Link
                    to="/deals"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/deals")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Bonnes affaires</span>
                    </div>
                  </Link>
                  <Link
                    to="/support"
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/support")
                        ? "bg-[#398FBA] text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>Me soutenir</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-[#141414] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img src="/logo-blue.png" alt="AyLabs" className="h-8 w-8" />
                  <span className="text-2xl font-bold">AyLabs</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Informatique, Domotique, Développement, Homelab, Impression 3D...  🤓<br/>
                  J'aime découvrir de nouvelles choses et les partager sur ma chaîne
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                <ul className="grid grid-cols-2 gap-y-2 ">
                  <li>
                    <a
                      href="/videos"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Vidéos</span>
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/produits-testes"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <Package className="h-4 w-4" />
                      <span>Produits Testés</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tutoriels"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Tutoriels</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#media-kit"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Media Kit</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/reseaux"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Réseaux</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="https://docs.aylabs.fr"
                      target="_blank"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Docs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/deals"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Bonnes affaires</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      className="text-gray-400 hover:text-[#398FBA] transition-colors flex items-center space-x-2"
                    >
                      <Heart className="h-4 w-4" />
                      <span>Me soutenir</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Suivez-moi</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://youtube.com/@ay_labs"
                    className="text-gray-400 hover:text-[#398FBA] transition-colors"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com/aylabs_yt"
                    className="text-gray-400 hover:text-[#398FBA] transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://discord.gg/aylabs"
                    className="text-gray-400 hover:text-[#398FBA] transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/aylabscode"
                    className="text-gray-400 hover:text-[#398FBA] transition-colors"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="mailto:contact@aylabs.fr"
                    className="text-gray-400 hover:text-[#398FBA] transition-colors"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              Site créé en partie grâce à l'intelligence artificielle
            </p>
            <p className="text-gray-400">
              © 2025 AyLabs. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
