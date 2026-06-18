import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lakshyaraj Singh Rao — Backend Engineer · AI Infrastructure',
  description: 'Production AI systems builder. Backend platform + AI infra + full-stack. Remote.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}