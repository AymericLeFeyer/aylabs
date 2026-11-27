/** Évènements où AyLabs est présent (page /events). */
export interface AyEvent {
  slug: string;
  title: string;
  /** Date de début, AAAA-MM-JJ. */
  date: string;
  /** Date de fin, AAAA-MM-JJ (incluse). */
  endDate?: string;
  /** Ce qui s'affiche comme date sur la carte. */
  dateLabel: string;
  venue: string;
  city: string;
  summary: string;
}

export const EVENTS: AyEvent[] = [
  {
    slug: "salon-robotik-2026",
    title: "Salon Robotik 2026",
    date: "2026-11-28",
    endDate: "2026-11-29",
    dateLabel: "Samedi 28 novembre, 10 h – 18 h",
    venue: "Pévèle Carembault Arena",
    city: "Orchies (59)",
    summary:
      "J'expose sur le salon du numérique et de l'industrie du futur de la Pévèle Carembault : une planche de démo domotique 100 % locale, et des goodies imprimés en 3D.",
  },
];

/** Vrai tant que le dernier jour de l'évènement n'est pas passé. */
export const isUpcoming = (event: AyEvent, now = new Date()): boolean =>
  new Date(`${event.endDate ?? event.date}T23:59:59`) >= now;
