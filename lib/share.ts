import type { Metadata } from 'next';

// What a shared link shows. Next merges metadata one top-level key at a time,
// so a page that sets openGraph replaces the root's whole openGraph, image and
// site name included, and a page that sets no twitter keeps the home page's
// text. Each page builds both here instead. twitter:image is left out: Next
// copies it from the openGraph images.
const SITE_NAME = 'Lakshyaraj Singh Rao';

/** The home page's card (app/opengraph-image.tsx), for pages without their own. */
export const HOME_CARD = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Lakshyaraj Singh Rao, backend-focused full-stack developer',
};

interface Share {
  title: string;
  description?: string;
  path: string;
  type?: 'website' | 'article';
  /** Omit when the route has its own opengraph-image file. */
  image?: typeof HOME_CARD;
}

export function share({ title, description, path, type = 'website', image }: Share): Pick<Metadata, 'openGraph' | 'twitter'> {
  const full = `${title} · ${SITE_NAME}`;
  return {
    openGraph: { type, siteName: SITE_NAME, title: full, description, url: path, ...(image && { images: [image] }) },
    twitter: { card: 'summary_large_image', title: full, description },
  };
}
