interface MarkdownFile {
  frontmatter: Record<string, any>;
  content: string;
}

export const parseMarkdown = (markdownContent: string): MarkdownFile => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: {},
      content: markdownContent
    };
  }
  
  const [, frontmatterStr, content] = match;
  const frontmatter: Record<string, any> = {};
  
  // Parse YAML-like frontmatter (supports arrays and one level of nested objects)
  const lines = frontmatterStr.split('\n');
  let currentKey = '';
  let isArray = false;
  let isObject = false;

  const parseScalar = (raw: string): any => {
    const v = raw.replace(/^"(.*)"$/, '$1');
    if (v === 'null') return null;
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (v.startsWith('[') && v.endsWith(']')) {
      try { return JSON.parse(v); } catch { /* fall through */ }
    }
    const num = Number(v);
    return isNaN(num) || v === '' ? v : num;
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const isIndented = line.startsWith('  ') || line.startsWith('\t');

    if (isIndented && isObject && currentKey && trimmedLine.includes(':')) {
      // Nested object field
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      if (typeof frontmatter[currentKey] !== 'object' || Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = {};
      }
      frontmatter[currentKey][key] = parseScalar(value);
    } else if (isIndented && isArray && currentKey && trimmedLine.startsWith('- ')) {
      // Array item
      frontmatter[currentKey].push(parseScalar(trimmedLine.substring(2)));
    } else if (!isIndented && trimmedLine.includes(':')) {
      // Top-level key
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      currentKey = key;
      if (value === '') {
        // Will be determined by next indented line
        isArray = false;
        isObject = false;
        frontmatter[key] = null;
      } else {
        isArray = false;
        isObject = false;
        frontmatter[key] = parseScalar(value);
      }
    } else if (isIndented && trimmedLine.startsWith('- ')) {
      // First array item — init array
      if (!isArray) { isArray = true; isObject = false; frontmatter[currentKey] = []; }
      frontmatter[currentKey].push(parseScalar(trimmedLine.substring(2)));
    } else if (isIndented && trimmedLine.includes(':')) {
      // First object field — init object
      if (!isObject) { isObject = true; isArray = false; frontmatter[currentKey] = {}; }
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      frontmatter[currentKey][key] = parseScalar(value);
    }
  }
  
  return {
    frontmatter,
    content: content.trim()
  };
};

// Dynamic content loaders using import.meta.glob
const loadContentFromFiles = async (pattern: string, transform: (data: any, slug: string) => any) => {
  const modules = import.meta.glob('/src/content/**/*.md', { as: 'raw', eager: true });
  const items = [];
  
  for (const [path, content] of Object.entries(modules)) {
    if (path.includes(pattern)) {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const parsed = parseMarkdown(content as string);
      const item = transform(parsed, slug);
      items.push(item);
    }
  }
  
  return items.sort((a, b) => new Date(b.publishedAt || b.pubDate || b.testedDate || 0).getTime() - new Date(a.publishedAt || a.pubDate || a.testedDate || 0).getTime());
};

export const loadTutorials = async () => {
  return loadContentFromFiles('/tutorials/', (parsed, slug) => ({
    id: slug,
    slug,
    title: parsed.frontmatter.title,
    description: parsed.frontmatter.description,
    publishedAt: parsed.frontmatter.pubDate,
    createdAt: parsed.frontmatter.pubDate,
    updatedAt: parsed.frontmatter.pubDate,
    content: parsed.content
  }));
};

export const loadProducts = async () => {
  return loadContentFromFiles('/products/', (parsed, slug) => ({
    id: slug,
    name: parsed.frontmatter.title,
    slug,
    category: parsed.frontmatter.category || 'Domotique',
    image: parsed.frontmatter.image,
    description: parsed.frontmatter.description,
    price: parsed.frontmatter.price || 0,
    rating: parsed.frontmatter.rating || 0,
    testedDate: parsed.frontmatter.pubDate,
    videoUrl: parsed.frontmatter.videoCode ? `https://youtube.com/watch?v=${parsed.frontmatter.videoCode}` : '',
    videoCode: parsed.frontmatter.videoCode,
    amazonLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('amzn.to') || link.includes('amazon')),
    domadooLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('domadoo')),
    geekbuyingLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('geekbuying')),
    minixLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('minix')),
    reolinkLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('reolink')),
    bambuLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('bambu')),
    merossLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('meross')),
    otherLinks: parsed.frontmatter.buyLinks?.filter((link: string) =>
      !link.includes('amzn.to') && !link.includes('amazon') &&
      !link.includes('domadoo') && !link.includes('geekbuying') &&
      !link.includes('minix') && !link.includes('reolink') &&
      !link.includes('bambu') && !link.includes('meross')
    ) || [],
    promoCode: parsed.frontmatter.promoCode || null,
    pros: parsed.frontmatter.pros || [],
    cons: parsed.frontmatter.cons || [],
    verdict: parsed.frontmatter.verdict || '',
    tags: parsed.frontmatter.tags || [],
    protocols: parsed.frontmatter.protocols || [],
    compatible: parsed.frontmatter.compatible || [],
    content: parsed.content
  }));

};

export const loadVideos = async () => {
  return loadContentFromFiles('/videos/', (parsed, slug) => ({
    id: slug,
    title: parsed.frontmatter.title,
    description: parsed.frontmatter.description,
    publishedAt: parsed.frontmatter.pubDate,
    duration: parsed.frontmatter.duration || '0:00',
    url: parsed.frontmatter.code ? `https://youtube.com/watch?v=${parsed.frontmatter.code}` : '',
    tags: parsed.frontmatter.tags || [],
    content: parsed.content
  }));

};