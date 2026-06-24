import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import projectsData from '@/data/projects.json';

const SITE = 'https://lakshyaraj-dev.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ['', '/now', '/uses', '/resume', '/blog'].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  const projects: MetadataRoute.Sitemap = (projectsData as { id: string }[]).map((p) => ({
    url: `${SITE}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  let blog: MetadataRoute.Sitemap = [];
  try {
    const dir = path.join(process.cwd(), 'content', 'blog');
    blog = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => ({
        url: `${SITE}/blog/${f.replace(/\.mdx$/, '')}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch {
    // no blog dir at build — skip
  }

  return [...staticRoutes, ...projects, ...blog];
}
