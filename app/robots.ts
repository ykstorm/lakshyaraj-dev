import type { MetadataRoute } from 'next';
import { LLMS_PATH } from '../lib/alternates';

const SITE = 'https://lakshyaraj-dev.vercel.app';

// Next's robots.ts has no field for a comment or an llms line, so the summary
// file is named as an explicit Allow. The page head links to it as well.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: ['/', LLMS_PATH] },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
