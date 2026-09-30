import Link from 'next/link';
import { GithubContributions } from '@/components/ui/github-contributions';
import { NowContent } from '@/components/now-content';
import { ProjectLinks } from '@/components/project-links';
import { SOCIAL, EMAIL } from '@/lib/site';
import type { Project } from '@/lib/content';
import projectsData from '@/data/projects.json';

const NPM_PACKAGES = [
  '@ykstormsorg/anvil',
  '@ykstormsorg/tripwire',
  '@ykstormsorg/goldset',
  '@ykstormsorg/quickdraw',
];

// Fetched on the server, cached an hour, so the published version numbers are in
// the HTML itself — the site can't claim a version it didn't ship.
async function getNpmVersions(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    NPM_PACKAGES.map(async (pkg) => {
      try {
        const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`, { next: { revalidate: 3600 } });
        if (!res.ok) return [pkg, ''] as const;
        const data = await res.json();
        return [pkg, typeof data.version === 'string' ? data.version : ''] as const;
      } catch {
        return [pkg, ''] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="col py-10 border-t border-[var(--border)]">
      <h2 className="text-[1.15rem] font-bold tracking-tight mb-5">{title}</h2>
      {children}
    </section>
  );
}

function ProjectRow({ p, version }: { p: Project; version?: string }) {
  const href = p.demo || p.playground || p.code;
  return (
    <li className="py-4 first:pt-0">
      <h3 className="text-[1.05rem] font-medium">
        {href ? (
          <a className="hover:text-[var(--accent)] transition-colors" href={href} target="_blank" rel="noopener noreferrer">{p.name}</a>
        ) : (
          p.name
        )}
      </h3>
      <p className="mt-1 text-[var(--muted-foreground)]">{p.tagline}</p>
      <p className="mt-1 mono text-[0.8rem] text-[var(--muted-foreground)]">{p.stack.join(', ')}</p>
      <ProjectLinks p={p} version={version} />
    </li>
  );
}

function AlsoRow({ p, version }: { p: Project; version?: string }) {
  const href = p.demo || p.playground || p.code;
  return (
    <li className="py-2">
      <span className="font-medium">
        {href ? (
          <a className="hover:text-[var(--accent)] transition-colors" href={href} target="_blank" rel="noopener noreferrer">{p.name}</a>
        ) : (
          p.name
        )}
      </span>
      <span className="text-[var(--muted-foreground)]"> — {p.tagline}</span>
      <ProjectLinks p={p} version={version} />
    </li>
  );
}

const STACK: [string, string[]][] = [
  ['Languages', ['JavaScript', 'TypeScript', 'SQL']],
  ['Frontend', ['React', 'Next.js', 'Tailwind']],
  ['Backend', ['Node', 'Express', 'REST', 'Postgres', 'Prisma', 'Redis', 'Mongo']],
  ['Tooling', ['Git', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel', 'Sentry']],
];

export default async function HomePage() {
  const projects = projectsData as Project[];
  const primary = projects.filter((p) => !p.secondary);
  const secondary = projects.filter((p) => p.secondary);
  const versions = await getNpmVersions();

  return (
    <div className="page-content">
      {/* Hero — name, three resume sentences, one link row. */}
      <section className="col pt-16 pb-12">
        <h1 className="text-[clamp(2.1rem,6vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          Lakshyaraj Singh&nbsp;Rao
        </h1>
        <div className="mt-5 space-y-3 text-[1.05rem] leading-relaxed">
          <p>Full-stack developer with a backend focus, based in Mumbai.</p>
          <p>Building Homesty.ai since November 2025 — Next.js, React, Node, Postgres, Prisma, Vercel, Sentry.</p>
          <p>B.Tech in Computer Science, Manipal University Jaipur, 2026.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 mono text-[0.85rem] text-[var(--muted-foreground)]">
          {SOCIAL.map(({ label, href }) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
              {label}
            </a>
          ))}
          <Link href="/resume" className="hover:text-[var(--accent)] transition-colors">Résumé (PDF)</Link>
        </div>
      </section>

      {/* Projects — a list, not a card grid. */}
      <Section id="projects" title="Projects">
        <ul>
          {primary.map((p) => (
            <ProjectRow key={p.id} p={p} version={p.npm ? versions[p.npm] : undefined} />
          ))}
        </ul>
        {secondary.length > 0 && (
          <>
            <h3 className="mt-6 mb-1 text-[var(--muted-foreground)] text-[0.95rem]">Also</h3>
            <ul>
              {secondary.map((p) => (
                <AlsoRow key={p.id} p={p} version={p.npm ? versions[p.npm] : undefined} />
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* Now */}
      <Section id="now" title="Now">
        <NowContent />
      </Section>

      {/* Stack */}
      <Section id="stack" title="Stack">
        <dl className="space-y-3">
          {STACK.map(([label, items]) => (
            <div key={label} className="sm:grid sm:grid-cols-[7rem_1fr] gap-2">
              <dt className="text-[var(--muted-foreground)]">{label}</dt>
              <dd className="mono text-[0.85rem]">{items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* GitHub activity (client island) */}
      <Section id="activity" title="Activity">
        <GithubContributions />
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact">
        <p className="leading-relaxed">
          Email me at{' '}
          <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          {' '}— I read everything. You can also find me on GitHub, LinkedIn, and npm.
        </p>
      </Section>
    </div>
  );
}
