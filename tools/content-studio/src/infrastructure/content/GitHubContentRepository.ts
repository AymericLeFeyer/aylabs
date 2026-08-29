import type {
  ContentWriteRepository,
  RemoteFileState,
  SaveResult,
} from '../../domain/content/repositories/ContentRepository';
import { CONTENT_DIRS, REPO } from '../../shared/config';
import { fromBase64, GitHubApiClient, GitHubError, toBase64 } from '../github/GitHubApiClient';

interface TreeEntry {
  path: string;
  type: string;
  sha: string;
}

export class GitHubContentRepository implements ContentWriteRepository {
  private readonly client = new GitHubApiClient();

  /** Un seul appel renvoie l'arbre complet : path -> sha de blob. */
  async fetchTree(): Promise<Map<string, string>> {
    const tree = await this.client.request<{ tree: TreeEntry[] }>(
      `/repos/${REPO.owner}/${REPO.name}/git/trees/${REPO.branch}?recursive=1`
    );
    const dirs = Object.values(CONTENT_DIRS);
    const map = new Map<string, string>();
    for (const entry of tree.tree) {
      if (entry.type !== 'blob' || !entry.path.endsWith('.md')) continue;
      if (!dirs.some((dir) => entry.path.startsWith(`${dir}/`))) continue;
      map.set(entry.path, entry.sha);
    }
    return map;
  }

  async fetchRemote(path: string): Promise<RemoteFileState | null> {
    try {
      const file = await this.client.request<{ sha: string; content: string; encoding: string }>(
        `/repos/${REPO.owner}/${REPO.name}/contents/${encodeURI(path)}?ref=${REPO.branch}`
      );
      return {
        path,
        sha: file.sha,
        content: file.encoding === 'base64' ? fromBase64(file.content) : file.content,
      };
    } catch (error) {
      if (error instanceof GitHubError && error.status === 404) return null;
      throw error;
    }
  }

  async fetchBlob(sha: string): Promise<string> {
    const blob = await this.client.request<{ content: string; encoding: string }>(
      `/repos/${REPO.owner}/${REPO.name}/git/blobs/${sha}`
    );
    return blob.encoding === 'base64' ? fromBase64(blob.content) : blob.content;
  }

  async commit({
    path,
    content,
    message,
    sha,
  }: {
    path: string;
    content: string;
    message: string;
    sha?: string;
  }): Promise<SaveResult> {
    const result = await this.client.request<{
      commit: { sha: string; html_url: string };
    }>(`/repos/${REPO.owner}/${REPO.name}/contents/${encodeURI(path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: toBase64(content),
        branch: REPO.branch,
        ...(sha ? { sha } : {}),
      }),
    });

    return { path, commitSha: result.commit.sha, commitUrl: result.commit.html_url };
  }
}
