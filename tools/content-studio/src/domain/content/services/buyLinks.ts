/** Plateformes reconnues par le site (cf. loadProducts dans markdownLoader.ts). */
const KNOWN: { id: string; label: string; test: (url: string) => boolean }[] = [
  { id: 'amazon', label: 'Amazon', test: (u) => u.includes('amzn.to') || u.includes('amazon') },
  { id: 'domadoo', label: 'Domadoo', test: (u) => u.includes('domadoo') },
  { id: 'geekbuying', label: 'Geekbuying', test: (u) => u.includes('geekbuying') },
  { id: 'minix', label: 'Minix', test: (u) => u.includes('minix') },
  { id: 'reolink', label: 'Reolink', test: (u) => u.includes('reolink') },
  { id: 'bambu', label: 'Bambu Lab', test: (u) => u.includes('bambu') },
  { id: 'meross', label: 'Meross', test: (u) => u.includes('meross') },
];

/** Un lien d'achat peut porter un label perso : `Mon label | https://...` (liens génériques seulement). */
export const splitBuyLink = (raw: string): { url: string; label: string } => {
  const idx = raw.indexOf(' | ');
  if (idx === -1) return { url: raw.trim(), label: '' };
  return { url: raw.slice(idx + 3).trim(), label: raw.slice(0, idx).trim() };
};

export const joinBuyLink = (url: string, label: string): string => {
  const clean = label.replace(/["|]/g, '').trim();
  return clean ? `${clean} | ${url.trim()}` : url.trim();
};

/** Libellé affiché sur le site pour un lien générique sans label perso (cf. ProductDetail). */
export const defaultGenericLabel = (url: string): string => {
  try {
    const host = new URL(url.includes('://') ? url : `https://${url}`).hostname.replace(/^www\./, '').split('.')[0];
    return host.charAt(0).toUpperCase() + host.slice(1);
  } catch {
    return 'Lien';
  }
};

export const detectPlatform = (url: string): string => {
  const lower = url.toLowerCase();
  const known = KNOWN.find((k) => k.test(lower));
  if (known) return known.label;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Lien';
  }
};

/** true si le site saura router ce lien vers un bouton dédié. */
export const isKnownPlatform = (url: string): boolean => KNOWN.some((k) => k.test(url.toLowerCase()));

export const knownPlatformLabels = KNOWN.map((k) => k.label);
