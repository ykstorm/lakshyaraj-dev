import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Quiet shared top bar. Aligned to the reading column so it sits over the same
// measure as the content. No section anchors cluttering it — just home, writing,
// and the light/dark toggle.
export function SiteNav() {
  return (
    <header className="border-b border-[var(--border)]">
      <nav className="col h-14 flex items-center justify-between">
        <Link href="/" className="font-medium tracking-tight hover:text-[var(--accent)] transition-colors">
          Lakshyaraj Singh Rao
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/#projects" className="text-[0.95rem] text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors">
            Projects
          </Link>
          <Link href="/blog" className="text-[0.95rem] text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors">
            Writing
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
