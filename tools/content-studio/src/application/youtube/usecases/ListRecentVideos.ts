import type { YouTubeFeedRepository } from '../../../domain/youtube/repositories/YouTubeFeedRepository';
import { importCandidates, type ImportCandidate } from '../../../domain/youtube/services/videoImport';

export class ListRecentVideos {
  constructor(private readonly repository: YouTubeFeedRepository) {}

  /** Vidéos longues récentes, chacune marquée si une fiche existe déjà. */
  async execute(knownCodes: Set<string>): Promise<ImportCandidate[]> {
    return importCandidates(await this.repository.fetchRecent(), knownCodes);
  }
}
