'use client';

// Contact, as a second small terminal. Each line is a normal link; with the
// window focused, the number keys 1 to 4 open the matching one.
import { useState } from 'react';

const CHANNELS = [
  { key: '1', label: 'Email', value: 'raolakshyaraj@gmail.com', href: 'mailto:raolakshyaraj@gmail.com' },
  { key: '2', label: 'LinkedIn', value: 'linkedin.com/in/lakshyaraj-singh-rao-840273152', href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152' },
  { key: '3', label: 'GitHub', value: 'github.com/ykstorm', href: 'https://github.com/ykstorm' },
  { key: '4', label: 'npm', value: 'npmjs.com/~ykstormsorg', href: 'https://www.npmjs.com/~ykstormsorg' },
];

export function TerminalContact() {
  const [opened, setOpened] = useState<string | null>(null);

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const ch = CHANNELS.find((c) => c.key === e.key);
    if (!ch) return;
    e.preventDefault();
    setOpened(ch.key);
    if (ch.href.startsWith('mailto:')) window.location.href = ch.href;
    else window.open(ch.href, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Contact. Press 1 to 4 to open a channel."
      className="term-window max-w-2xl text-[12.5px] leading-relaxed sm:text-[13px]"
    >
      <div className="term-titlebar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="ml-2 text-[11px] text-muted-foreground">contact</span>
      </div>
      <div className="space-y-1 p-5">
        <div className="whitespace-pre-wrap break-words">
          <span className="text-accent">lakshyaraj@portfolio:~$ </span>
          <span className="text-foreground">contact</span>
        </div>
        {CHANNELS.map((c) => (
          <div key={c.key} className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-accent">[{c.key}]</span>
            <span className="w-16 text-muted-foreground">{c.label}</span>
            <a
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`break-all underline-offset-4 hover:text-accent hover:underline ${opened === c.key ? 'text-accent underline' : 'text-foreground'}`}
            >
              {c.value}
            </a>
          </div>
        ))}
        <div className="pt-2 text-muted-foreground">Press 1 to 4 to open one, or click it.</div>
      </div>
    </div>
  );
}
