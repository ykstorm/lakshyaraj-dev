import { getContentBySlug, getContentFiles } from '@/lib/content';
import { PROJECTS } from '@/lib/projects';
import { CARD_SIZE, renderCard } from '@/lib/og-card';

// Each project's share card: the home card's layout with the project's name,
// its one line and its stack. Generated at build time, one per project page.
export const alt = 'A project by Lakshyaraj Singh Rao: its name, what it does and its stack';
export const size = CARD_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  const projects = await getContentFiles('projects');
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);
  const meta = PROJECTS.find((p) => p.id === slug);
  return renderCard({
    prompt: `lakshyaraj@portfolio:~$ cat ${slug.replace(/-ai$/, '')}`,
    title: project?.metadata.title ?? slug,
    line: project?.metadata.description || meta?.tagline || '',
    note: meta ? meta.stack.join(' · ') : 'Lakshyaraj Singh Rao',
  });
}
