import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title: string;
  description: string;
  date: string;
}

export interface ContentFile {
  slug: string;
  metadata: ContentMetadata;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  story: string;
  description: string;
  stack: string[];
  demo?: string;
  playground?: string;
  code?: string;
  npm?: string;
  secondary?: boolean;
}

const EMPTY_METADATA: ContentMetadata = { title: '', description: '', date: '' };

function parseFields(frontmatter: string): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const line of frontmatter.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (key) fields[key] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return fields;
}

function parseMarkdownFrontmatter(raw: string): { metadata: ContentMetadata; body: string } {
  // Normalise line endings first: the .mdx files are checked out with CRLF on
  // Windows, which the front-matter fence regex (expecting \n) would otherwise miss.
  const content = raw.replace(/\r\n/g, '\n');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { metadata: EMPTY_METADATA, body: content };
  }

  const [, frontmatter, body] = match;
  const fields = parseFields(frontmatter);
  return {
    metadata: {
      title: fields.title ?? '',
      description: fields.description ?? '',
      date: fields.date ?? '',
    },
    body,
  };
}

export async function getContentFiles(contentType: 'projects' | 'blog'): Promise<ContentFile[]> {
  const contentDir = path.join(process.cwd(), 'content', contentType);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const { metadata, body } = parseMarkdownFrontmatter(content);
      return { slug: file.replace('.mdx', ''), metadata, content: body };
    })
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}

export async function getContentBySlug(contentType: 'projects' | 'blog', slug: string): Promise<ContentFile | null> {
  // Slug comes from a dynamic route param → untrusted. Restrict to a safe
  // charset before it ever reaches the filesystem so no crafted value can
  // escape the content dir (defense-in-depth against path traversal).
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const filePath = path.join(process.cwd(), 'content', contentType, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const { metadata, body } = parseMarkdownFrontmatter(content);
  return { slug, metadata, content: body };
}
