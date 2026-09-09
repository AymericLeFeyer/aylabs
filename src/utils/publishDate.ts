/**
 * Mise en ligne programmée des fiches.
 *
 * `pubDate` porte la date ("Nov 29 2025"), `pubTime` l'heure optionnelle
 * ("18:00", heure locale du visiteur). Sans `pubTime`, la fiche sort à minuit —
 * le comportement d'avant l'ajout du champ.
 *
 * L'heure ne sert **qu'**à décider si la fiche est visible : elle n'est jamais
 * affichée sur le site.
 */

const TIME_RE = /^(\d{1,2}):(\d{2})$/;

/** Date/heure de sortie, ou `null` si `pubDate` n'est pas interprétable. */
export const resolvePublishDate = (
  pubDate?: string | null,
  pubTime?: string | null
): Date | null => {
  const date = new Date(pubDate ?? "");
  if (Number.isNaN(date.getTime())) return null;

  const match = String(pubTime ?? "").trim().match(TIME_RE);
  if (match) {
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours < 24 && minutes < 60) date.setHours(hours, minutes, 0, 0);
  }

  return date;
};

/** Horodatage pour le tri ; les dates illisibles partent en fin de liste. */
export const publishTimestamp = (
  pubDate?: string | null,
  pubTime?: string | null
): number => resolvePublishDate(pubDate, pubTime)?.getTime() ?? 0;

/**
 * `false` tant que l'heure de sortie n'est pas passée. Une date illisible est
 * traitée comme non publiée : mieux vaut masquer une fiche que d'en sortir une
 * en avance.
 */
export const isPublished = (
  pubDate?: string | null,
  pubTime?: string | null,
  now: Date = new Date()
): boolean => {
  const date = resolvePublishDate(pubDate, pubTime);
  return date !== null && date.getTime() <= now.getTime();
};
