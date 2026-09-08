import type { ChannelVideo, HiddenVideo } from '../../../domain/stats/entities/ChannelVideo';
import type { StatsRepository } from '../../../domain/stats/repositories/StatsRepository';

export interface HiddenVideosState {
  videos: ChannelVideo[];
  hidden: HiddenVideo[];
  sha?: string;
}

export class ManageHiddenVideos {
  constructor(private readonly repository: StatsRepository) {}

  async load(): Promise<HiddenVideosState> {
    const [videos, file] = await Promise.all([
      this.repository.fetchChannelVideos(),
      this.repository.fetchHiddenVideos(),
    ]);
    return { videos, hidden: file.entries, sha: file.sha };
  }

  /**
   * Le SHA distant est relu juste avant l'écriture : deux onglets ouverts ne
   * peuvent pas s'écraser silencieusement.
   */
  async save(entries: HiddenVideo[]): Promise<HiddenVideo[]> {
    const current = await this.repository.fetchHiddenVideos();
    await this.repository.saveHiddenVideos(entries, current.sha);
    return entries;
  }
}
