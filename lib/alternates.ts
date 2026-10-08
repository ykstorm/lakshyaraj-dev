import type { Metadata } from 'next';

// The alternates every page's head carries: its canonical URL, and a link to
// the plain-text summary of the site that sits in public/llms.txt. Next merges
// metadata one top-level key at a time, so a page that sets `alternates`
// replaces the root's whole object. Each page builds it here instead, which
// keeps the llms.txt link on every page. The urls are resolved against
// metadataBase when Next writes the tags.
export const LLMS_PATH = '/llms.txt';

export function alternatesFor(path: string): NonNullable<Metadata['alternates']> {
  return {
    canonical: path,
    types: { 'text/plain': [{ url: LLMS_PATH, title: 'llms.txt' }] },
  };
}
