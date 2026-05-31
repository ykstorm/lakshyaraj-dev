import Link from 'next/link';
import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-zinc-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Lakshyaraj
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/#projects" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition text-sm">
              Projects
            </Link>
            <Link href="/blog" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition text-sm">
              Blog
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lakshyaraj Singh Rao · Apache 2.0</p>
        </div>
      </footer>
    </div>
  );
}
