import {
  BookOpen,
  Heart,
  MessageCircle,
  Package,
  Play,
  ShoppingCart,
  FileText,
  Server,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  /** Description courte affichée dans le volet déroulant. */
  hint: string;
  to: string;
  icon: LucideIcon;
  /** Lien externe : ouvert dans un nouvel onglet. */
  external?: boolean;
  /** Rechargement complet plutôt que navigation SPA. */
  hardNav?: boolean;
  /** Préfixes de routes qui rendent l'entrée active. */
  match?: string[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  /** Placé après les entrées directes, juste avant la recherche. */
  trailing?: boolean;
}

export const navGroups: NavGroup[] = [
  {
    label: "Contenu",
    items: [
      {
        label: "Vidéos",
        hint: "Toutes les vidéos de la chaîne",
        to: "/videos",
        icon: Play,
        hardNav: true,
        match: ["/video"],
      },
      {
        label: "Tutoriels",
        hint: "Guides pas à pas",
        to: "/tutoriels",
        icon: BookOpen,
        match: ["/tutoriel"],
      },
    ],
  },
  {
    label: "Produits",
    items: [
      {
        label: "Produits testés",
        hint: "Fiches, verdicts et liens",
        to: "/produits-testes",
        icon: Package,
        match: ["/produit"],
      },
      {
        label: "Bonnes affaires",
        hint: "Codes promo en cours",
        to: "/deals",
        icon: ShoppingCart,
        match: ["/deals"],
      },
    ],
  },
  {
    label: "Plus",
    trailing: true,
    items: [
      {
        label: "Docs",
        hint: "Ma documentation technique",
        to: "https://docs.aylabs.fr",
        icon: FileText,
        external: true,
      },
      {
        label: "Setup",
        hint: "Le matériel que j'utilise",
        to: "https://setup.aylabs.fr",
        icon: Server,
        external: true,
      },
    ],
  },
];

/**
 * Entrées gardées hors des volets : elles restent visibles en permanence dans la
 * barre, entre le dernier volet et la recherche.
 */
export const standaloneItems: NavItem[] = [
  {
    label: "Réseaux",
    hint: "Où me retrouver et m'écrire",
    to: "/reseaux",
    icon: MessageCircle,
    match: ["/reseaux"],
  },
  {
    label: "Me soutenir",
    hint: "Donner un coup de pouce à la chaîne",
    to: "/support",
    icon: Heart,
    match: ["/support"],
  },
];

export const isItemActive = (item: NavItem, pathname: string): boolean => {
  if (item.external) return false;
  return (item.match ?? [item.to]).some((prefix) => pathname.startsWith(prefix));
};

export const isGroupActive = (group: NavGroup, pathname: string): boolean =>
  group.items.some((item) => isItemActive(item, pathname));
