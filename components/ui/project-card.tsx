'use client';
import { IconBrandGithub, IconBrandNpm, IconWorld, IconTerminal2 } from '@tabler/icons-react';
import { TechBadge } from '@/components/ui/tech-badge';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  demo?: string;
  playground?: string;
  code?: string;
  npm?: string;
  secondary?: boolean;
}

// shared link row
function Links({ p }: { p: Project }) {
  const live = p.demo || p.playground;
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] mono text-zinc-500">
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <IconWorld className="w-3 h-3" /> live
        </a>
      )}
      {p.playground && p.playground !== p.demo && (
        <a href={p.playground} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <IconTerminal2 className="w-3 h-3" /> playground
        </a>
      )}
      {p.code && (
        <a href={p.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <IconBrandGithub className="w-3 h-3" /> code
        </a>
      )}
      {p.npm && (
        <a href={`https://npmjs.com/package/${p.npm}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          <IconBrandNpm className="w-3.5 h-3.5" /> npm
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project; index: number }) {
  const live = project.demo || project.playground;
  const href = live || project.code;

  return (
    <div className="group relative h-full overflow-hidden rounded-xl border border-[var(--border)] p-5 transition-colors duration-200 hover:border-amber-500/50">
      <div className="relative z-10 flex h-full flex-col space-y-3">
        <span className="mono text-[10.5px] text-zinc-500">~/{project.id}</span>

        <h3 className="font-display text-[1.2rem] tracking-tight text-zinc-900 dark:text-zinc-100">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{project.name}</a>
          ) : project.name}
        </h3>

        <p className="text-[12.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {project.stack.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>

        <div className="mt-auto pt-2"><Links p={project} /></div>
      </div>
    </div>
  );
}
