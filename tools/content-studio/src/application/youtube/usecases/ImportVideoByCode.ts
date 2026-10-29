import type { YouTubeFeedRepository } from '../../../domain/youtube/repositories/YouTubeFeedRepository';
import type { ImportCandidate } from '../../../domain/youtube/services/videoImport';

export class ImportVideoByCode {
  constructor(private readonly repository: YouTubeFeedRepository) {}

  /** Lit une vidéo par son code, pour celles que le flux de la chaîne ne montre pas. */
  async execute(code: string, knownCodes: Set<string>): Promise<ImportCandidate> {
    const video = await this.repository.fetchByCode(code);
    return { video, hasCard: knownCodes.has(video.code) };
  }
}
