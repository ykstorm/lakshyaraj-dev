import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title: string;
  description: string;
  date: string;
  [key: string]: any;
}

export interface ContentFile {
  slug: string;
  metadata: ContentMetadata;
  content: string;
}

const parseMarkdownFrontmatter = (content: string): { metadata: ContentMetadata; body: string } => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {} as ContentMetadata, body: content };
  }

  const frontmatter = match[1];
  const body = match[2];

  const metadata: ContentMetadata = { title: '', description: '', date: '' };
  const lines = frontmatter.split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    if (key.trim()) {
      metadata[key.trim()] = value;
    }
  }

  return { metadata, body };
};

export async function getContentFiles(contentType: 'projects' | 'blog'): Promise<ContentFile[]> {
  const contentDir = path.join(process.cwd(), 'content', contentType);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => {
      const fullPath = path.join(contentDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { metadata, body } = parseMarkdownFrontmatter(content);
      const slug = file.replace('.mdx', '');

      return {
        slug,
        metadata,
        content: body,
      };
    })
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}

export async function getContentBySlug(contentType: 'projects' | 'blog', slug: string): Promise<ContentFile | null> {
  const contentDir = path.join(process.cwd(), 'content', contentType);
  const filePath = path.join(contentDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const { metadata, body } = parseMarkdownFrontmatter(content);

  return {
    slug,
    metadata,
    content: body,
  };
}
