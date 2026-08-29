import type { ContentFile, ContentKind } from '../../../domain/content/entities/ContentItem';
import { parseMarkdown } from '../../../domain/content/services/frontmatter';
import { gitBlobSha } from '../../../domain/content/services/gitSha';
import { loadLocalContent, toLf } from '../../../infrastructure/content/LocalContentSource';
import type { GitHubContentRepository } from '../../../infrastructure/content/GitHubContentRepository';

export interface Catalog {
  files: ContentFile[];
  /** Fiches présentes sur GitHub dont la copie locale diffère (ou est absente). */
  outOfSync: string[];
  syncedWithGitHub: boolean;
}

const kindOf = (path: string): ContentKind => (path.includes('/videos/') ? 'video' : 'product');

/**
 * Charge le catalogue local (instantané), puis le réconcilie avec l'arbre GitHub :
 * seuls les fichiers dont le SHA diffère sont téléchargés.
 */
export class LoadCatalog {
  constructor(private readonly remote: GitHubContentRepository) {}

  local(): Catalog {
    return { files: loadLocalContent().files, outOfSync: [], syncedWithGitHub: false };
  }

  async synced(): Promise<Catalog> {
    const { files, raw } = loadLocalContent();
    const tree = await this.remote.fetchTree();

    const byPath = new Map(files.map((f) => [f.path, f]));
    const outOfSync: string[] = [];
    const toFetch: { path: string; sha: string }[] = [];

    for (const [path, sha] of tree) {
      const localRaw = raw.get(path);
      if (localRaw === undefined) {
        toFetch.push({ path, sha });
        outOfSync.push(path);
        continue;
      }
      // Un blob du dépôt peut être en LF (cas général) ou en CRLF : les deux comptent comme identiques.
      const [asIs, asLf] = await Promise.all([gitBlobSha(localRaw), gitBlobSha(toLf(localRaw))]);
      if (asIs !== sha && asLf !== sha) {
        toFetch.push({ path, sha });
        outOfSync.push(path);
      }
    }

    // Fiches supprimées sur GitHub mais encore présentes localement
    for (const path of byPath.keys()) {
      if (!tree.has(path)) {
        byPath.delete(path);
        outOfSync.push(path);
      }
    }

    const batches = chunk(toFetch, 8);
    for (const batch of batches) {
      const contents = await Promise.all(batch.map((entry) => this.remote.fetchBlob(entry.sha)));
      batch.forEach((entry, i) => {
        const parsed = parseMarkdown(contents[i]);
        const slug = entry.path.split('/').pop()!.replace(/\.md$/, '');
        byPath.set(entry.path, {
          kind: kindOf(entry.path),
          slug,
          path: entry.path,
          frontmatter: parsed.frontmatter,
          body: parsed.body,
          localSha: entry.sha,
        });
      });
    }

    return { files: [...byPath.values()], outOfSync, syncedWithGitHub: true };
  }
}

const chunk = <T,>(items: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};
