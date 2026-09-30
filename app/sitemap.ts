import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getContentFiles } from '@/lib/content';
import projectsData from '@/data/projects.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ['', '/now', '/resume', '/blog'].map((p) => ({
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

  const posts = await getContentFiles('blog');
  const blog: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...projects, ...blog];
}
