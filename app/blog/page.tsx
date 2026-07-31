import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentFiles } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing — Lakshyaraj Singh Rao',
  description: 'Notes on engineering, architecture, and the tools I build.',
};

export default async function BlogPage() {
  const posts = await getContentFiles('blog');

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-800 dark:text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="text-[12px] font-mono text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide"
        >
          ← back
        </Link>

        <div className="mt-8 mb-10">
          <span className="section-label">{'// Writing'}</span>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Writing</h1>
          <p className="mt-2 text-[13px] text-zinc-500 font-mono">
            Notes on engineering, architecture, and the tools I build.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-[13px] text-zinc-500">No posts yet.</p>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="telemetry-card group block"
              >
                <h2 className="font-display text-xl tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {post.metadata.title}
                </h2>
                <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{post.metadata.description}</p>
                {post.metadata.date && (
                  <time className="mt-3 block text-[11px] font-mono text-zinc-500">
                    {new Date(post.metadata.date).toLocaleDateString()}
                  </time>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
