import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { PROJECTS, projectLinks } from '@/lib/projects';
import { Markdown } from '@/components/markdown';
import { Subpage } from '@/components/subpage';
import { share } from '@/lib/share';

export async function generateStaticParams() {
  const projects = await getContentFiles('projects');
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-project metadata, so each page has its own title, canonical URL and share
// text instead of inheriting the home page's. The card is opengraph-image.tsx
// next to this file.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);
  if (!project) return {};
  const meta = PROJECTS.find((p) => p.id === slug);
  const description = project.metadata.description || meta?.tagline;
  return {
    title: project.metadata.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    ...share({ title: project.metadata.title, description, path: `/projects/${slug}`, type: 'article' }),
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);
  if (!project) notFound();
  const meta = PROJECTS.find((p) => p.id === slug);
  const links = meta ? projectLinks(meta) : [];

  return (
    <Subpage crumbs={[{ href: '/#work', label: 'work' }, { label: slug }]}>
      <article>
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{project.metadata.title}</h1>
          <p className="mt-4 max-w-prose text-lg leading-snug text-accent">{project.metadata.description}</p>
          {meta && (
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
              {meta.stack.map((s) => (
                <li key={s} className="mono rounded-[3px] border border-border px-2 py-0.5 text-[11.5px] text-muted-foreground">{s}</li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <div className="mono mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
              {links.map((l) => (
                <a key={l.kind} href={l.href} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent hover:decoration-accent">
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </header>
        <Markdown source={project.content} />
      </article>
    </Subpage>
  );
}
