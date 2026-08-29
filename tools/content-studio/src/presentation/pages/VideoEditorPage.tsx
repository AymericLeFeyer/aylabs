import React, { useCallback, useMemo } from 'react';
import { FileText, Tags, Video } from 'lucide-react';
import type { ContentFile, VideoDraft } from '../../domain/content/entities/ContentItem';
import { emptyVideo } from '../../domain/content/entities/ContentItem';
import { fileToVideoDraft } from '../../domain/content/services/mappers';
import type { SuggestionSet } from '../../domain/content/services/suggestions';
import type { GitHubContentRepository } from '../../infrastructure/content/GitHubContentRepository';
import { normalizeDuration, todayIso } from '../../shared/date';
import { EditorShell } from '../components/EditorShell';
import { TagCombobox } from '../components/TagCombobox';
import { VideoCodeField } from '../components/VideoCodeField';
import { Card, Field, Input, SectionTitle, Textarea } from '../components/ui/primitives';
import { useDraftEditor, type EditorMode } from '../hooks/useDraftEditor';

interface Props {
  mode: EditorMode;
  source?: ContentFile;
  videos: ContentFile[];
  suggestions: SuggestionSet;
  takenSlugs: Set<string>;
  repository: GitHubContentRepository;
  onBack: () => void;
  onSaved: (slug: string) => void;
}

const validateVideo = (draft: VideoDraft): string[] => {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push('Le titre est obligatoire');
  if (!draft.description.trim()) errors.push('La description est obligatoire');
  if (!draft.code.trim()) errors.push('Le code YouTube est obligatoire');
  if (!draft.pubDate) errors.push('La date de publication est obligatoire');
  if (!draft.duration.trim()) errors.push('La durée est obligatoire');
  if (draft.tags.length === 0) errors.push('Ajoute au moins un tag');
  return errors;
};

export const VideoEditorPage: React.FC<Props> = ({
  mode,
  source,
  videos,
  suggestions,
  takenSlugs,
  repository,
  onBack,
  onSaved,
}) => {
  const initial = useMemo<VideoDraft>(() => {
    if (!source) return emptyVideo(todayIso());
    const draft = fileToVideoDraft(source);
    // Une duplication repart d'une fiche vierge côté identité : ni slug, ni vidéo, ni date héritée.
    if (mode === 'duplicate') {
      return { ...draft, slug: '', title: `${draft.title} (copie)`, code: '', pubDate: todayIso() };
    }
    return draft;
  }, [source, mode]);

  const editor = useDraftEditor<VideoDraft>({
    kind: 'video',
    mode,
    initial,
    takenSlugs,
    repository,
    validate: validateVideo,
    onSaved,
  });

  const { draft, setField, setSlug } = editor;

  const duplicateCode = useMemo(
    () =>
      draft.code
        ? videos.find((v) => v.frontmatter.code === draft.code && v.slug !== initial.slug)
        : undefined,
    [videos, draft.code, initial.slug]
  );

  const handleDurationBlur = useCallback(() => {
    const normalized = normalizeDuration(draft.duration);
    if (normalized !== draft.duration) setField('duration', normalized);
  }, [draft.duration, setField]);

  return (
    <EditorShell
      title={
        mode === 'edit' ? `Modifier : ${initial.title}` : mode === 'duplicate' ? 'Nouvelle vidéo (copie)' : 'Nouvelle vidéo'
      }
      subtitle={draft.title || 'Sans titre'}
      path={editor.path}
      markdown={editor.markdown}
      errors={editor.errors}
      saveState={editor.saveState}
      dirty={editor.dirty}
      onBack={onBack}
      onSave={editor.save}
    >
      <Card>
        <SectionTitle icon={<Video size={15} />}>Vidéo</SectionTitle>
        <div className="space-y-5 p-5">
          <Field label="Titre" required hint="Repris tel quel sur la page vidéo et dans le SEO">
            <Input
              value={draft.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Sauvegarder son HOME ASSISTANT sur GOOGLE DRIVE"
              autoFocus
            />
          </Field>

          <Field
            label="Slug"
            hint={
              mode === 'edit'
                ? "Renommer le slug crée une nouvelle fiche : l'ancienne URL ne redirige pas"
                : 'Généré depuis le titre, modifiable'
            }
          >
            <Input
              value={draft.slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-xs"
              spellCheck={false}
            />
          </Field>

          <Field label="Description" required hint="Deux ou trois phrases, affichées sous le titre">
            <Textarea
              value={draft.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
            />
          </Field>

          <VideoCodeField
            value={draft.code}
            onChange={(code) => setField('code', code)}
            videos={videos}
            hint={
              duplicateCode
                ? undefined
                : "Identifiant de la vidéo YouTube, ou colle l'URL complète"
            }
          />
          {duplicateCode && (
            <p className="-mt-2 text-xs text-amber-700">
              Ce code est déjà utilisé par la fiche « {String(duplicateCode.frontmatter.title)} ».
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date de publication" required>
              <Input
                type="date"
                value={draft.pubDate}
                onChange={(e) => setField('pubDate', e.target.value)}
              />
            </Field>
            <Field label="Durée" required hint="Format mm:ss, normalisé automatiquement">
              <Input
                value={draft.duration}
                onChange={(e) => setField('duration', e.target.value)}
                onBlur={handleDurationBlur}
                placeholder="10:18"
                className="font-mono"
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Tags size={15} />}>Classement</SectionTitle>
        <div className="p-5">
          <Field
            label="Tags"
            required
            hint="Ces tags alimentent les filtres du site — réutilise les valeurs existantes"
          >
            <TagCombobox
              value={draft.tags}
              onChange={(tags) => setField('tags', tags)}
              suggestions={suggestions.videoTags}
              placeholder="Domotique, Homelab..."
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<FileText size={15} />}>Contenu de la page</SectionTitle>
        <div className="p-5">
          <Field
            label="Markdown"
            hint="Optionnel : liens, chapitrage, configuration YAML... Rendu sous la vidéo."
          >
            <Textarea
              value={draft.body}
              onChange={(e) => setField('body', e.target.value)}
              rows={12}
              className="font-mono text-xs"
              spellCheck={false}
            />
          </Field>
        </div>
      </Card>
    </EditorShell>
  );
};
