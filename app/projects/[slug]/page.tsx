import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import type { Project } from '@/lib/content';

export async function generateStaticParams() {
  const projects = await getContentFiles('projects');
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-project metadata — otherwise every project page inherited the root
// title/description and canonicalized to the home page (invisible to search).
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);
  if (!project) return {};
  const meta = (projectsData as Project[]).find((p) => p.id === slug);
  const description = project.metadata.description || meta?.description;
  return {
    title: project.metadata.title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      title: project.metadata.title,
      description,
      url: `/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);

  if (!project) {
    notFound();
  }

  const meta = (projectsData as Project[]).find((p) => p.id === slug);
  const live = meta?.demo || meta?.playground;

  return (
    <div className="col py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight">{project.metadata.title}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">{project.metadata.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 mono text-[0.8rem] text-[var(--muted-foreground)]">
            {meta?.code && <a className="hover:text-[var(--accent)] transition-colors" href={meta.code} target="_blank" rel="noopener noreferrer">code</a>}
            {meta?.npm && <a className="hover:text-[var(--accent)] transition-colors" href={`https://npmjs.com/package/${meta.npm}`} target="_blank" rel="noopener noreferrer">npm</a>}
            {live && <a className="hover:text-[var(--accent)] transition-colors" href={live} target="_blank" rel="noopener noreferrer">live</a>}
          </div>
        </header>

        <div className="article">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
