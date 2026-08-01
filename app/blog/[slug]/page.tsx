import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getContentFiles('blog');
  return posts.map((p) => ({ slug: p.slug }));
}

// Per-post metadata — without this every post inherited the root title/description
// and (via the root canonical) pointed search engines back at the home page.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug('blog', slug);
  if (!post) return {};
  return {
    title: post.metadata.title,
    description: post.metadata.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.metadata.title,
      description: post.metadata.description,
      url: `/blog/${slug}`,
      publishedTime: post.metadata.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getContentBySlug('blog', slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-800 dark:text-zinc-100">
      {/* Sticky thin top bar — mirrors the project page shell */}
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-4 text-[12px] font-mono">
          <Link href="/blog" className="text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            ← Back
          </Link>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <span className="text-zinc-700 dark:text-zinc-200 font-semibold truncate">{post.metadata.title}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="space-y-6">
          <header className="space-y-2">
            <span className="section-label"><span className="caret" aria-hidden="true">❯</span>Writing</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {post.metadata.title}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">{post.metadata.description}</p>
            {post.metadata.date && (
              <time className="block text-sm font-mono text-zinc-500">
                {new Date(post.metadata.date).toLocaleDateString()}
              </time>
            )}
          </header>

          {/* TODO: post.content is raw markdown source. Render it as pre-wrapped
              plain text — accurate + safe — until a real MDX pipeline
              (next-mdx-remote / remark) is wired in. Never inject markdown via
              dangerouslySetInnerHTML: it's an unsafe-HTML sink and renders the
              source literally anyway. */}
          <div className="prose prose-zinc dark:prose-invert max-w-none whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
