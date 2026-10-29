import type { CommitResult } from '../../domain/changes/entities/PendingChange';
import type { CommitRepository } from '../../domain/changes/repositories/CommitRepository';
import { REPO } from '../../shared/config';
import { GitHubApiClient, GitHubError } from '../github/GitHubApiClient';

const repoUrl = () => `/repos/${REPO.owner}/${REPO.name}`;

/**
 * Commit multi-fichiers via la Git Data API : l'API « contents » n'écrit qu'un
 * fichier par commit, donc un déploiement par fichier.
 */
export class GitHubCommitRepository implements CommitRepository {
  private readonly client = new GitHubApiClient();

  async fetchBlobSha(path: string): Promise<string | null> {
    try {
      const file = await this.client.request<{ sha: string }>(
        `${repoUrl()}/contents/${encodeURI(path)}?ref=${REPO.branch}`
      );
      return file.sha;
    } catch (error) {
      if (error instanceof GitHubError && error.status === 404) return null;
      throw error;
    }
  }

  async commitFiles({
    files,
    message,
  }: {
    files: { path: string; content: string }[];
    message: string;
  }): Promise<CommitResult> {
    const ref = await this.client.request<{ object: { sha: string } }>(
      `${repoUrl()}/git/ref/heads/${REPO.branch}`
    );
    const head = ref.object.sha;
    const parent = await this.client.request<{ tree: { sha: string } }>(
      `${repoUrl()}/git/commits/${head}`
    );

    // `content` en ligne : GitHub crée les blobs lui-même, pas d'appel par fichier.
    const tree = await this.client.request<{ sha: string }>(`${repoUrl()}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: parent.tree.sha,
        tree: files.map((file) => ({
          path: file.path,
          mode: '100644',
          type: 'blob',
          content: file.content,
        })),
      }),
    });

    const commit = await this.client.request<{ sha: string; html_url: string }>(
      `${repoUrl()}/git/commits`,
      {
        method: 'POST',
        body: JSON.stringify({ message, tree: tree.sha, parents: [head] }),
      }
    );

    try {
      // Sans `force` : refusé si la branche a bougé depuis la lecture de `head`.
      await this.client.request(`${repoUrl()}/git/refs/heads/${REPO.branch}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
    } catch (error) {
      if (error instanceof GitHubError && error.status === 422) {
        throw new GitHubError(`La branche ${REPO.branch} a bougé pendant le commit : relance-le.`, 422);
      }
      throw error;
    }

    return { commitSha: commit.sha, commitUrl: commit.html_url };
  }
}
