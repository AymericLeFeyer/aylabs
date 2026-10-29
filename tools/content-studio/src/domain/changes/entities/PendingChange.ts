/** Ce que touche une modification : une fiche, ou un fichier de données du site. */
export type ChangeScope = 'video' | 'product' | 'stats';

/**
 * Un fichier enregistré dans le Studio mais pas encore commité. Toutes les
 * modifications en attente partent ensemble dans un seul commit, donc un seul
 * déploiement du site.
 */
export interface PendingChange {
  path: string;
  /** Contenu complet du fichier, tel qu'il sera commité. */
  content: string;
  scope: ChangeScope;
  /** Ligne de journal, ex. `content(video): add mon-slug`. */
  message: string;
  /**
   * SHA du blob sur la branche au premier enregistrement ; absent pour un
   * fichier neuf. Sert à refuser le commit si le fichier a été modifié sur
   * GitHub entre-temps.
   */
  baseSha?: string;
  /** ISO 8601, date du dernier enregistrement. */
  stagedAt: string;
}

export interface CommitResult {
  commitSha: string;
  commitUrl: string;
}
