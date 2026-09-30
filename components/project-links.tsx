import type { Project } from '@/lib/content';

type Link = { href: string; label: string };

function projectLinks(p: Project, version?: string): Link[] {
  return [
    p.code && { href: p.code, label: 'code' },
    p.npm && { href: `https://npmjs.com/package/${p.npm}`, label: version ? `npm v${version}` : 'npm' },
    p.demo && { href: p.demo, label: 'live' },
    p.playground && { href: p.playground, label: 'playground' },
  ].filter(Boolean) as Link[];
}

export function ProjectLinks({ p, version, className }: { p: Project; version?: string; className?: string }) {
  const links = projectLinks(p, version);
  if (links.length === 0) return null;
  return (
    <div className={className ?? 'mt-2 flex flex-wrap gap-x-4 gap-y-1 mono text-[0.8rem] text-[var(--muted-foreground)]'}>
      {links.map((l) => (
        <a key={l.label} className="hover:text-[var(--accent)] transition-colors" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label}
        </a>
      ))}
    </div>
  );
}
