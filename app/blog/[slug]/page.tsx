import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
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
    <div className="col py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-[clamp(1.8rem,5vw,2.4rem)] font-bold tracking-tight leading-[1.15]">
            {post.metadata.title}
          </h1>
          {post.metadata.date && (
            <time className="mt-3 block mono text-[0.8rem] text-[var(--muted-foreground)]">
              {new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
        </header>

        <div className="article">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
