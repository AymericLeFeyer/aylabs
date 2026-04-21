export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  tags?: string[];
  content: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: number;
  image: string;
  author: string;
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  publishedAt: string;
  avatar: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  testedDate: string;
  videoUrl: string;
  videoCode?: string;
  amazonLink?: string;
  domadooLink?: string;
  geekbuyingLink?: string;
  minixLink?: string;
  reolinkLink?: string;
  bambuLink?: string;
  price: number;
  pros: string[];
  cons: string[];
  verdict: string;
  tags?: string[];
  protocols?: string[];
  compatible?: string[];
  slug: string;
  promoPrice: number | null | undefined;
  promoCode?: { code: string; percent: number; expiresAt: string | null; platform: string } | null;
  merossLink?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
