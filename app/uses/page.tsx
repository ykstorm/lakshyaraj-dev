import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uses — Lakshyaraj Singh Rao',
  description: 'The tools, hardware, and stack I actually use.',
};

const SECTIONS: { label: string; items: string[] }[] = [
  {
    label: 'Editor',
    items: [
      'Cursor (a VS Code fork) on Windows + WSL Ubuntu',
      'Vim keybinds',
      'Tailwind IntelliSense',
    ],
  },
  {
    label: 'Terminal',
    items: [
      'Windows Terminal + WSL Ubuntu',
      'zsh with powerlevel10k',
      'fzf, ripgrep, tmux',
    ],
  },
  {
    label: 'Languages',
    items: [
      'TypeScript daily',
      'Python when a library forces it',
      'Bash for ops',
      'a little Go for stackup',
    ],
  },
  {
    label: 'Backend',
    items: [
      'Node 20',
      'Express where simple wins',
      'Hono for edge',
      'Prisma 7 on Postgres',
      'BullMQ on Redis',
      'pgvector',
    ],
  },
  {
    label: 'AI stack',
    items: [
      'OpenAI gpt-4o',
      'Anthropic Claude',
      'llama.cpp local',
      'text-embedding-3-small / bge-large',
    ],
  },
  {
    label: 'Infra',
    items: [
      'Docker',
      'Kubernetes via kind locally / k3s on Hetzner',
      'ArgoCD + Argo Rollouts',
      'Terraform',
      'Vercel',
    ],
  },
  {
    label: 'Observability',
    items: ['Sentry', 'Prometheus + Grafana', 'Loki', 'Tempo'],
  },
  {
    label: 'Day-job tools',
    items: [
      'GitHub',
      'Linear',
      'Notion',
      'Slack',
      'Figma (read)',
      'Cursor + Claude Code',
      'Hermes (my own scheduled task runner)',
    ],
  },
  {
    label: 'Hardware',
    items: [
      'Lenovo Yoga 7 (Ryzen 7, 16GB)',
      'WSL Ubuntu',
      'Sennheiser HD 560S',
    ],
  },
];

export default function UsesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-800 dark:text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="text-[12px] font-mono text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide"
        >
          ← back
        </Link>

        <div className="mt-8 mb-10">
          <span className="section-label">{'// Uses'}</span>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">What I use</h1>
          <p className="mt-2 text-[13px] text-zinc-500 font-mono">
            The actual stack, not an aspirational one.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {SECTIONS.map((section) => (
            <section key={section.label} className="telemetry-card space-y-3">
              <span className="section-label text-[10px]">{section.label}</span>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                    <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
