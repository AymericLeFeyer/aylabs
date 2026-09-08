import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Youtube,
  Instagram,
  Github,
  Mail,
  Search,
  BarChart3,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { NavDropdown } from "./NavDropdown";
import { navGroups, standaloneItems, isItemActive } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  // Fermer les menus quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname]);

  // Fermer le menu mobile au clic en dehors ou sur Échap
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <header className="sticky top-0 z-50 border-b border-ink-line bg-ink/95 text-white backdrop-blur">
          <nav
            ref={mobileNavRef}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="flex h-16 items-center justify-between gap-4">
              <Link
                to="/"
                className="flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
              >
                <img src="/logo-blue.png" alt="" className="h-8 w-8" />
                <span className="font-display text-2xl font-bold text-brand">
                  Labs
                </span>
              </Link>

              <div className="hidden items-center gap-1 md:flex">
                {navGroups
                  .filter((group) => !group.trailing)
                  .map((group) => (
                    <NavDropdown
                      key={group.label}
                      group={group}
                      isOpen={openGroup === group.label}
                      onOpen={() => setOpenGroup(group.label)}
                      onClose={() =>
                        setOpenGroup((current) =>
                          current === group.label ? null : current
                        )
                      }
                    />
                  ))}

                {/* Gardés hors des volets : accès direct permanent */}
                {standaloneItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item, location.pathname);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright ${
                        active
                          ? "bg-brand text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Volets marqués `trailing` : après les entrées directes */}
                {navGroups
                  .filter((group) => group.trailing)
                  .map((group) => (
                    <NavDropdown
                      key={group.label}
                      group={group}
                      isOpen={openGroup === group.label}
                      onOpen={() => setOpenGroup(group.label)}
                      onClose={() =>
                        setOpenGroup((current) =>
                          current === group.label ? null : current
                        )
                      }
                    />
                  ))}

                {/* Barre de recherche */}
                <form onSubmit={handleSearch} className="relative ml-2">
                  <input
                    type="search"
                    placeholder="Rechercher"
                    aria-label="Rechercher sur le site"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 rounded-lg border border-ink-line bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-brand focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-brand lg:w-52 xl:w-64"
                  />
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                    aria-hidden="true"
                  />
                  <button type="submit" className="sr-only">
                    Rechercher
                  </button>
                </form>
              </div>

              {/* Version mobile */}
              <div className="flex items-center gap-2 md:hidden">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="search"
                    placeholder="Rechercher"
                    aria-label="Rechercher sur le site"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-36 rounded-lg border border-ink-line bg-white/5 py-2 pl-8 pr-3 text-sm text-white placeholder-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500"
                    aria-hidden="true"
                  />
                </form>

                <button
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="menu-mobile"
                  className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
                  aria-label={
                    isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
                  }
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Menu mobile */}
            {isMobileMenuOpen && (
              <div
                id="menu-mobile"
                className="-mx-4 border-t border-ink-line px-4 pb-4 pt-2 sm:-mx-6 sm:px-6 md:hidden"
              >
                {navGroups
                  .filter((group) => !group.trailing)
                  .map((group) => (
                  <div key={group.label} className="py-2">
                    <p className="px-1 pb-1 font-display text-sm font-semibold text-gray-500">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item, location.pathname);
                        const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-brand text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`;
                        const content = (
                          <>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            <span>{item.label}</span>
                            {item.external && (
                              <ArrowUpRight
                                className="h-3.5 w-3.5 text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        );

                        if (item.external || item.hardNav) {
                          return (
                            <a
                              key={item.label}
                              href={item.to}
                              target={item.external ? "_blank" : undefined}
                              rel={
                                item.external ? "noopener noreferrer" : undefined
                              }
                              className={className}
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            className={className}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-2 space-y-0.5 border-t border-ink-line pt-3">
                  {standaloneItems.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item, location.pathname);
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-brand text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {navGroups
                  .filter((group) => group.trailing)
                  .map((group) => (
                    <div
                      key={group.label}
                      className="mt-2 border-t border-ink-line pt-3"
                    >
                      <p className="px-1 pb-1 font-display text-sm font-semibold text-gray-500">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.label}
                              href={item.to}
                              target={item.external ? "_blank" : undefined}
                              rel={
                                item.external ? "noopener noreferrer" : undefined
                              }
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                              <span>{item.label}</span>
                              {item.external && (
                                <ArrowUpRight
                                  className="h-3.5 w-3.5 text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </nav>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="border-t border-ink-line bg-ink py-14 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
              <div className="col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <img src="/logo-blue.png" alt="" className="h-8 w-8" />
                  <span className="font-display text-2xl font-bold">AyLabs</span>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-gray-400">
                  Informatique, domotique, développement, homelab, impression
                  3D… 🤓 J'aime découvrir de nouvelles choses et les partager sur
                  ma chaîne.
                </p>
                <div className="mt-6 flex gap-4">
                  <a
                    href="https://youtube.com/@ay_labs"
                    className="text-gray-400 transition-colors hover:text-brand-bright"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com/aylabs_yt"
                    className="text-gray-400 transition-colors hover:text-brand-bright"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://discord.gg/aylabs"
                    className="text-gray-400 transition-colors hover:text-brand-bright"
                    aria-label="Discord"
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                  <a
                    href="mailto:contact@aylabs.fr"
                    className="text-gray-400 transition-colors hover:text-brand-bright"
                    aria-label="Email"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                  <a
                    href="https://github.com/aylabscode"
                    className="text-gray-400 transition-colors hover:text-brand-bright"
                    aria-label="GitHub"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                </div>
              </div>

              {navGroups.map((group) => (
                <div key={group.label}>
                  <h3 className="mb-4 font-display text-base font-semibold">
                    {group.label}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const className =
                        "flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-bright";
                      const content = (
                        <>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span>{item.label}</span>
                        </>
                      );

                      return (
                        <li key={item.label}>
                          {item.external || item.hardNav ? (
                            <a
                              href={item.to}
                              target={item.external ? "_blank" : undefined}
                              rel={
                                item.external ? "noopener noreferrer" : undefined
                              }
                              className={className}
                            >
                              {content}
                            </a>
                          ) : (
                            <Link to={item.to} className={className}>
                              {content}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                    {group.label === "Plus" && (
                      <>
                        {standaloneItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.label}>
                              <Link
                                to={item.to}
                                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-bright"
                              >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                        <li>
                          <Link
                            to="/#media-kit"
                            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand-bright"
                          >
                            <BarChart3 className="h-4 w-4" aria-hidden="true" />
                            <span>Media Kit</span>
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-7xl border-t border-ink-line px-4 pt-8 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500">
              Site créé en partie grâce à l'intelligence artificielle
            </p>
            <p className="text-sm text-gray-500">
              © 2025 AyLabs. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};
