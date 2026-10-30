export const RUN_INTERVAL_MS = 4 * 60 * 60 * 1000;

/**
 * Prochain créneau multiple de 4 h (UTC), strictement après `now`. Caler les
 * passages sur l'horloge évite qu'un redéploiement du conteneur décale le
 * planning ou relance un commit.
 */
export const nextRunAt = (now: Date): Date =>
  new Date((Math.floor(now.getTime() / RUN_INTERVAL_MS) + 1) * RUN_INTERVAL_MS);
