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
