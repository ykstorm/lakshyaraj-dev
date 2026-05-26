import Link from 'next/link';
import { getContentBySlug, getContentFiles } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getContentFiles('blog');
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getContentBySlug('blog', params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
        ← Back to Blog
      </Link>

      <article className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{post.metadata.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{post.metadata.description}</p>
          <time className="text-sm text-gray-500 dark:text-gray-500">
            {new Date(post.metadata.date).toLocaleDateString()}
          </time>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}
