import Link from 'next/link';
import { projectLinks, type Project } from '@/lib/projects';

// Scanlines on hover and corner brackets: the CRT chrome shared by every card.
function Chrome() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--accent) 8%, transparent) 0 1px, transparent 1px 4px)',
        }}
      />
      <span aria-hidden className="corner left-2 top-2 border-l border-t" />
      <span aria-hidden className="corner right-2 top-2 border-r border-t" />
      <span aria-hidden className="corner bottom-2 left-2 border-b border-l" />
      <span aria-hidden className="corner bottom-2 right-2 border-b border-r" />
    </>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {items.map((s) => (
        <li key={s} className="mono rounded-[3px] border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
          {s}
        </li>
      ))}
    </ul>
  );
}

// External links sit above the card's stretched link, so both stay clickable.
function Links({ project }: { project: Project }) {
  return (
    <div className="mono relative z-20 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
      {projectLinks(project).map((l) => (
        <a
          key={l.kind}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

function Title({ project, className }: { project: Project; className: string }) {
  return (
    <h3 className={`font-display tracking-tight ${className}`}>
      <Link href={`/projects/${project.id}`} className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent">
        {project.name}
      </Link>
    </h3>
  );
}

// Homesty is the day job, so its panel lists facts from the resume, not metrics.
const HOMESTY_FACTS: [string, string][] = [
  ['role', 'Software engineer'],
  ['company', 'Homesty.ai LLP'],
  ['since', 'November 2025'],
  ['built', 'landing page, chat, REST API, admin, login, audit log'],
  ['ships on', 'Vercel, with errors watched in Sentry'],
];

export function FlagshipCard({ project }: { project: Project }) {
  return (
    <article className="group panel relative overflow-hidden p-6 transition-colors hover:border-accent/60 sm:p-8">
      <Chrome />
      <div className="relative z-10 grid gap-8 md:grid-cols-[1.35fr_1fr] md:gap-10">
        <div className="space-y-4">
          <Title project={project} className="text-3xl sm:text-[2.2rem]" />
          <p className="text-lg leading-snug text-accent">{project.tagline}</p>
          <p className="max-w-prose leading-relaxed text-muted-foreground">{project.description}</p>
          <Stack items={project.stack} />
          <Links project={project} />
        </div>
        <dl className="mono self-start rounded-[4px] border border-border bg-[color-mix(in_srgb,var(--muted)_55%,transparent)] p-4 text-[12px]">
          {HOMESTY_FACTS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3 py-1.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group panel relative flex h-full flex-col overflow-hidden p-5 transition-colors hover:border-accent/60">
      <Chrome />
      <div className="relative z-10 flex h-full flex-col gap-3">
        <Title project={project} className="text-xl" />
        <p className="leading-snug text-accent">{project.tagline}</p>
        <p className="text-[14.5px] leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-auto space-y-3 pt-2">
          <Stack items={project.stack.slice(0, 5)} />
          <Links project={project} />
        </div>
      </div>
    </article>
  );
}
