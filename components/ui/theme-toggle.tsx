'use client';

import { useTheme } from 'next-themes';
import { IconMoon, IconSun } from '@tabler/icons-react';

// Single light⇄dark button. The old 3-segment control (light/dark/system) was
// wider than the mobile nav allowed, so it clipped off-screen; one icon button
// always fits and reads unambiguously.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // next-themes leaves resolvedTheme undefined until it has read the client's
  // preference, so this doubles as the hydration guard — no mount-effect needed,
  // which avoids a setState-in-effect cascade.
  if (!resolvedTheme) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid place-items-center w-8 h-8 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
    >
      {isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  );
}
