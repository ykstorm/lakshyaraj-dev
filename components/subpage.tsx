import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type Crumb = { href?: string; label: string };

// Shared chrome for every page except the home page. The header is the page's
// path written like a shell prompt, ~/blog/post-name, with each segment linked.
export function Subpage({
  crumbs,
  actions,
  children,
}: {
  crumbs: Crumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="atmosphere" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--background)_86%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-3xl items-center gap-4 px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mono min-w-0 flex-1 truncate text-[12.5px]">
            <Link href="/" className="text-accent hover:text-accent-strong">~</Link>
            {crumbs.map((c, i) => (
              <span key={c.label}>
                <span className="text-muted-foreground">/</span>
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="text-muted-foreground hover:text-accent">{c.label}</Link>
                ) : (
                  <span className="text-foreground" aria-current="page">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          {actions && <div className="mono flex shrink-0 items-center gap-4 text-[12.5px]">{actions}</div>}
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">{children}</main>
    </div>
  );
}

export function formatDate(date: string): string | null {
  const t = Date.parse(date);
  if (!t) return null;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
