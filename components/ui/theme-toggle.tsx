'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[68px] h-[28px]" />;

  const items = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex gap-0.5 border border-zinc-700 dark:border-zinc-700 rounded-lg p-0.5 bg-zinc-900/50">
      {items.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded transition-all duration-150 ${
            theme === value
              ? 'bg-cyan-500 text-black'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}