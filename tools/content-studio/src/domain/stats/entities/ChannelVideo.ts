/**
 * Une vidéo telle que le workflow n8n l'écrit dans `public/youtube-stats.json`.
 * `id` est le code YouTube à 11 caractères, c'est lui qui sert de clé dans la
 * banlist.
 */
export interface ChannelVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
}

/** Une entrée de la banlist : le code, plus de quoi la relire six mois après. */
export interface HiddenVideo {
  code: string;
  title: string;
  /** Date d'ajout à la banlist, au format ISO court. */
  hiddenAt: string;
}

export interface HiddenVideosFile {
  entries: HiddenVideo[];
  /** SHA du blob distant, requis pour réécrire le fichier. Absent s'il n'existe pas encore. */
  sha?: string;
}
