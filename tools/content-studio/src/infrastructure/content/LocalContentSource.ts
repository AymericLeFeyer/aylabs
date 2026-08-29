import type { ContentFile, ContentKind } from '../../domain/content/entities/ContentItem';
import { parseMarkdown } from '../../domain/content/services/frontmatter';

/**
 * Lecture instantanée des fiches du site depuis le dépôt local.
 * Sert d'affichage immédiat ; la fraîcheur est vérifiée ensuite contre GitHub.
 */
const modules = import.meta.glob('../../../../../src/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const kindFromPath = (path: string): ContentKind | null => {
  if (path.includes('/content/videos/')) return 'video';
  if (path.includes('/content/products/')) return 'product';
  return null;
};

/**
 * Le dépôt stocke du LF, mais `core.autocrlf` livre du CRLF sur disque sous Windows.
 * Sans cette normalisation, le SHA calculé localement ne coïnciderait jamais avec
 * celui de l'arbre GitHub et chaque fiche serait vue comme divergente.
 */
export const toLf = (content: string): string => content.replace(/\r\n/g, '\n');

export const loadLocalContent = (): { files: ContentFile[]; raw: Map<string, string> } => {
  const files: ContentFile[] = [];
  const raw = new Map<string, string>();

  for (const [modulePath, rawContent] of Object.entries(modules)) {
    const kind = kindFromPath(modulePath);
    if (!kind) continue;
    const content = toLf(rawContent);
    const slug = modulePath.split('/').pop()?.replace(/\.md$/, '') ?? '';
    const repoPath = `src/content/${kind === 'video' ? 'videos' : 'products'}/${slug}.md`;
    const parsed = parseMarkdown(content);
    files.push({ kind, slug, path: repoPath, frontmatter: parsed.frontmatter, body: parsed.body });
    // Contenu disque brut : la comparaison de SHA teste les deux styles de fin de ligne.
    raw.set(repoPath, rawContent);
  }

  return { files, raw };
};
