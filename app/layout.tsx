import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Lakshyaraj Singh Rao — Full-Stack Engineer',
  description: 'Full-Stack Engineer · AI Systems · Backend · DevOps. Building observable, provenance-grounded AI systems.',
  openGraph: {
    title: 'Lakshyaraj Singh Rao',
    description: 'Full-Stack Engineer · AI Systems · Backend · DevOps',
    type: 'profile',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
