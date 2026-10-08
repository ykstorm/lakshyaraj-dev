import Link from 'next/link';
import { Hero } from '@/components/hero';
import { SiteFooter, SiteNav } from '@/components/site-chrome';
import { ProofSection } from '@/components/proof';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { FlagshipCard, ProjectCard } from '@/components/ui/project-card';
import { TerminalContact } from '@/components/ui/terminal-contact';
import { formatDate } from '@/components/subpage';
import { getProof } from '@/lib/proof';
import { PROJECTS } from '@/lib/projects';
import nowData from '@/data/now.json';

// Static HTML, rebuilt at most once an hour so the proof section stays current.
export const revalidate = 3600;

const RESUME_PDF = '/Lakshyaraj_Singh_Rao_Resume.pdf';

// Headings are paths: the hero terminal's `cd work` lands on ~/work.
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl">
          <h2 id={`${id}-title`} className="flex items-baseline">
            <span className="path text-[1.05rem] sm:text-[1.2rem]" aria-hidden="true">
              ~/
            </span>
            <span className="font-display text-[2rem] leading-none sm:text-[2.6rem]">{id}</span>
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}

const STACK: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL'] },
  { group: 'Back end', items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Prisma', 'Redis', 'MongoDB'] },
  { group: 'Front end', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel', 'Sentry'] },
  { group: 'In my projects', items: ['BullMQ', 'pgvector', 'ArgoCD', 'Argo Rollouts', 'Prometheus', 'Grafana'] },
];

const NOW_ROWS = [
  { label: 'Building', value: nowData.building },
  { label: 'Studying', value: nowData.studying },
  { label: 'Based in', value: nowData.location },
  { label: 'Open to', value: nowData.open_to },
];

export default async function HomePage() {
  const proof = await getProof();
  const flagship = PROJECTS.find((p) => p.flagship);
  const others = PROJECTS.filter((p) => !p.flagship);
  const year = new Date(proof.fetchedAt).getUTCFullYear();
  const stars = new Map(proof.stars.flatMap((s) => (s.ok ? [[s.id, s.stars] as const] : [])));

  return (
    <div className="relative min-h-screen text-foreground">
      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <SiteNav />

      <main>
        <Hero />

        <Section id="work">
          {flagship && (
            <div className="mb-5">
              <FlagshipCard project={flagship} />
            </div>
          )}
          <HoverEffect items={others.map((p) => ({ id: p.id, content: <ProjectCard project={p} stars={stars.get(p.id)} /> }))} />
        </Section>

        <Section id="proof">
          <ProofSection proof={proof} />
        </Section>

        <Section id="stack">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((s) => (
              <div key={s.group}>
                <dt className="mono text-[13px] text-accent">{s.group}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <li key={item} className="mono rounded-[3px] border border-border px-2 py-1 text-[12px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="now">
          <dl className="divide-y divide-border border-y border-border">
            {NOW_ROWS.map((r) => (
              <div key={r.label} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="mono text-[13px] text-accent">{r.label}</dt>
                <dd className="max-w-prose leading-relaxed">{r.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mono mt-4 text-[12px] text-muted-foreground">
            Updated {formatDate(nowData.updated_at)}.{' '}
            <Link href="/now" className="underline underline-offset-4 hover:text-accent">
              The now page
            </Link>{' '}
            has the same, on its own.
          </p>
        </Section>

        <Section id="contact">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
            <TerminalContact />
            <div className="panel p-5">
              <p className="font-display text-lg">Resume</p>
              <p className="mt-1 text-[14px] text-muted-foreground">One page, as a PDF.</p>
              <div className="mono mt-4 flex flex-wrap gap-3 text-[13px]">
                <a
                  href={RESUME_PDF}
                  download
                  className="rounded-[4px] bg-accent px-3 py-1.5 text-accent-ink transition-colors hover:bg-accent-strong"
                >
                  Download the PDF
                </a>
                <Link href="/resume" className="rounded-[4px] border border-border-strong px-3 py-1.5 transition-colors hover:border-accent hover:text-accent">
                  Read it here
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter year={year} />
    </div>
  );
}
