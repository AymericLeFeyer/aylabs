export type ContentKind = 'video' | 'product';

/** Fiche telle que stockée : frontmatter brut + corps markdown. */
export interface ContentFile {
  kind: ContentKind;
  slug: string;
  path: string;
  frontmatter: Record<string, unknown>;
  body: string;
  /** SHA git du blob tel que connu localement (sert à détecter les divergences avec GitHub). */
  localSha?: string;
}

export interface PromoCode {
  code: string;
  percent: number;
  expiresAt: string | null;
  platform: string;
}

export interface VideoDraft {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  code: string;
  duration: string;
  tags: string[];
  body: string;
}

export interface ProductDraft {
  slug: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  protocols: string[];
  compatible: string[];
  videoCode: string;
  buyLinks: string[];
  pubDate: string;
  category: string;
  price: number | '';
  promoPrice: number | '' | null;
  promoCode: PromoCode | null;
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number | '';
  body: string;
}

export type Draft = VideoDraft | ProductDraft;

export const emptyVideo = (pubDate: string): VideoDraft => ({
  slug: '',
  title: '',
  description: '',
  pubDate,
  code: '',
  duration: '',
  tags: [],
  body: '',
});

export const emptyProduct = (pubDate: string): ProductDraft => ({
  slug: '',
  title: '',
  image: '',
  description: '',
  tags: [],
  protocols: [],
  compatible: [],
  videoCode: '',
  buyLinks: [],
  pubDate,
  category: 'Domotique',
  price: '',
  promoPrice: '',
  promoCode: null,
  pros: [],
  cons: [],
  verdict: '',
  rating: '',
  body: '',
});
