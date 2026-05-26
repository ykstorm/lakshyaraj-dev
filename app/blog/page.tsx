import Link from 'next/link';
import { getContentFiles } from '@/lib/content';

export default async function BlogPage() {
  const posts = await getContentFiles('blog');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">Articles on engineering, architecture, and tools.</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition group"
          >
            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {post.metadata.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{post.metadata.description}</p>
            <time className="text-sm text-gray-500 dark:text-gray-500">
              {new Date(post.metadata.date).toLocaleDateString()}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
}
