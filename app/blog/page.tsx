import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentFiles } from '@/lib/content';
import { Subpage, formatDate } from '@/components/subpage';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on the systems I build and the bugs they caught.',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Writing', description: 'Notes on the systems I build and the bugs they caught.', url: '/blog' },
};

export default async function BlogPage() {
  const posts = await getContentFiles('blog');

  return (
    <Subpage crumbs={[{ label: 'blog' }]}>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Writing</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">Notes on the systems I build and the bugs they caught.</p>

      {posts.length === 0 ? (
        <p className="mono mt-10 text-sm text-muted-foreground">Nothing published yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {posts.map((post) => {
            const date = formatDate(post.metadata.date);
            return (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block py-6">
                  <h2 className="font-display text-xl tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                    {post.metadata.title}
                  </h2>
                  <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted-foreground">{post.metadata.description}</p>
                  {date && <time dateTime={post.metadata.date} className="mono mt-3 block text-xs text-muted-foreground">{date}</time>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Subpage>
  );
}
