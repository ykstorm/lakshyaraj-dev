import Link from 'next/link';
import { SOCIAL } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="col py-10 space-y-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mono text-[0.85rem] text-[var(--muted-foreground)]">
          {SOCIAL.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              {label}
            </a>
          ))}
          <Link href="/resume" className="hover:text-[var(--accent)] transition-colors">
            Résumé
          </Link>
        </div>
        <p className="text-[0.85rem] text-[var(--muted-foreground)]">
          © {year} Lakshyaraj Singh Rao — Mumbai, India
        </p>
      </div>
    </footer>
  );
}
