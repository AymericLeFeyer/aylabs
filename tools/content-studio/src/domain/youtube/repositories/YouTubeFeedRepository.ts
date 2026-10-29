import type { RecentYouTubeVideo } from '../entities/RecentYouTubeVideo';

export interface YouTubeFeedRepository {
  /** Les 15 dernières publications de la chaîne, shorts compris, de la plus récente à la plus ancienne. */
  fetchRecent(): Promise<RecentYouTubeVideo[]>;
  /** Une vidéo précise, même absente du flux (non répertoriée, plus ancienne). */
  fetchByCode(code: string): Promise<RecentYouTubeVideo>;
}
