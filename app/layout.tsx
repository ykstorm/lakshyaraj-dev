import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lakshyaraj - Full-Stack Engineer',
  description: 'Portfolio of projects and articles on engineering and tools',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
