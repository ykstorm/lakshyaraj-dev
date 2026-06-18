'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconBrandNpm } from '@tabler/icons-react';
import { Mail } from 'lucide-react';

const PROTOCOLS = [
  { id: 1, label: 'Email', value: 'raolakshyaraj@gmail.com', href: 'mailto:raolakshyaraj@gmail.com', icon: Mail },
  { id: 2, label: 'LinkedIn', value: 'linkedin.com/in/lakshyaraj-singh-rao-840273152', href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152', icon: IconBrandLinkedin },
  { id: 3, label: 'GitHub', value: 'github.com/ykstorm', href: 'https://github.com/ykstorm', icon: IconBrandGithub },
  { id: 4, label: 'npm', value: 'npmjs.com/~ykstormsorg', href: 'https://npmjs.com/~ykstormsorg', icon: IconBrandNpm },
];

export function TerminalContact() {
  const [selected, setSelected] = useState<number | null>(null);

  function open(num: number) {
    const p = PROTOCOLS.find((p) => p.id === num);
    if (!p) return;
    setSelected(num);
    if (p.href.startsWith('mailto:')) {
      window.location.href = p.href;
    } else {
      window.open(p.href, '_blank', 'noopener');
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      open(parseInt(e.key, 10));
    }
  }

  return (
    <div className="font-mono text-sm bg-zinc-50 dark:bg-[#0d0d0d] border border-zinc-300 dark:border-cyan-500/30 rounded-lg p-6 max-w-xl mx-auto">
      <div className="space-y-1 text-zinc-700 dark:text-zinc-300">
        <div>
          <span className="text-emerald-600 dark:text-green-400">user@lakshyaraj</span>
          <span className="text-zinc-400 dark:text-zinc-500">:~$</span>{' '}
          <span className="text-cyan-700 dark:text-cyan-400">connect --protocol=secure --auto-link</span>
        </div>
        <div className="text-zinc-500 pl-4">&gt; Establishing uplink to Lakshyaraj Singh Rao...</div>
        <div className="text-zinc-500 pl-4">&gt; Press [1-4] to open a channel:</div>
        {PROTOCOLS.map((p) => (
          <div key={p.id} className="pl-4 flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400">[{p.id}]</span>
            <span className="text-zinc-500 dark:text-zinc-400">{p.label}:</span>
            <a
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener"
              className={selected === p.id ? 'text-cyan-600 dark:text-cyan-400 underline' : 'text-cyan-700/90 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400'}
            >
              {p.value}
            </a>
          </div>
        ))}
        <div className="pl-4 flex items-center gap-2 pt-2">
          <span className="text-emerald-600 dark:text-green-400">user@lakshyaraj</span>
          <span className="text-zinc-400 dark:text-zinc-500">:~$</span>
          <span className="text-cyan-700 dark:text-cyan-400">select [1-4]:</span>
          <input
            type="text"
            inputMode="numeric"
            aria-label="Select a contact channel by number 1 to 4"
            onKeyDown={handleKey}
            className="bg-transparent border-none outline-none text-cyan-600 dark:text-cyan-400 w-8 caret-cyan-500"
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-cyan-600 dark:text-cyan-400"
          >
            ▋
          </motion.span>
        </div>
      </div>

      <noscript>
        <div className="pl-4 pt-2 flex flex-col gap-1">
          {PROTOCOLS.map((p) => (
            <a key={p.id} href={p.href} className="text-cyan-700 dark:text-cyan-400 underline">
              [{p.id}] {p.label}: {p.value}
            </a>
          ))}
        </div>
      </noscript>
    </div>
  );
}
