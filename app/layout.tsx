import type { Metadata } from 'next';
import { Geist, JetBrains_Mono, Martian_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

// Self-hosted via next/font (no layout shift, and survives Tailwind v4's bundler,
// which drops bare @import url() font links). Exposed as CSS variables consumed
// in globals.css: body prose = Geist, terminals/code = JetBrains Mono, display/
// labels = Martian Mono.
// Unique --ff-* names: Tailwind v4 already claims --font-sans/--font-mono as theme
// tokens, so reusing them creates an equal-specificity tie the system font can win.
// globals.css re-points the Tailwind tokens at these.
const sans = Geist({ subsets: ['latin'], variable: '--ff-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--ff-mono', display: 'swap' });
const display = Martian_Mono({ subsets: ['latin'], variable: '--ff-display', display: 'swap' });

const SITE = 'https://lakshyaraj-dev.vercel.app';
const TITLE = 'Lakshyaraj Singh Rao — Backend & AI-Infrastructure Engineer';
const DESC =
  'I build the reliability layer for production AI — refusal, guardrails, eval-gating, idempotency. Seven open-source tools (four on npm), extracted from a live AI product.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s · Lakshyaraj Singh Rao' },
  description: DESC,
  keywords: [
    'Lakshyaraj Singh Rao', 'backend engineer', 'AI infrastructure', 'DevOps',
    'RAG', 'LLM', 'TypeScript', 'Kubernetes', 'webhook reliability', 'idempotency', 'Mumbai',
  ],
  authors: [{ name: 'Lakshyaraj Singh Rao', url: SITE }],
  creator: 'Lakshyaraj Singh Rao',
  icons: { icon: '/favicon.ico' },
  alternates: { canonical: '/' },
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
    description: 'The reliability layer for production AI — refusal, guardrails, eval-gating, idempotency. 7 OSS tools, 4 on npm.',
  },
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
              jobTitle: 'Backend & AI-Infrastructure Engineer',
              email: 'mailto:raolakshyaraj@gmail.com',
              address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
              knowsAbout: ['Backend engineering', 'AI infrastructure', 'RAG', 'LLM reliability', 'Kubernetes', 'DevOps'],
              sameAs: [
                'https://github.com/ykstorm',
                'https://linkedin.com/in/lakshyaraj-singh-rao-840273152',
                'https://www.npmjs.com/~ykstormsorg',
              ],
            }),
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
