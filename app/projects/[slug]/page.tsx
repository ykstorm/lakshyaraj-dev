import Link from 'next/link';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await getContentFiles('projects');
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getContentBySlug('projects', params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
        ← Back to Projects
      </Link>

      <article className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{project.metadata.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{project.metadata.description}</p>
          <time className="text-sm text-gray-500 dark:text-gray-500">
            {new Date(project.metadata.date).toLocaleDateString()}
          </time>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>
      </article>
    </div>
  );
}
