import type { ContentFile } from '../entities/ContentItem';

export interface SuggestionSet {
  videoTags: string[];
  productTags: string[];
  protocols: string[];
  compatible: string[];
  categories: string[];
  promoPlatforms: string[];
}

interface Counted {
  value: string;
  count: number;
}

const collect = (files: ContentFile[], key: string): Counted[] => {
  const counts = new Map<string, number>();
  for (const file of files) {
    const raw = file.frontmatter[key];
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const v of values) {
      const value = String(v).trim();
      if (!value) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'fr'));
};

/** Les valeurs déjà utilisées dans le contenu, les plus fréquentes en tête. */
export const buildSuggestions = (files: ContentFile[]): SuggestionSet => {
  const videos = files.filter((f) => f.kind === 'video');
  const products = files.filter((f) => f.kind === 'product');

  const platforms = new Set<string>();
  for (const p of products) {
    const promo = p.frontmatter.promoCode as Record<string, unknown> | null | undefined;
    if (promo && typeof promo === 'object' && promo.platform) platforms.add(String(promo.platform));
  }

  return {
    videoTags: collect(videos, 'tags').map((c) => c.value),
    productTags: collect(products, 'tags').map((c) => c.value),
    protocols: collect(products, 'protocols').map((c) => c.value),
    compatible: collect(products, 'compatible').map((c) => c.value),
    categories: collect(products, 'category').map((c) => c.value),
    promoPlatforms: [...platforms].sort((a, b) => a.localeCompare(b, 'fr')),
  };
};

export const countUsage = collect;
