import type { Metadata, Viewport } from 'next';
import { THEME_COLOR } from '@/lib/theme-color'
import { alternatesFor } from '@/lib/alternates';
import { Hanken_Grotesk, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

// Self-hosted via next/font (no layout shift, and survives Tailwind v4's bundler,
// which drops bare @import url() font links). Exposed as CSS variables consumed
// in globals.css: body = Hanken Grotesk, terminals and data = JetBrains Mono,
// headings = Space Grotesk. Unique --ff-* names because Tailwind v4 already
// claims --font-sans/--font-mono as theme tokens; globals.css re-points those.
const sans = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '700'], variable: '--ff-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--ff-mono', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], weight: ['600'], variable: '--ff-display', display: 'swap' });

const SITE = 'https://lakshyaraj-dev.vercel.app';
const TITLE = 'Lakshyaraj Singh Rao, backend-focused full-stack developer';
const DESC =
  'I build backend systems that fail safely: webhooks that never run twice, retrieval that admits when it has nothing, streams that stop themselves. Building Homesty.ai since November 2025.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s · Lakshyaraj Singh Rao' },
  description: DESC,
  keywords: [
    'Lakshyaraj Singh Rao', 'backend developer', 'full-stack developer', 'TypeScript',
    'Node.js', 'PostgreSQL', 'webhooks', 'idempotency', 'RAG', 'Mumbai', 'Bangalore',
  ],
  authors: [{ name: 'Lakshyaraj Singh Rao', url: SITE }],
  creator: 'Lakshyaraj Singh Rao',
  icons: { icon: '/favicon.ico' },
  alternates: alternatesFor('/'),
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Lakshyaraj Singh Rao',
    title: TITLE,
    description: DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: THEME_COLOR.dark },
    { media: '(prefers-color-scheme: light)', color: THEME_COLOR.light },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Lakshyaraj Singh Rao',
              url: SITE,
              jobTitle: 'Software Engineer',
              email: 'mailto:raolakshyaraj@gmail.com',
              worksFor: { '@type': 'Organization', name: 'Homesty.ai LLP', url: 'https://homesty.ai' },
              alumniOf: { '@type': 'CollegeOrUniversity', name: 'Manipal University Jaipur' },
              address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
              knowsAbout: ['TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
              sameAs: [
                'https://github.com/ykstorm',
                'https://linkedin.com/in/lakshyaraj-singh-rao-840273152',
                'https://www.npmjs.com/~ykstormsorg',
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
