'use client';
import { IconBrandGithub, IconBrandNpm } from '@tabler/icons-react';
import { Globe, TerminalSquare } from 'lucide-react';
import { TechBadge } from '@/components/ui/tech-badge';

interface ProjectCardProps {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  demo?: string;
  playground?: string;
  code?: string;
  npm?: string;
  action?: string;
  color?: string;
  flagship?: boolean;
  index: number;
}

// border + hover-border per project accent
const ACCENT: Record<string, string> = {
  cyan: 'hover:border-cyan-400/70',
  amber: 'hover:border-amber-400/70',
  green: 'hover:border-emerald-400/70',
  red: 'hover:border-red-400/70',
  purple: 'hover:border-violet-400/70',
  pink: 'hover:border-pink-400/70',
  default: 'hover:border-zinc-400/70',
};

function statusOf(p: ProjectCardProps): { text: string; cls: string } {
  if (p.demo || p.playground)
    return { text: '● LIVE', cls: 'text-emerald-600 dark:text-emerald-400' };
  if (p.npm) return { text: '◆ NPM', cls: 'text-amber-600 dark:text-amber-400' };
  return { text: '◇ REPO', cls: 'text-cyan-700 dark:text-cyan-400' };
}

// shared link row
function Links({ p }: { p: ProjectCardProps }) {
  const live = p.demo || p.playground;
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] mono text-zinc-500">
      {live && (
        <a href={live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <Globe className="w-3 h-3" /> live
        </a>
      )}
      {p.playground && p.playground !== p.demo && (
        <a href={p.playground} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <TerminalSquare className="w-3 h-3" /> playground
        </a>
      )}
      {p.code && (
        <a href={p.code} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <IconBrandGithub className="w-3 h-3" /> code
        </a>
      )}
      {p.npm && (
        <a href={`https://npmjs.com/package/${p.npm}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          <IconBrandNpm className="w-3.5 h-3.5" /> npm
        </a>
      )}
    </div>
  );
}

// CRT scanline overlay + corner brackets shared by both variants
function Chrome() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--accent) 9%, transparent) 0 1px, transparent 1px 4px)',
        }}
      />
      <span className="corner left-2 top-2 border-l border-t" />
      <span className="corner right-2 top-2 border-r border-t" />
      <span className="corner left-2 bottom-2 border-l border-b" />
      <span className="corner right-2 bottom-2 border-r border-b" />
    </>
  );
}

export function ProjectCard({ project }: { project: ProjectCardProps; index: number }) {
  const accent = ACCENT[project.color || 'default'] || ACCENT.default;
  const live = project.demo || project.playground;
  const href = live || project.code;
  const status = statusOf(project);

  // ── Featured (flagship) — full-width split layout ─────────────────────────
  if (project.flagship) {
    return (
      <div className={`group relative overflow-hidden rounded-xl border bg-[color-mix(in_srgb,var(--card)_82%,transparent)] backdrop-blur p-6 sm:p-7 transition-colors duration-200 border-cyan-500/40 ${accent}`}>
        <Chrome />
        <div className="relative z-10 grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-zinc-500">~/{project.id}</span>
              <span className="px-1.5 py-0.5 bg-cyan-500 text-black text-[9px] mono font-bold tracking-[0.2em] uppercase rounded-sm">Flagship</span>
            </div>
            <h3 className="font-display text-2xl sm:text-[1.7rem] font-semibold tracking-tight text-zinc-900 dark:text-white">
              {href ? (
                <a href={href} target="_blank" rel="noopener" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{project.name}</a>
              ) : project.name}
            </h3>
            <p className="text-[12px] mono text-cyan-700 dark:text-cyan-400/80">{project.tagline}</p>
            <p className="text-[13.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-prose">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.stack.map((tech) => (
                <TechBadge key={tech} label={tech} color={project.color} />
              ))}
            </div>
            <div className="pt-1"><Links p={project} /></div>
          </div>

          {/* faux process-monitor panel — honest fields */}
          <div className="mono text-[11px] rounded-lg border border-cyan-500/20 bg-black/[0.03] dark:bg-white/[0.02] p-4 space-y-2.5">
            <div className="flex items-center justify-between"><span className="text-zinc-500">status</span><span className="text-emerald-600 dark:text-emerald-400">{status.text}</span></div>
            <div className="flex items-center justify-between"><span className="text-zinc-500">role</span><span className="text-zinc-700 dark:text-zinc-300">sole engineer</span></div>
            <div className="flex items-center justify-between"><span className="text-zinc-500">stack</span><span className="text-zinc-700 dark:text-zinc-300">{project.stack.length} systems</span></div>
            <div className="flex items-center justify-between"><span className="text-zinc-500">extracted</span><span className="text-cyan-700 dark:text-cyan-400">anchor · tripwire</span></div>
            <div className="h-px bg-cyan-500/15" />
            <div className="text-zinc-500 leading-relaxed">// production patterns, hardened into OSS</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Standard card ─────────────────────────────────────────────────────────
  return (
    <div className={`group relative h-full overflow-hidden rounded-xl border bg-[color-mix(in_srgb,var(--card)_78%,transparent)] backdrop-blur p-5 transition-colors duration-200 border-[var(--border)] ${accent}`}>
      <Chrome />
      <div className="relative z-10 flex h-full flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="mono text-[10.5px] text-zinc-500">~/{project.id}</span>
          <span className={`mono text-[9.5px] tracking-wider ${status.cls}`}>{status.text}</span>
        </div>

        <h3 className="font-display text-[1.05rem] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {href ? (
            <a href={href} target="_blank" rel="noopener" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{project.name}</a>
          ) : project.name}
        </h3>

        <p className="text-[11px] mono text-cyan-700/80 dark:text-cyan-400/70 leading-snug">{project.tagline}</p>
        <p className="text-[12.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {project.stack.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} color={project.color} />
          ))}
        </div>

        <div className="mt-auto pt-2"><Links p={project} /></div>
      </div>
    </div>
  );
}
