/**
 * Garde-fou : chaque fiche existante est parsée, re-sérialisée par le Studio,
 * puis relue. Les frontmatters doivent être équivalents, sinon l'outil
 * dégraderait le contenu du site au premier enregistrement.
 *
 * Exécution : npm run check
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseMarkdown } from '../src/domain/content/services/frontmatter';
import {
  fileToProductDraft,
  fileToVideoDraft,
  productDraftToMarkdown,
  videoDraftToMarkdown,
} from '../src/domain/content/services/mappers';
import type { ContentFile, ContentKind } from '../src/domain/content/entities/ContentItem';

// Le script est lancé depuis tools/content-studio (npm run check)
const ROOT = join(process.cwd(), '../..');

const load = (kind: ContentKind): ContentFile[] => {
  const dir = join(ROOT, 'src/content', kind === 'video' ? 'videos' : 'products');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const parsed = parseMarkdown(readFileSync(join(dir, file), 'utf8'));
      return {
        kind,
        slug: file.replace(/\.md$/, ''),
        path: `src/content/${kind === 'video' ? 'videos' : 'products'}/${file}`,
        frontmatter: parsed.frontmatter,
        body: parsed.body,
      };
    });
};

const LIST_KEYS = ['tags', 'protocols', 'compatible', 'buyLinks', 'pros', 'cons'];

/**
 * Normalisations assumées du Studio :
 *  - pubDate est reformaté au format canonique "Nov 29 2025" ;
 *  - les espaces en fin de valeur sont supprimés ;
 *  - la clé `slug` en frontmatter est abandonnée (le site dérive le slug du nom de fichier).
 */
const IGNORED_KEYS = ['pubDate', 'slug'];

const trimDeep = (value: unknown): unknown =>
  typeof value === 'string'
    ? value.trim()
    : Array.isArray(value)
    ? value.map(trimDeep)
    : value;

interface Diff {
  slug: string;
  key: string;
  before: unknown;
  after: unknown;
}

const compare = (slug: string, before: Record<string, unknown>, after: Record<string, unknown>): Diff[] => {
  const diffs: Diff[] = [];
  for (const key of Object.keys(before)) {
    const a = before[key];
    const b = after[key];
    if (IGNORED_KEYS.includes(key)) continue;
    if (a === null || a === undefined || a === '') continue;
    if (Array.isArray(a) && a.length === 0) continue;

    const normalize = (v: unknown) =>
      trimDeep(LIST_KEYS.includes(key) && !Array.isArray(v) ? [v] : v);

    if (JSON.stringify(normalize(a)) !== JSON.stringify(normalize(b))) {
      diffs.push({ slug, key, before: a, after: b });
    }
  }
  return diffs;
};

let failures = 0;
let checked = 0;

for (const kind of ['video', 'product'] as ContentKind[]) {
  for (const file of load(kind)) {
    checked += 1;
    const draft = kind === 'video' ? fileToVideoDraft(file) : fileToProductDraft(file);
    const rendered =
      kind === 'video'
        ? videoDraftToMarkdown(draft as never)
        : productDraftToMarkdown(draft as never);
    const reparsed = parseMarkdown(rendered);

    const diffs = compare(file.slug, file.frontmatter, reparsed.frontmatter);
    if (diffs.length > 0) {
      failures += 1;
      console.log(`\n✗ ${kind}/${file.slug}`);
      for (const diff of diffs) {
        console.log(`   ${diff.key}:`);
        console.log(`     avant : ${JSON.stringify(diff.before)}`);
        console.log(`     après : ${JSON.stringify(diff.after)}`);
      }
    }

    if (file.body.trim() !== reparsed.body.trim()) {
      failures += 1;
      console.log(`\n✗ ${kind}/${file.slug} : le corps markdown a été altéré`);
    }
  }
}

console.log(
  failures === 0
    ? `\n✓ ${checked} fiches vérifiées, aucune perte de données au round-trip`
    : `\n${failures} fiche(s) en écart sur ${checked}`
);
process.exit(failures === 0 ? 0 : 1);
