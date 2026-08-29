import React, { useMemo } from 'react';
import { FileText, Package, ShoppingCart, Tags, ThumbsDown, ThumbsUp, Ticket } from 'lucide-react';
import type { ContentFile, ProductDraft } from '../../domain/content/entities/ContentItem';
import { emptyProduct } from '../../domain/content/entities/ContentItem';
import { fileToProductDraft } from '../../domain/content/services/mappers';
import type { SuggestionSet } from '../../domain/content/services/suggestions';
import type { GitHubContentRepository } from '../../infrastructure/content/GitHubContentRepository';
import { todayIso } from '../../shared/date';
import { EditorShell } from '../components/EditorShell';
import { ImageField } from '../components/ImageField';
import { ListEditor } from '../components/ListEditor';
import { TagCombobox } from '../components/TagCombobox';
import { VideoCodeField } from '../components/VideoCodeField';
import { Button, Card, Field, Input, SectionTitle, Textarea } from '../components/ui/primitives';
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

const validateProduct = (draft: ProductDraft): string[] => {
  const errors: string[] = [];
  if (!draft.title.trim()) errors.push('Le nom du produit est obligatoire');
  if (!draft.image.trim()) errors.push("L'image est obligatoire");
  if (!draft.description.trim()) errors.push('La description est obligatoire');
  if (!draft.category.trim()) errors.push('La catégorie est obligatoire');
  if (draft.price === '' || Number(draft.price) <= 0) errors.push('Le prix doit être renseigné');
  if (!draft.pubDate) errors.push('La date de test est obligatoire');
  if (draft.buyLinks.length === 0) errors.push("Ajoute au moins un lien d'achat");
  if (draft.pros.length === 0) errors.push('Ajoute au moins un point positif');
  if (!draft.verdict.trim()) errors.push('Le verdict est obligatoire');
  if (draft.tags.length === 0) errors.push('Ajoute au moins un tag');
  if (draft.promoCode) {
    if (!draft.promoCode.code.trim()) errors.push('Le code promo est vide');
    if (!draft.promoCode.platform.trim()) errors.push('La plateforme du code promo est vide');
  }
  return errors;
};

const numberOrEmpty = (raw: string): number | '' => (raw === '' ? '' : Number(raw));

