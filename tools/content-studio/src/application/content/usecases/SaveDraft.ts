import type { ContentKind, ProductDraft, VideoDraft } from '../../../domain/content/entities/ContentItem';
import {
  productDraftToMarkdown,
  videoDraftToMarkdown,
} from '../../../domain/content/services/mappers';
import type { PendingChange } from '../../../domain/changes/entities/PendingChange';
import { CONTENT_DIRS } from '../../../shared/config';
import type { GitHubContentRepository } from '../../../infrastructure/content/GitHubContentRepository';

export class SlugConflictError extends Error {
  constructor(slug: string) {
    super(`Une fiche « ${slug} » existe déjà sur GitHub. Change le slug ou ouvre la fiche existante.`);
    this.name = 'SlugConflictError';
  }
}

export const pathFor = (kind: ContentKind, slug: string): string =>
  `${kind === 'video' ? CONTENT_DIRS.video : CONTENT_DIRS.product}/${slug}.md`;

export const renderDraft = (kind: ContentKind, draft: VideoDraft | ProductDraft): string =>
  kind === 'video'
    ? videoDraftToMarkdown(draft as VideoDraft)
    : productDraftToMarkdown(draft as ProductDraft);

export class SaveDraft {
  constructor(private readonly remote: GitHubContentRepository) {}

  /**
   * Prépare la modification sans commiter : elle rejoint les modifications en
   * attente, commitées ensemble plus tard. Le SHA distant relu ici devient le
   * `baseSha`, revérifié au moment du commit.
   */
  async execute(input: {
    kind: ContentKind;
    draft: VideoDraft | ProductDraft;
    isNew: boolean;
    /** Slug d'origine si la fiche a été renommée. */
    originalSlug?: string;
  }): Promise<PendingChange> {
    const { kind, draft, isNew } = input;
    const path = pathFor(kind, draft.slug);
    const content = renderDraft(kind, draft);
    const existing = await this.remote.fetchRemote(path);

    if (isNew && existing) throw new SlugConflictError(draft.slug);

    // Sans SHA distant (fiche neuve, renommée, ou disparue de main) le commit crée le fichier.
    const action = isNew || !existing ? 'add' : 'update';
    return {
      path,
      content,
      scope: kind,
      message: `content(${kind}): ${action} ${draft.slug}`,
      baseSha: existing?.sha,
      stagedAt: new Date().toISOString(),
    };
  }

  /** Vérifie la disponibilité d'un slug côté GitHub avant sauvegarde. */
  async isSlugFree(kind: ContentKind, slug: string): Promise<boolean> {
    const existing = await this.remote.fetchRemote(pathFor(kind, slug));
    return existing === null;
  }
}
