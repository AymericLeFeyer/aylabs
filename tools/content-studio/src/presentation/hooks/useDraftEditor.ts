import { useCallback, useMemo, useRef, useState } from 'react';
import { pathFor, renderDraft, SaveDraft } from '../../application/content/usecases/SaveDraft';
import type { ContentKind, ProductDraft, VideoDraft } from '../../domain/content/entities/ContentItem';
import { slugify, uniqueSlug } from '../../domain/content/services/slug';
import type { GitHubContentRepository } from '../../infrastructure/content/GitHubContentRepository';
import type { SaveState } from '../components/EditorShell';

export type EditorMode = 'create' | 'duplicate' | 'edit';

interface Options<T extends VideoDraft | ProductDraft> {
  kind: ContentKind;
  mode: EditorMode;
  initial: T;
  /** Slugs déjà utilisés, pour proposer un slug libre et signaler les collisions. */
  takenSlugs: Set<string>;
  repository: GitHubContentRepository;
  validate: (draft: T) => string[];
  onSaved: (slug: string) => void;
}

export const useDraftEditor = <T extends VideoDraft | ProductDraft>({
  kind,
  mode,
  initial,
  takenSlugs,
  repository,
  validate,
  onSaved,
}: Options<T>) => {
  const [draft, setDraft] = useState<T>(initial);
  const [saveState, setSaveState] = useState<SaveState>({ status: 'idle' });
  const initialRef = useRef(JSON.stringify(initial));
  // En édition, le slug est figé par l'utilisateur ; en création il suit le titre.
  const slugTouched = useRef(mode === 'edit' || Boolean(initial.slug));

  const saver = useMemo(() => new SaveDraft(repository), [repository]);

  const setField = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setDraft((current) => {
        const next = { ...current, [key]: value };
        if (key === 'title' && !slugTouched.current) {
          const base = slugify(String(value));
          next.slug = base ? uniqueSlug(base, takenSlugs) : '';
        }
        return next;
      });
      setSaveState((s) => (s.status === 'saved' ? { status: 'idle' } : s));
    },
    [takenSlugs]
  );

  const setSlug = useCallback((value: string) => {
    slugTouched.current = true;
    setDraft((current) => ({ ...current, slug: slugify(value) }));
  }, []);

  const errors = useMemo(() => {
    const list = validate(draft);
    if (!draft.slug) list.push('Le slug ne peut pas être vide');
    else if (mode !== 'edit' && takenSlugs.has(draft.slug))
      list.push(`Le slug « ${draft.slug} » est déjà pris`);
    return list;
  }, [draft, validate, takenSlugs, mode]);

  const markdown = useMemo(() => renderDraft(kind, draft), [kind, draft]);
  const path = useMemo(() => pathFor(kind, draft.slug || 'nouvelle-fiche'), [kind, draft.slug]);
  const dirty = JSON.stringify(draft) !== initialRef.current;

  const save = useCallback(async () => {
    if (errors.length > 0) return;
    setSaveState({ status: 'saving' });
    try {
      const result = await saver.execute({
        kind,
        draft,
        isNew: mode !== 'edit',
        originalSlug: initial.slug,
      });
      initialRef.current = JSON.stringify(draft);
      setSaveState({ status: 'saved', commitUrl: result.commitUrl });
      onSaved(draft.slug);
    } catch (e) {
      setSaveState({
        status: 'error',
        message: e instanceof Error ? e.message : 'Le commit a échoué',
      });
    }
  }, [errors, saver, kind, draft, mode, initial.slug, onSaved]);

  return { draft, setDraft, setField, setSlug, errors, markdown, path, dirty, saveState, save };
};
