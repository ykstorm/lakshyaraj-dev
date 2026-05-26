import { ReactNode } from 'react';

interface MDXComponents {
  [key: string]: React.ComponentType<any>;
}

const components: MDXComponents = {
  h1: ({ children }: { children: ReactNode }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
  h2: ({ children }: { children: ReactNode }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
  h3: ({ children }: { children: ReactNode }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
  p: ({ children }: { children: ReactNode }) => <p className="text-base leading-7 mb-4">{children}</p>,
  a: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href} className="text-blue-600 hover:underline dark:text-blue-400">
      {children}
    </a>
  ),
  ul: ({ children }: { children: ReactNode }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
  ol: ({ children }: { children: ReactNode }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  li: ({ children }: { children: ReactNode }) => <li className="mb-2">{children}</li>,
  code: ({ children }: { children: ReactNode }) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">{children}</code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">{children}</blockquote>
  ),
};

export function getMDXComponents() {
  return components;
}
