import type { PendingChange } from '../../../domain/changes/entities/PendingChange';
import type { ChannelVideo, HiddenVideo } from '../../../domain/stats/entities/ChannelVideo';
import type { StatsRepository } from '../../../domain/stats/repositories/StatsRepository';
import {
  hiddenVideosCommitMessage,
  parseHiddenVideos,
  serializeHiddenVideos,
} from '../../../domain/stats/services/hiddenVideos';
import { STATS_FILES } from '../../../shared/config';

export interface HiddenVideosState {
  videos: ChannelVideo[];
  hidden: HiddenVideo[];
}

export class ManageHiddenVideos {
  constructor(private readonly repository: StatsRepository) {}

  /**
   * Une banlist enregistrée mais pas encore commitée (`pending`) prime sur
   * celle de la branche : c'est elle que l'utilisateur a sous les yeux.
   */
  async load(pending?: PendingChange): Promise<HiddenVideosState> {
    const [videos, file] = await Promise.all([
      this.repository.fetchChannelVideos(),
      this.repository.fetchHiddenVideos(),
    ]);
    const hidden = pending ? parseHiddenVideos(pending.content) : file.entries;
    return { videos, hidden };
  }

  /**
   * Prépare la modification sans commiter. Le SHA distant, relu ici, devient
   * le `baseSha` revérifié au moment du commit groupé.
   */
  async save(entries: HiddenVideo[]): Promise<PendingChange> {
    const current = await this.repository.fetchHiddenVideos();
    return {
      path: STATS_FILES.hidden,
      content: serializeHiddenVideos(entries),
      scope: 'stats',
      message: hiddenVideosCommitMessage(entries),
      baseSha: current.sha,
      stagedAt: new Date().toISOString(),
    };
  }
}
