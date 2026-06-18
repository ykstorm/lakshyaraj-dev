'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

// Single light⇄dark button. The old 3-segment control (light/dark/system) was
// wider than the mobile nav allowed, so it clipped off-screen; one icon button
// always fits and reads unambiguously.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid place-items-center w-8 h-8 rounded-md border border-[var(--border)] text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
