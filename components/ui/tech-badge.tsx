'use client';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface TechBadgeProps {
  label: string;
  color?: string;
}

const COLOR_MAP: Record<string, string> = {
  cyan: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
  amber: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  green: 'border-green-500/40 text-green-400 bg-green-500/10',
  red: 'border-red-500/40 text-red-400 bg-red-500/10',
  purple: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  pink: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
  default: 'border-zinc-500/40 text-zinc-300 bg-zinc-500/10',
};

export function TechBadge({ label, color = 'default' }: TechBadgeProps) {
  const cls = COLOR_MAP[color] || COLOR_MAP.default;
  return (
    <Badge className={`font-mono text-[10px] tracking-wider border ${cls}`}>
      {label}
    </Badge>
  );
}