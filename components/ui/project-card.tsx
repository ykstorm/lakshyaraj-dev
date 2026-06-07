'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { ExternalLink, Globe } from 'lucide-react';
import { TechBadge } from '@/components/ui/tech-badge';

interface ProjectCardProps {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  demo?: string;
  code?: string;
  npm?: string;
  color?: string;
  flagship?: boolean;
  index: number;
}

const ACCENT_COLORS: Record<string, string> = {
  cyan: 'border-cyan-500/50 hover:border-cyan-400',
  amber: 'border-amber-500/50 hover:border-amber-400',
  green: 'border-green-500/50 hover:border-green-400',
  red: 'border-red-500/50 hover:border-red-400',
  purple: 'border-purple-500/50 hover:border-purple-400',
  pink: 'border-pink-500/50 hover:border-pink-400',
  default: 'border-zinc-600 hover:border-zinc-400',
};

export function ProjectCard({ project, index }: { project: ProjectCardProps; index: number }) {
  const accent = ACCENT_COLORS[project.color || 'default'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015 }}
      className={`
        group relative border rounded-xl p-5
        bg-zinc-950/60 dark:bg-zinc-950/60
        dark:bg-[#0a0a0a]/60 backdrop-blur
        transition-all duration-200
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-zinc-100 tracking-tight group-hover:text-white transition-colors">
            {project.name}
          </h3>
          <div className="flex gap-1.5 flex-shrink-0">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener" aria-label="Live demo">
                <Globe className="w-3.5 h-3.5 text-zinc-500 hover:text-cyan-400 transition-colors" />
              </a>
            )}
            {project.code && (
              <a href={project.code} target="_blank" rel="noopener" aria-label="Source code">
                <IconBrandGithub className="w-3.5 h-3.5 text-zinc-500 hover:text-cyan-400 transition-colors" />
              </a>
            )}
          </div>
        </div>

        <p className="text-[11px] font-mono text-cyan-400/70">{project.tagline}</p>
        <p className="text-[13px] text-zinc-400 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.map(tech => (
            <TechBadge key={tech} label={tech} color={project.color} />
          ))}
        </div>

        {project.npm && (
          <div className="pt-1">
            <span className="text-[10px] font-mono text-zinc-600">npm: </span>
            <span className="text-[10px] font-mono text-zinc-400">{project.npm}</span>
          </div>
        )}
      </div>

      {/* Mechanical corner accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-b border-l border-inherit rounded-bl opacity-30 group-hover:opacity-60 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-t border-r border-inherit rounded-tr opacity-30 group-hover:opacity-60 transition-opacity" />
    </motion.div>
  );
}