export const ProductEditorPage: React.FC<Props> = ({
  mode,
  source,
  videos,
  suggestions,
  takenSlugs,
  repository,
  onBack,
  onSaved,
}) => {
  const initial = useMemo<ProductDraft>(() => {
    if (!source) return emptyProduct(todayIso());
    const draft = fileToProductDraft(source);
    if (mode === 'duplicate') {
      // On garde la structure (tags, protocoles, catégorie) et on repart à neuf sur l'identité.
      return {
        ...draft,
        slug: '',
        title: `${draft.title} (copie)`,
        image: '',
        videoCode: '',
        buyLinks: [],
        promoCode: null,
        pubDate: todayIso(),
      };
    }
    return draft;
  }, [source, mode]);

  const editor = useDraftEditor<ProductDraft>({
    kind: 'product',
    mode,
    initial,
    takenSlugs,
    repository,
    validate: validateProduct,
    onSaved,
  });

  const { draft, setField, setSlug } = editor;

  const linkedVideo = useMemo(
    () => videos.find((v) => v.frontmatter.code === draft.videoCode),
    [videos, draft.videoCode]
  );

  return (
    <EditorShell
      title={
        mode === 'edit'
          ? `Modifier : ${initial.title}`
          : mode === 'duplicate'
          ? 'Nouveau produit (copie)'
          : 'Nouveau produit'
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
        <SectionTitle icon={<Package size={15} />}>Identité</SectionTitle>
        <div className="space-y-5 p-5">
          <Field label="Nom du produit" required>
            <Input
              value={draft.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Sonnette Aqara G4"
              autoFocus
            />
          </Field>

          <Field
            label="Slug"
            hint={
              mode === 'edit'
                ? "Renommer le slug change l'URL publique de la fiche"
                : 'Généré depuis le nom, modifiable'
            }
          >
            <Input
              value={draft.slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-xs"
              spellCheck={false}
            />
          </Field>

          <ImageField value={draft.image} onChange={(url) => setField('image', url)} />

          <Field label="Description" required hint="Une à deux phrases, affichées sur la carte produit">
            <Textarea
              value={draft.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Catégorie" required>
              <Input
                list="product-categories"
                value={draft.category}
                onChange={(e) => setField('category', e.target.value)}
              />
              <datalist id="product-categories">
                {suggestions.categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </Field>
            <Field label="Prix (€)" required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.price}
                onChange={(e) => setField('price', numberOrEmpty(e.target.value))}
              />
            </Field>
            <Field label="Date du test" required>
              <Input
                type="date"
                value={draft.pubDate}
                onChange={(e) => setField('pubDate', e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<Tags size={15} />}>Classement et compatibilité</SectionTitle>
        <div className="space-y-5 p-5">
          <Field label="Tags" required hint="Type de produit, usage — alimente les filtres du site">
            <TagCombobox
              value={draft.tags}
              onChange={(tags) => setField('tags', tags)}
              suggestions={suggestions.productTags}
              placeholder="Sonnette, Caméra..."
            />
          </Field>
          <Field label="Protocoles" hint="Zigbee, Wi-Fi, Matter, Bluetooth...">
            <TagCombobox
              value={draft.protocols}
              onChange={(protocols) => setField('protocols', protocols)}
              suggestions={suggestions.protocols}
              placeholder="Zigbee, Wi-Fi..."
            />
          </Field>
          <Field label="Compatible avec" hint="Écosystèmes et logiciels supportés">
            <TagCombobox
              value={draft.compatible}
              onChange={(compatible) => setField('compatible', compatible)}
              suggestions={suggestions.compatible}
              placeholder="Home Assistant, HomeKit..."
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<ShoppingCart size={15} />}>Achat</SectionTitle>
        <div className="space-y-5 p-5">
          <Field
            label="Liens d'achat"
            hint="Le site route automatiquement Amazon, Domadoo, Geekbuying, Minix, Reolink, Bambu Lab et Meross vers un bouton dédié"
          >
            <ListEditor
              value={draft.buyLinks}
              onChange={(buyLinks) => setField('buyLinks', buyLinks)}
              placeholder="https://www.domadoo.fr/..."
              variant="link"
              addLabel="Ajouter"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Prix promo (€)" hint="Laisse vide s'il n'y a pas de promotion en cours">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.promoPrice === null ? '' : draft.promoPrice}
                onChange={(e) => setField('promoPrice', numberOrEmpty(e.target.value))}
              />
            </Field>
            <Field label="Note (sur 5)" hint="Optionnel">
              <Input
                type="number"
                step="0.5"
                min="0"
                max="5"
                value={draft.rating}
                onChange={(e) => setField('rating', numberOrEmpty(e.target.value))}
              />
            </Field>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Ticket size={15} />
                Code promo
              </span>
              <Button
                type="button"
                variant={draft.promoCode ? 'ghost' : 'secondary'}
                onClick={() =>
                  setField(
                    'promoCode',
                    draft.promoCode ? null : { code: '', percent: 5, expiresAt: null, platform: '' }
                  )
                }
              >
                {draft.promoCode ? 'Retirer' : 'Ajouter un code'}
              </Button>
            </div>

            {draft.promoCode && (
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <Field label="Code" className="sm:col-span-1">
                  <Input
                    value={draft.promoCode.code}
                    onChange={(e) =>
                      setField('promoCode', { ...draft.promoCode!, code: e.target.value })
                    }
                    placeholder="AYMERIC"
                  />
                </Field>
                <Field label="Remise (%)">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={draft.promoCode.percent}
                    onChange={(e) =>
                      setField('promoCode', {
                        ...draft.promoCode!,
                        percent: Number(e.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="Plateforme">
                  <Input
                    list="promo-platforms"
                    value={draft.promoCode.platform}
                    onChange={(e) =>
                      setField('promoCode', { ...draft.promoCode!, platform: e.target.value })
                    }
                    placeholder="Domadoo"
                  />
                  <datalist id="promo-platforms">
                    {suggestions.promoPlatforms.map((platform) => (
                      <option key={platform} value={platform} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Expire le" hint="Vide = sans limite">
                  <Input
                    type="date"
                    value={draft.promoCode.expiresAt ?? ''}
                    onChange={(e) =>
                      setField('promoCode', {
                        ...draft.promoCode!,
                        expiresAt: e.target.value || null,
                      })
                    }
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<ThumbsUp size={15} />}>Test</SectionTitle>
        <div className="space-y-5 p-5">
          <VideoCodeField
            value={draft.videoCode}
            onChange={(code) => setField('videoCode', code)}
            videos={videos}
            label="Vidéo du test"
            hint="Choisis la vidéo correspondante parmi celles du site"
          />
          {linkedVideo && (
            <p className="-mt-2 text-xs text-slate-500">
              Liée à « {String(linkedVideo.frontmatter.title)} ».
            </p>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Points positifs" required>
              <ListEditor
                value={draft.pros}
                onChange={(pros) => setField('pros', pros)}
                placeholder="Bonne qualité d'image"
              />
            </Field>
            <Field label="Points négatifs">
              <div className="space-y-2">
                <ListEditor
                  value={draft.cons}
                  onChange={(cons) => setField('cons', cons)}
                  placeholder="Cloud obligatoire"
                />
                <p className="flex items-center gap-1.5 pl-[26px] text-xs text-slate-400">
                  <ThumbsDown size={12} />
                  Affichés en rouge sur la fiche
                </p>
              </div>
            </Field>
          </div>

          <Field label="Verdict" required hint="La conclusion affichée en bas de fiche">
            <Textarea
              value={draft.verdict}
              onChange={(e) => setField('verdict', e.target.value)}
              rows={3}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<FileText size={15} />}>Contenu additionnel</SectionTitle>
        <div className="p-5">
          <Field label="Markdown" hint="Optionnel : liens, précisions, rappel du code promo">
            <Textarea
              value={draft.body}
              onChange={(e) => setField('body', e.target.value)}
              rows={8}
              className="font-mono text-xs"
              spellCheck={false}
            />
          </Field>
        </div>
      </Card>
    </EditorShell>
  );
};
