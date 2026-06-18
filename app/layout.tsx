import type { Metadata } from 'next';
import { Geist, JetBrains_Mono, Martian_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
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

export const metadata: Metadata = {
  title: 'Lakshyaraj Singh Rao — Backend Engineer · AI Infrastructure',
  description: 'Production AI systems builder. Backend platform + AI infra + full-stack. Remote.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
