/**
 * Parse/sérialise le frontmatter dans le sous-ensemble YAML que comprend
 * `src/utils/markdownLoader.ts` côté site. Toute évolution ici doit rester
 * lisible par ce parser : scalaires, listes de scalaires, un seul niveau d'objet.
 */

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  body: string;
}

const parseScalar = (raw: string): unknown => {
  const v = raw.replace(/^"(.*)"$/, '$1');
  if (v === 'null') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('[') && v.endsWith(']')) {
    try {
      return JSON.parse(v);
    } catch {
      /* valeur libre */
    }
  }
  const num = Number(v);
  return Number.isNaN(num) || v === '' ? v : num;
};

export const parseMarkdown = (raw: string): ParsedMarkdown => {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const [, block, body] = match;
  const frontmatter: Record<string, unknown> = {};
  let currentKey = '';
  let isArray = false;
  let isObject = false;

  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const indented = line.startsWith('  ') || line.startsWith('\t');

    if (indented && trimmed.startsWith('- ') && currentKey) {
      if (!isArray) {
        isArray = true;
        isObject = false;
        frontmatter[currentKey] = [];
      }
      (frontmatter[currentKey] as unknown[]).push(parseScalar(trimmed.slice(2)));
    } else if (indented && trimmed.includes(':') && currentKey) {
      if (!isObject) {
        isObject = true;
        isArray = false;
        frontmatter[currentKey] = {};
      }
      const idx = trimmed.indexOf(':');
      (frontmatter[currentKey] as Record<string, unknown>)[trimmed.slice(0, idx).trim()] = parseScalar(
        trimmed.slice(idx + 1).trim()
      );
    } else if (!indented && trimmed.includes(':')) {
      const idx = trimmed.indexOf(':');
      currentKey = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      isArray = false;
      isObject = false;
      frontmatter[currentKey] = value === '' ? null : parseScalar(value);
    }
  }

  return { frontmatter, body: body.trim() };
};

/** Une valeur scalaire ne doit jamais contenir de saut de ligne : le parser du site est ligne à ligne. */
const oneLine = (value: string): string => value.replace(/\s*\n\s*/g, ' ').trim();

const serializeScalar = (value: unknown): string => {
  if (value === null) return 'null';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  return `"${oneLine(String(value))}"`;
};

export type FrontmatterValue = string | number | boolean | null | string[] | Record<string, unknown>;

/**
 * Sérialise dans l'ordre fourni. Les entrées `undefined`, chaînes vides et
 * tableaux vides sont omises pour rester fidèle au style des fiches existantes.
 */
export const serializeFrontmatter = (entries: [string, FrontmatterValue | undefined][]): string => {
  const lines: string[] = [];

  for (const [key, value] of entries) {
    if (value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;

    if (Array.isArray(value)) {
      const items = value.map((v) => oneLine(String(v))).filter(Boolean);
      if (items.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of items) lines.push(`  - "${item}"`);
      continue;
    }

    if (value !== null && typeof value === 'object') {
      const pairs = Object.entries(value);
      if (pairs.length === 0) continue;
      lines.push(`${key}:`);
      for (const [k, v] of pairs) lines.push(`  ${k}: ${serializeScalar(v)}`);
      continue;
    }

    lines.push(`${key}: ${serializeScalar(value)}`);
  }

  return lines.join('\n');
};

export const buildMarkdown = (
  entries: [string, FrontmatterValue | undefined][],
  body: string
): string => {
  const fm = serializeFrontmatter(entries);
  const trimmedBody = body.trim();
  return trimmedBody ? `---\n${fm}\n---\n\n${trimmedBody}\n` : `---\n${fm}\n---\n`;
};
