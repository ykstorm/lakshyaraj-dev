import Link from 'next/link';
import { HeroField } from '@/components/hero/hero-field';
import { GithubContributions } from '@/components/ui/github-contributions';
import { NpmTerminal } from '@/components/proof/npm-terminal';
import { NowContent } from '@/components/now-content';
import { ProjectLinks } from '@/components/project-links';
import { getProof, type CiStatus } from '@/lib/proof';
import { SOCIAL, EMAIL } from '@/lib/site';
import type { Project } from '@/lib/content';
import projectsData from '@/data/projects.json';

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

// One CI line per repository. A run that didn't come back (no workflow, rate
// limit, network error) links to the Actions tab rather than claiming a state.
function CiRow({ c }: { c: CiStatus }) {
  const age = c.daysAgo === 0 ? 'today' : `${c.daysAgo}d ago`;
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-[var(--foreground)]">{c.repo}</span>
      {c.state === 'unknown' ? (
        <a className="link" href={c.actionsUrl} target="_blank" rel="noopener noreferrer">Actions</a>
      ) : c.state === 'passing' ? (
        <span className="text-[var(--accent)]">
          CI passing{c.daysAgo !== null ? <span className="text-[var(--muted-foreground)]"> · {age}</span> : null}
        </span>
      ) : (
        <span className="text-[var(--foreground)]">CI failing</span>
      )}
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
  const proof = await getProof();
  const versions: Record<string, string> = Object.fromEntries(
    proof.npm.map((n) => [n.full, n.version ?? '']),
  );

  return (
    <div className="page-content">
      {/* Hero — name, the one-line thesis, the two facts, one link row. The
          receding dot plane is a CSS pseudo-element on .hero (renders JS-off and
          under reduced motion); the WebGL "Still Field" layers over it when it
          can run. The h1 is plain text, so it stays the LCP element. */}
      <section className="hero">
        <HeroField />
        <div className="hero-inner col">
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

      {/* Proof — the claims above, checkable. Every figure here is fetched at
          build from a public registry; nothing is typed in by hand. */}
      <Section id="proof" title="Proof">
        <p className="leading-relaxed">
          Homesty.ai is live in production at{' '}
          <a className="link" href="https://homesty.ai" target="_blank" rel="noopener noreferrer">homesty.ai</a>.
        </p>

        <div className="mt-6">
          <NpmTerminal versions={proof.npm} />
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">
            Fetched from the npm registry when this page was built, cached for an hour. Each package carries build provenance from its public repository.
          </p>
        </div>

        <div className="mt-7">
          <ul className="space-y-1.5 mono text-[0.82rem]">
            {proof.ci.map((c) => (
              <CiRow key={c.repo} c={c} />
            ))}
          </ul>
        </div>

        <div className="mt-7">
          <GithubContributions />
          <p className="mt-2 text-[0.85rem] text-[var(--muted-foreground)]">
            Counts commits to my own repositories. It measures what I write here, not what I land upstream.
          </p>
        </div>
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
