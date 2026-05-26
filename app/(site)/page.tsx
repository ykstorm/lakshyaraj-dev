import Link from 'next/link';
import { getContentFiles } from '@/lib/content';

export default async function HomePage() {
  const projects = await getContentFiles('projects');

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-4">Lakshyaraj</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Full-stack engineer building scalable systems and developer tools.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition group"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {project.metadata.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{project.metadata.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
