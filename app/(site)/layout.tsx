import Link from 'next/link';
import { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Lakshyaraj
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Projects
            </Link>
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Lakshyaraj. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
