'use client';
import { IconBrandGithub, IconBrandNpm } from '@tabler/icons-react';
import { Globe } from 'lucide-react';
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
  color?: string;
  flagship?: boolean;
  index: number;
}

const ACCENT_COLORS: Record<string, string> = {
  cyan: 'border-cyan-500/40 hover:border-cyan-400',
  amber: 'border-amber-500/40 hover:border-amber-400',
  green: 'border-green-500/40 hover:border-green-400',
  red: 'border-red-500/40 hover:border-red-400',
  purple: 'border-purple-500/40 hover:border-purple-400',
  pink: 'border-pink-500/40 hover:border-pink-400',
  default: 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400',
};

export function ProjectCard({ project }: { project: ProjectCardProps; index: number }) {
  const accent = ACCENT_COLORS[project.color || 'default'] || ACCENT_COLORS.default;
  const live = project.demo || project.playground;

  return (
    <div
      className={`
        group relative h-full border rounded-xl p-5
        bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur
        transition-colors duration-200
        ${accent}
        ${project.flagship ? 'ring-1 ring-cyan-500/30' : ''}
      `}
    >
      {project.flagship && (
        <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-cyan-500 text-black text-[10px] font-mono font-bold tracking-widest uppercase">
          Flagship
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
          {live ? (
            <a href={live} target="_blank" rel="noopener" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              {project.name}
            </a>
          ) : project.code ? (
            <a href={project.code} target="_blank" rel="noopener" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>

        <p className="text-[11px] font-mono text-cyan-700/80 dark:text-cyan-400/70">{project.tagline}</p>
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} color={project.color} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono">
          {live && (
            <a href={live} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <Globe className="w-3 h-3" /> Live
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <IconBrandGithub className="w-3 h-3" /> Code
            </a>
          )}
          {project.npm && (
            <a href={`https://npmjs.com/package/${project.npm}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <IconBrandNpm className="w-3 h-3" /> npm
            </a>
          )}
        </div>
      </div>

      {/* Mechanical corner accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-b border-l border-inherit rounded-bl opacity-30 group-hover:opacity-60 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-t border-r border-inherit rounded-tr opacity-30 group-hover:opacity-60 transition-opacity" />
    </div>
  );
}
