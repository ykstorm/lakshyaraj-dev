import type { Metadata } from 'next';
import { Hanken_Grotesk, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

// Self-hosted via next/font (no layout shift, and survives Tailwind v4's bundler,
// which drops bare @import url() font links). Exposed as CSS variables consumed
// in globals.css: body prose = Hanken Grotesk (warm humanist sans), terminals/
// code/labels = JetBrains Mono, display headings = Space Grotesk (distinctive
// geometric grotesque — character without the Geist/Inter default look).
// Unique --ff-* names: Tailwind v4 already claims --font-sans/--font-mono as theme
// tokens, so reusing them creates an equal-specificity tie the system font can win.
// globals.css re-points the Tailwind tokens at these.
// Only the weights actually rendered — body 400, headings 700 (Hanken); display
// is locked to 600 by .font-display. Fewer static woff2 files on the LCP path.
const sans = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '700'], variable: '--ff-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--ff-mono', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], weight: ['600'], variable: '--ff-display', display: 'swap' });

const SITE = 'https://lakshyaraj-dev.vercel.app';
const TITLE = 'Lakshyaraj Singh Rao — full-stack developer';
const DESC =
  'Full-stack developer, backend focus. Building Homesty.ai since Nov 2025. Anvil, Anchor, Tripwire and Stackup on GitHub; four packages on npm. Mumbai.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s · Lakshyaraj Singh Rao' },
  description: DESC,
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
    description: DESC,
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
              jobTitle: 'Full-stack developer',
              email: 'mailto:raolakshyaraj@gmail.com',
              worksFor: { '@type': 'Organization', name: 'Homesty.ai', url: 'https://homesty.ai' },
              address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
              knowsAbout: ['JavaScript', 'TypeScript', 'SQL', 'React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel'],
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
