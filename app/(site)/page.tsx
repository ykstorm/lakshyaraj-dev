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

function ProjectName({ p }: { p: Project }) {
  const href = p.demo || p.playground || p.code;
  if (!href) return <>{p.name}</>;
  return (
    <a className="hover:text-[var(--accent)] transition-colors" href={href} target="_blank" rel="noopener noreferrer">
      {p.name}
    </a>
  );
}

// One row shape for every project: name, the plain one-line claim, the short
// story, then the links. No stack line here — the stack lives on the detail page.
function ProjectRow({ p, version, lead }: { p: Project; version?: string; lead?: boolean }) {
  return (
    <li className={lead ? 'py-6 first:pt-0' : 'py-5'}>
      <h3 className={lead ? 'text-[1.15rem] font-medium' : 'text-[1.02rem] font-medium'}>
        <ProjectName p={p} />
      </h3>
      <p className="mt-1 text-[var(--foreground)]">{p.tagline}</p>
      <p className="mt-2 max-w-[60ch] text-[0.95rem] leading-relaxed text-[var(--muted-foreground)]">{p.story}</p>
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
      {/* Hero — name, the one-line thesis, the two facts, one link row. */}
      <section className="col pt-16 pb-12">
        <h1 className="text-[clamp(2.1rem,6vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          Lakshyaraj Singh&nbsp;Rao
        </h1>
        <p className="mt-5 max-w-[46ch] text-[clamp(1.1rem,2.6vw,1.35rem)] leading-snug">
          I build backend systems that fail safely: webhooks that never run twice, retrieval that admits when it has nothing, streams that stop themselves.
        </p>
        <p className="mt-5 text-[1.05rem] leading-relaxed">Building Homesty.ai since November 2025.</p>
        <p className="mt-2 mono text-[0.85rem] text-[var(--muted-foreground)]">
          Mumbai / Bangalore · B.Tech CS, Manipal University Jaipur, 2026.
        </p>
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
            <ProjectRow key={p.id} p={p} version={p.npm ? versions[p.npm] : undefined} lead />
          ))}
        </ul>
        {secondary.length > 0 && (
          <>
            <h3 className="mt-8 mb-1 text-[var(--muted-foreground)] text-[0.95rem]">Also</h3>
            <ul>
              {secondary.map((p) => (
                <ProjectRow key={p.id} p={p} version={p.npm ? versions[p.npm] : undefined} />
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
          . I read everything. You can also find me on GitHub, LinkedIn, and npm.
        </p>
      </Section>
    </div>
  );
}
