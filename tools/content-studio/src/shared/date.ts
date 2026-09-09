const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format utilisé par les frontmatters du site : "Nov 29 2025". */
export const toPubDate = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')} ${y}`;
};

/** Inverse de toPubDate, tolérant aux formats hétérogènes déjà présents dans le contenu. */
export const toIsoDate = (pubDate: string): string => {
  if (!pubDate) return '';
  const parsed = new Date(pubDate);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(
      parsed.getDate()
    ).padStart(2, '0')}`;
  }
  // Format "8 jun 2026" présent sur quelques fiches
  const m = pubDate.match(/^(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);
  if (m) {
    const idx = MONTHS.findIndex((mo) => mo.toLowerCase() === m[2].slice(0, 3).toLowerCase());
    if (idx >= 0) return `${m[3]}-${String(idx + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return '';
};

export const todayIso = (): string => toIsoDate(new Date().toISOString());

/**
 * Normalise une heure saisie vers "HH:MM". Chaîne vide = pas d'heure : la fiche
 * sort à minuit, comme avant l'ajout du champ.
 */
export const normalizeTime = (raw: string): string => {
  const m = raw.trim().match(/^([0-9]{1,2})[:hH ]?([0-9]{1,2})?$/);
  if (!m) return '';
  const hours = Number(m[1]);
  const minutes = Number(m[2] ?? 0);
  if (hours > 23 || minutes > 59) return '';
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Miroir de `src/utils/publishDate.ts` côté site : tant que la date (et
 * l'heure, si elle est renseignée) ne sont pas passées, la fiche n'est pas
 * servie par le site. Toute correction ici doit être reportée là-bas.
 */
export const isScheduled = (pubDate: string, pubTime = '', now: Date = new Date()): boolean => {
  const iso = toIsoDate(pubDate);
  if (!iso) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const time = normalizeTime(pubTime);
  const hours = time ? Number(time.slice(0, 2)) : 0;
  const minutes = time ? Number(time.slice(3, 5)) : 0;
  return new Date(y, m - 1, d, hours, minutes).getTime() > now.getTime();
};

export const formatFr = (pubDate: string): string => {
  const iso = toIsoDate(pubDate);
  if (!iso) return pubDate;
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Normalise une durée saisie librement vers "mm:ss" ou "h:mm:ss". */
export const normalizeDuration = (raw: string): string => {
  const digits = raw.replace(/[^\d:]/g, '');
  if (!digits) return '';
  const parts = digits.split(':').filter(Boolean);
  if (parts.length === 1) return `0:${parts[0].padStart(2, '0')}`;
  return parts
    .map((p, i) => (i === 0 ? String(Number(p)) : p.padStart(2, '0')))
    .join(':');
};
