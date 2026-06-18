import Link from 'next/link';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';
import projectsData from '@/data/projects.json';

export async function generateStaticParams() {
  const projects = await getContentFiles('projects');
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getContentBySlug('projects', slug);

  if (!project) {
    notFound();
  }

  const meta = (projectsData as any[]).find((p) => p.id === slug);
  const live = meta?.demo || meta?.playground;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-800 dark:text-zinc-100">
      {/* Sticky thin top bar */}
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-4 text-[12px] font-mono">
          <Link href="/#projects" className="text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            ← Back
          </Link>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <span className="text-zinc-700 dark:text-zinc-200 font-semibold truncate">{project.metadata.title}</span>
          <div className="ml-auto flex items-center gap-4">
            {live && (
              <a href={live} target="_blank" rel="noopener" className="text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                Live
              </a>
            )}
            {meta?.code && (
              <a href={meta.code} target="_blank" rel="noopener" className="text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                Code
              </a>
            )}
            {meta?.npm && (
              <a href={`https://npmjs.com/package/${meta.npm}`} target="_blank" rel="noopener" className="text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                npm
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="space-y-6">
          <header className="space-y-2">
            <span className="section-label">// Project</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {project.metadata.title}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">{project.metadata.description}</p>
            {project.metadata.date && (
              <time className="block text-sm font-mono text-zinc-500">
                {new Date(project.metadata.date).toLocaleDateString()}
              </time>
            )}
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {project.content}
          </div>
        </article>
      </div>
    </div>
  );
}
