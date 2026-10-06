import type { MetadataRoute } from 'next';
import projectsData from '@/data/projects.json';

const SITE = 'https://lakshyaraj-dev.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ['', '/now', '/resume'].map((p) => ({
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

  return [...staticRoutes, ...projects];
}
