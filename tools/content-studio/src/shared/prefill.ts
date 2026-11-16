import type { ProductDraft, VideoDraft } from '../domain/content/entities/ContentItem';
import { normalizeTime } from './date';

/**
 * Une fiche à créer, préremplie par un outil externe (le Creator Studio) via l'URL :
 *
 *   /?creer=video&title=…&description=…&pubDate=2026-11-16&pubTime=18:00&code=…&duration=10:18&tag=…&body=…
 *   /?creer=produit&title=…&image=…&description=…&category=…&price=119.99&videoCode=…&pubDate=…&buyLink=…&tag=…
 *
 * Les noms sont ceux des champs du brouillon ; les listes se répètent (`tag`, `buyLink`).
 * Rien n'est enregistré : la fiche s'ouvre dans l'éditeur, on la finit à la main.
 */
export type Prefill =
  | { kind: 'video'; draft: Partial<VideoDraft> }
  | { kind: 'product'; draft: Partial<ProductDraft> };

const STORAGE_KEY = 'aylabs-studio:prefill';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const text = (params: URLSearchParams, key: string): string | undefined => {
  const value = params.get(key)?.trim();
  return value ? value : undefined;
};

const list = (params: URLSearchParams, key: string): string[] | undefined => {
  const values = params
    .getAll(key)
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
};

const defined = <T extends object>(draft: T): T =>
  Object.fromEntries(Object.entries(draft).filter(([, value]) => value !== undefined)) as T;

export const parsePrefill = (search: string): Prefill | null => {
  const params = new URLSearchParams(search);
  const kind = params.get('creer');
  const date = text(params, 'pubDate');
  const pubDate = date && ISO_DATE.test(date) ? date : undefined;

  if (kind === 'video') {
    const time = text(params, 'pubTime');
    return {
      kind: 'video',
      draft: defined<Partial<VideoDraft>>({
        title: text(params, 'title'),
        description: text(params, 'description'),
        pubDate,
        pubTime: time ? normalizeTime(time) : undefined,
        code: text(params, 'code'),
        duration: text(params, 'duration'),
        tags: list(params, 'tag'),
        body: text(params, 'body'),
      }),
    };
  }

  if (kind === 'produit') {
    const price = Number(text(params, 'price'));
    return {
      kind: 'product',
      draft: defined<Partial<ProductDraft>>({
        title: text(params, 'title'),
        image: text(params, 'image'),
        description: text(params, 'description'),
        category: text(params, 'category'),
        price: Number.isFinite(price) && price > 0 ? price : undefined,
        videoCode: text(params, 'videoCode'),
        pubDate,
        buyLinks: list(params, 'buyLink'),
        tags: list(params, 'tag'),
      }),
    };
  }

  return null;
};

/**
 * À appeler **avant** le rendu : la connexion GitHub renvoie à la racine et perdrait les
 * paramètres. La demande est mise de côté le temps de s'authentifier, puis reprise par
 * `takePrefill`, et l'adresse est nettoyée pour qu'un rechargement ne la rejoue pas.
 */
export const capturePrefill = (): void => {
  const prefill = parsePrefill(window.location.search);
  if (!prefill) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefill));
  } catch {
    /* stockage indisponible : la demande est perdue, l'éditeur s'ouvre vide */
  }
  window.history.replaceState({}, '', window.location.pathname);
};

/** Lit la demande en attente, une seule fois. */
export const takePrefill = (): Prefill | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as Prefill;
  } catch {
    return null;
  }
};
