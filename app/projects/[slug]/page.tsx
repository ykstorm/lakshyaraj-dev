import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';
import type { Project } from '@/lib/content';
import { ProjectLinks } from '@/components/project-links';

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

  return (
    <div className="col py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight">{project.metadata.title}</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">{project.metadata.description}</p>
          {meta && <ProjectLinks p={meta} className="mt-3 flex flex-wrap gap-x-4 gap-y-1 mono text-[0.8rem] text-[var(--muted-foreground)]" />}
        </header>

        <div className="article">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
