'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// false on the server and during hydration, true afterwards: the server
// snapshot is used while hydrating, so the first client render matches the HTML.
const noop = () => () => {};
const useMounted = () => useSyncExternalStore(noop, () => true, () => false);

// One light/dark button. The icon depends on the visitor's saved theme, which
// only the browser knows, so it appears after hydration. Rendering it during
// hydration made the server and client HTML disagree.
export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';
  const label = mounted ? (isDark ? 'Switch to light mode' : 'Switch to dark mode') : 'Switch colour theme';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={label}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {mounted && (isDark ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />)}
    </button>
  );
}
