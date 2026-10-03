import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { Markdown } from '@/components/markdown';
import { Subpage, formatDate } from '@/components/subpage';

export async function generateStaticParams() {
  const posts = await getContentFiles('blog');
  return posts.map((p) => ({ slug: p.slug }));
}

// Per-post metadata, so each post has its own title, description and canonical
// URL instead of inheriting the home page's.
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
  if (!post) notFound();
  const date = formatDate(post.metadata.date);

  return (
    <Subpage crumbs={[{ href: '/blog', label: 'blog' }, { label: slug }]}>
      <article>
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-[2.6rem]">{post.metadata.title}</h1>
          <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-muted-foreground">{post.metadata.description}</p>
          {date && <time dateTime={post.metadata.date} className="mono mt-4 block text-xs text-muted-foreground">{date}</time>}
        </header>
        <Markdown source={post.content} />
      </article>
    </Subpage>
  );
}
