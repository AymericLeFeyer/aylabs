import { toIsoDate, toPubDate } from '../../../shared/date';
import type { ContentFile, ProductDraft, PromoCode, VideoDraft } from '../entities/ContentItem';
import { buildMarkdown, type FrontmatterValue } from './frontmatter';

const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v));
const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((i) => str(i)).filter((i) => i.trim() !== '') : [];
const num = (v: unknown): number | '' => (typeof v === 'number' && !Number.isNaN(v) ? v : '');

const promo = (v: unknown): PromoCode | null => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  return {
    code: str(o.code),
    percent: typeof o.percent === 'number' ? o.percent : 0,
    expiresAt: o.expiresAt === null || o.expiresAt === undefined ? null : str(o.expiresAt),
    platform: str(o.platform),
  };
};

export const fileToVideoDraft = (file: ContentFile): VideoDraft => {
  const f = file.frontmatter;
  return {
    slug: file.slug,
    title: str(f.title),
    description: str(f.description),
    pubDate: toIsoDate(str(f.pubDate)),
    code: str(f.code),
    duration: str(f.duration),
    tags: list(f.tags),
    body: file.body,
  };
};

export const fileToProductDraft = (file: ContentFile): ProductDraft => {
  const f = file.frontmatter;
  return {
    slug: file.slug,
    title: str(f.title),
    image: str(f.image),
    description: str(f.description),
    tags: list(f.tags),
    protocols: list(f.protocols),
    compatible: list(f.compatible),
    videoCode: str(f.videoCode),
    buyLinks: list(f.buyLinks),
    pubDate: toIsoDate(str(f.pubDate)),
    category: str(f.category) || 'Domotique',
    price: num(f.price),
    promoPrice: num(f.promoPrice),
    promoCode: promo(f.promoCode),
    pros: list(f.pros),
    cons: list(f.cons),
    verdict: str(f.verdict),
    rating: num(f.rating),
    body: file.body,
  };
};

/** Ordre des clés aligné sur les fiches existantes, pour des diffs git lisibles. */
export const videoDraftToMarkdown = (draft: VideoDraft): string =>
  buildMarkdown(
    [
      ['title', draft.title],
      ['description', draft.description],
      ['pubDate', toPubDate(draft.pubDate)],
      ['code', draft.code],
      ['duration', draft.duration],
      ['tags', draft.tags],
    ] as [string, FrontmatterValue | undefined][],
    draft.body
  );

export const productDraftToMarkdown = (draft: ProductDraft): string =>
  buildMarkdown(
    [
      ['title', draft.title],
      ['image', draft.image],
      ['description', draft.description],
      ['tags', draft.tags],
      ['protocols', draft.protocols],
      ['compatible', draft.compatible],
      ['videoCode', draft.videoCode],
      ['buyLinks', draft.buyLinks],
      ['promoCode', draft.promoCode ? { ...draft.promoCode } : undefined],
      ['promoPrice', draft.promoPrice === '' ? undefined : draft.promoPrice],
      ['pubDate', toPubDate(draft.pubDate)],
      ['category', draft.category],
      ['price', draft.price === '' ? 0 : draft.price],
      ['rating', draft.rating === '' ? undefined : draft.rating],
      ['pros', draft.pros],
      ['cons', draft.cons],
      ['verdict', draft.verdict],
    ] as [string, FrontmatterValue | undefined][],
    draft.body
  );
