import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Contenu placé au-dessus du titre : lien de retour, fil d'Ariane… */
  eyebrow?: React.ReactNode;
  /** Contenu optionnel sous le texte : compteur, filtres, bouton… */
  children?: React.ReactNode;
}

/**
 * En-tête commun à toutes les pages : même fond sombre que la barre de
 * navigation, pour que l'ensemble se lise comme un seul bloc.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  eyebrow,
  children,
}) => (
  <div className="relative overflow-hidden bg-ink text-white">
    <div
      className="pointer-events-none absolute inset-0 bg-grid"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-[110px]"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
      {eyebrow && <div className="mb-5">{eyebrow}</div>}
      <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  </div>
);
