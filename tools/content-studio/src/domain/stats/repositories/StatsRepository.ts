import type { ChannelVideo, HiddenVideo, HiddenVideosFile } from '../entities/ChannelVideo';

export interface StatsRepository {
  /** Vidéos du fichier de stats, de la plus récente à la plus ancienne. */
  fetchChannelVideos(): Promise<ChannelVideo[]>;
  fetchHiddenVideos(): Promise<HiddenVideosFile>;
  saveHiddenVideos(entries: HiddenVideo[], sha?: string): Promise<void>;
}
