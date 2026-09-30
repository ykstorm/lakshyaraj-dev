import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentFiles } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing — Lakshyaraj Singh Rao',
  description: 'Notes on backend work and the tools I build.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Writing — Lakshyaraj Singh Rao', description: 'Notes on backend work and the tools I build.', url: '/blog' },
};

export default async function BlogPage() {
  const posts = await getContentFiles('blog');

  return (
    <div className="col py-12">
      <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight">Writing</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">Notes on backend work and the tools I build.</p>

      {posts.length === 0 ? (
        <p className="mt-8 text-[var(--muted-foreground)]">No posts yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-[var(--border)]">
          {posts.map((post) => (
            <li key={post.slug} className="py-5">
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-[1.1rem] font-medium group-hover:text-[var(--accent)] transition-colors">
                  {post.metadata.title}
                </h2>
                <p className="mt-1 text-[var(--muted-foreground)]">{post.metadata.description}</p>
                {post.metadata.date && (
                  <time className="mt-2 block mono text-[0.78rem] text-[var(--muted-foreground)]">
                    {new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
