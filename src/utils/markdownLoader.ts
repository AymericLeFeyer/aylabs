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
  
  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split('\n');
  let currentKey = '';
  let isArray = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (trimmedLine.startsWith('- ')) {
      // Array item
      if (isArray && currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(trimmedLine.substring(2).replace(/^"(.*)"$/, '$1'));
      }
    } else if (trimmedLine.includes(':')) {
      // Key-value pair
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      currentKey = key;
      
      if (value === '') {
        // Might be start of array
        isArray = true;
        frontmatter[key] = [];
      } else {
        isArray = false;
        // Remove quotes if present
        let parsedValue = value.replace(/^"(.*)"$/, '$1');
        
        // Check if value is a JSON array string
        if (parsedValue.startsWith('[') && parsedValue.endsWith(']')) {
          try {
            frontmatter[key] = JSON.parse(parsedValue);
          } catch (e) {
            frontmatter[key] = parsedValue;
          }
        } else {
          frontmatter[key] = parsedValue;
        }
      }
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
    reolinkLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('reolink')),
    bambuLink: parsed.frontmatter.buyLinks?.find((link: string) => link.includes('bambu')),
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