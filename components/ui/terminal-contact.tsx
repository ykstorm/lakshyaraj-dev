'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { Mail, Globe } from 'lucide-react';

const PROTOCOLS = [
  { id: 1, label: 'Email', value: 'raolakshyaraj@gmail.com', href: 'mailto:raolakshyaraj@gmail.com', icon: Mail },
  { id: 2, label: 'LinkedIn', value: 'linkedin.com/in/lakshyaraj-singh-rao-840273152', href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152', icon: IconBrandLinkedin },
  { id: 3, label: 'GitHub', value: 'github.com/ykstorm', href: 'https://github.com/ykstorm', icon: IconBrandGithub },
  { id: 4, label: 'npm', value: 'npmjs.com/~ykstormsorg', href: 'https://npmjs.com/~ykstormsorg', icon: Globe },
];

export function TerminalContact() {
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState('');

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    const num = parseInt(input.trim());
    if (e.key === 'Enter') {
      const p = PROTOCOLS.find(p => p.id === num);
      if (p) {
        setSelected(num);
        setTimeout(() => window.open(p.href, '_blank'), 600);
      }
    }
  }

  return (
    <div className="font-mono text-sm bg-[#0d0d0d] border border-cyan-500/30 rounded-lg p-6 max-w-xl mx-auto">
      <div className="space-y-1 text-zinc-300">
        <div><span className="text-green-400">user@lakshyaraj</span><span className="text-zinc-500">:~$</span> <span className="text-cyan-400">connect --protocol=secure --auto-link</span></div>
        <div className="text-zinc-500 pl-4">&gt; Establishing uplink to Lakshyaraj Singh Rao...</div>
        <div className="text-zinc-500 pl-4">&gt; Available protocols detected: [1-4]</div>
        {PROTOCOLS.map(p => (
          <div key={p.id} className="pl-4 flex items-center gap-2">
            <span className="text-amber-400">[{p.id}]</span>
            <span className="text-zinc-400">{p.label}:</span>
            {selected === p.id ? (
              <a href={p.href} target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
                {p.value}
              </a>
            ) : (
              <span className="text-zinc-300">{p.value}</span>
            )}
          </div>
        ))}
        <div className="pl-4 flex items-center gap-2 pt-2">
          <span className="text-green-400">user@lakshyaraj</span><span className="text-zinc-500">:~$</span>
          <span className="text-cyan-400">Input selection [1-4]:</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="bg-transparent border-none outline-none text-cyan-400 w-8 caret-cyan-400"
            autoFocus
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-cyan-400"
          >▋</motion.span>
        </div>
      </div>
    </div>
  );
}