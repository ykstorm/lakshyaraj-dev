import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Section links use the same names the terminal's `cd` command takes.
const SECTIONS = [
  { href: '/#work', label: 'work', mobile: true },
  { href: '/#proof', label: 'proof', mobile: true },
  { href: '/#now', label: 'now', mobile: false },
  { href: '/#writing', label: 'writing', mobile: false },
  { href: '/#contact', label: 'contact', mobile: true },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-[color-mix(in_srgb,var(--background)_80%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-[15px] tracking-tight transition-colors hover:text-accent">
          Lakshyaraj
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Sections" className="mono flex items-center gap-4 text-[12.5px] sm:gap-5">
            {SECTIONS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className={`text-muted-foreground transition-colors hover:text-accent ${s.mobile ? '' : 'hidden sm:inline'}`}
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

const SITE_LINKS = [
  { href: '/#work', label: 'Work' },
  { href: '/#proof', label: 'Proof' },
  { href: '/now', label: 'Now' },
  { href: '/blog', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
];
const ELSEWHERE = [
  { href: 'https://github.com/ykstorm', label: 'GitHub' },
  { href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152', label: 'LinkedIn' },
  { href: 'https://www.npmjs.com/~ykstormsorg', label: 'npm' },
  { href: 'mailto:raolakshyaraj@gmail.com', label: 'Email' },
];

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-[13px] text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[14px] transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter({ year }: { year: number }) {
  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg">Lakshyaraj Singh Rao</p>
          <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
            I build backend systems that fail safely. Mumbai, open to Bangalore.
          </p>
        </div>
        <LinkColumn title="On this site" links={SITE_LINKS} />
        <LinkColumn title="Elsewhere" links={ELSEWHERE} />
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-[12px] text-muted-foreground">© {year} Lakshyaraj Singh Rao</p>
    </footer>
  );
}
