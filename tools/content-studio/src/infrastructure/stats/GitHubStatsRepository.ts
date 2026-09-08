import type { ChannelVideo, HiddenVideo, HiddenVideosFile } from '../../domain/stats/entities/ChannelVideo';
import type { StatsRepository } from '../../domain/stats/repositories/StatsRepository';
import {
  parseChannelVideos,
  parseHiddenVideos,
  serializeHiddenVideos,
} from '../../domain/stats/services/hiddenVideos';
import { REPO, STATS_FILES } from '../../shared/config';
import { fromBase64, GitHubApiClient, GitHubError, toBase64 } from '../github/GitHubApiClient';

interface ContentsResponse {
  sha: string;
  content: string;
  encoding: string;
}

const contentsUrl = (path: string) =>
  `/repos/${REPO.owner}/${REPO.name}/contents/${encodeURI(path)}`;

export class GitHubStatsRepository implements StatsRepository {
  private readonly client = new GitHubApiClient();

  private async read(path: string): Promise<{ text: string; sha: string } | null> {
    try {
      const file = await this.client.request<ContentsResponse>(
        `${contentsUrl(path)}?ref=${REPO.branch}`
      );
      return {
        text: file.encoding === 'base64' ? fromBase64(file.content) : file.content,
        sha: file.sha,
      };
    } catch (error) {
      if (error instanceof GitHubError && error.status === 404) return null;
      throw error;
    }
  }

  async fetchChannelVideos(): Promise<ChannelVideo[]> {
    const file = await this.read(STATS_FILES.stats);
    if (!file) return [];
    return parseChannelVideos(file.text);
  }

  async fetchHiddenVideos(): Promise<HiddenVideosFile> {
    const file = await this.read(STATS_FILES.hidden);
    // Le fichier peut ne pas exister encore : on le créera au premier
    // enregistrement, sans `sha`.
    if (!file) return { entries: [] };
    return { entries: parseHiddenVideos(file.text), sha: file.sha };
  }

  async saveHiddenVideos(entries: HiddenVideo[], sha?: string): Promise<void> {
    const message =
      entries.length === 0
        ? 'data(stats): clear hidden videos'
        : `data(stats): hide ${entries.length} video${entries.length > 1 ? 's' : ''}`;

    await this.client.request(contentsUrl(STATS_FILES.hidden), {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: toBase64(serializeHiddenVideos(entries)),
        branch: REPO.branch,
        ...(sha ? { sha } : {}),
      }),
    });
  }
}
