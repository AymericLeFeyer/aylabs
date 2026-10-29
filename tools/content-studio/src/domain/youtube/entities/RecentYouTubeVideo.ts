/** Une publication du flux RSS de la chaîne, telle que `/api/youtube/recent` la renvoie. */
export interface RecentYouTubeVideo {
  code: string;
  title: string;
  /** Description complète de YouTube, sur plusieurs lignes. */
  description: string;
  /** Date de mise en ligne, ISO 8601 UTC. */
  publishedAt: string;
  /** `null` quand le serveur n'a pas pu lire la page de la vidéo. */
  durationSeconds: number | null;
  isShort: boolean;
}
