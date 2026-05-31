'use client';

import { useState, useEffect } from 'react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Rss, Mail, ExternalLink, Terminal, Zap, Shield, Layers, Cloud, Box
} from 'lucide-react';
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconBrandNpm } from '@tabler/icons-react';
import projectsData from '@/data/projects.json';

// ── ASCII Boot ───────────────────────────────────────────────────────────────
function AsciiBoot({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);
  const lines = [
    '[booting lakshyaraj.dev v1...]',
    '[loading 6 projects ████████████ 100%]',
    '[fetching live npm versions ██████░░░░  60%]',
    '[ready.]',
  ];

  useEffect(() => {
    if (line < lines.length) {
      const t = setTimeout(() => setLine(line + 1), line === 0 ? 200 : 350);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [line, onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center font-mono text-sm">
      <div className="space-y-1 text-cyan-400">
        {lines.slice(0, line).map((l, i) => (
          <div key={i} className="opacity-60">{l}</div>
        ))}
        {line < lines.length && <div className="animate-pulse">{lines[line]}<span className="ml-1">▋</span></div>}
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <AuroraBackground className="opacity-40">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-2"
          >
            <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">Full-Stack Engineer</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 flex items-center justify-center gap-3"
          >
            Lakshyaraj Singh Rao
            <svg viewBox="0 0 22 22" className="w-8 h-8 text-cyan-400 flex-shrink-0" fill="currentColor">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.447-.47-1.014-.75-1.64-.8-.015-.007-.029-.014-.044-.02A21.767 21.767 0 0011 .054V.007a22.14 22.14 0 00-.246.037C7.645.068 7.07.3 6.624.517a4.136 4.136 0 00-.882 1.687 4.64 4.64 0 00-.14 1.897c.084.633.215 1.252.4 1.836.185.584.468 1.142.84 1.656-.17.437-.28.915-.28 1.413 0 .498.11.976.28 1.413-.372.514-.655 1.072-.84 1.656-.185.584-.316 1.203-.4 1.836-.13.633-.083 1.29.14 1.897.112.469.438.953.882 1.687.445.469 1.014.749 1.64.8.015.007.029.013.044.02a21.96 21.96 0 004.07 0c.015-.007.029-.013.044-.02.626-.051 1.195-.331 1.64-.8.445-.734.77-1.218.882-1.687.223-.607.083-1.264-.14-1.897.372-.514.655-1.072.84-1.656.185-.584.316-1.203.4-1.836.13-.633.083-1.29-.14-1.897-.112-.469-.438-.953-.882-1.687-.445-.47-1.014-.75-1.64-.8a.645.645 0 01-.044-.02c.87-.206 1.72-.507 2.536-.895.015-.007.029-.013.044-.02a21.96 21.96 0 004.07 0c.015.007.029.013.044.02a6.47 6.47 0 011.747.268z"/>
            </svg>
          </motion.h1>
          <TextGenerateEffect
            words="Full-Stack Engineer · AI Systems · Backend · DevOps"
            className="text-lg md:text-xl text-zinc-400 text-center mb-4 max-w-2xl mx-auto"
            delay={0.6}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="text-sm text-zinc-500 mb-10"
          >
            Building observable, provenance-grounded AI systems. Mumbai → Remote.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex gap-4 justify-center"
          >
            <Link href="#projects" className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition font-medium text-white text-sm">
              View Projects
            </Link>
            <Link href="mailto:raolakshyaraj@gmail.com" className="px-6 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition font-medium text-zinc-300 text-sm">
              Get in touch
            </Link>
          </motion.div>
        </div>
      </AuroraBackground>
      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 animate-bounce"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// ── Now Widget ───────────────────────────────────────────────────────────────
function NowWidget() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/api/now').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  return (
    <section className="py-20 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">/now</span>
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-zinc-600">live</span>
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 space-y-5">
            {data && (
              <>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Currently</p>
                  <p className="text-sm text-zinc-200">{(data as Record<string, unknown>).currently as string}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Shipped this week</p>
                  <ul className="space-y-1">
                    {((data as Record<string, unknown>).shipped_this_week as string[]).map((item, i) => (
                      <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                        <span className="text-cyan-500 mt-0.5">›</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500">Next: </span>
                    <span className="text-zinc-300">{((data as Record<string, unknown>).next_up as string[])[0]}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Open to: </span>
                    <span className="text-zinc-300">{((data as Record<string, unknown>).open_to as string[]).join(', ')}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600">Updated {String((data as Record<string, unknown>).updated_at)}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ── Projects ─────────────────────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  cyan: 'border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/20',
  red: 'border-red-500/50 hover:border-red-400 bg-red-950/20',
  green: 'border-green-500/50 hover:border-green-400 bg-green-950/20',
  amber: 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20',
  purple: 'border-purple-500/50 hover:border-purple-400 bg-purple-950/20',
  pink: 'border-pink-500/50 hover:border-pink-400 bg-pink-950/20',
};

const iconMap: Record<string, React.ReactNode> = {
  anchor: <Layers size={16} />,
  tripwire: <Shield size={16} />,
  goldset: <Zap size={16} />,
  quickdraw: <Terminal size={16} />,
  stackup: <Cloud size={16} />,
  codecraft: <Box size={16} />,
};

function ProjectCard({ project }: { project: Record<string, unknown> }) {
  const [hovered, setHovered] = useState(false);
  const color = (project.color as string) || 'cyan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-xl border p-5 transition-all duration-300 ${colorMap[color]} ${hovered ? 'scale-[1.02] shadow-lg' : ''}`}
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-${color}-400`}>{iconMap[project.id as string]}</span>
          <h3 className="font-semibold text-white text-base">{project.name as string}</h3>
        </div>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            {(project.code as string) && (
              <a href={project.code as string} target="_blank" rel="noopener" className="text-zinc-400 hover:text-white">
                <IconBrandGithub size={14} />
              </a>
            )}
            {(project.demo as string) && (
              <a href={project.demo as string} target="_blank" rel="noopener" className="text-zinc-400 hover:text-white">
                <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        )}
      </div>
      <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{project.tagline as string}</p>
      <div className="flex flex-wrap gap-1.5">
        {(project.stack as string[]).map((tech: string) => (
          <Badge key={tech} variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">{tech}</Badge>
        ))}
      </div>
      {hovered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-zinc-500 mt-3 leading-relaxed"
        >
          {project.description as string}
        </motion.p>
      )}
    </motion.div>
  );
}

function ProjectsSection() {
  const [projects] = useState<Record<string, unknown>[]>(projectsData as Record<string, unknown>[]);

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
        <p className="text-sm text-zinc-500 mb-8">AI systems, platform tooling, and developer infrastructure.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.id as string} project={p} />)}
        </div>
      </div>
    </section>
  );
}

// ── Stack ────────────────────────────────────────────────────────────────────
const stackItems = [
  { category: 'Languages', items: ['TypeScript', 'Python', 'Rust', 'Go'] },
  { category: 'Frontend', items: ['Next.js', 'React', 'Tailwind', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'Postgres', 'Redis', 'Prisma'] },
  { category: 'Infra', items: ['Docker', 'Kubernetes', 'Terraform', 'ArgoCD'] },
  { category: 'AI', items: ['OpenAI', 'Anthropic', 'pgvector', 'Ollama'] },
];

function StackSection() {
  return (
    <section className="py-16 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Stack</h2>
        <p className="text-sm text-zinc-500 mb-8">Tools I build with.</p>
        <div className="space-y-4">
          {stackItems.map(({ category, items }) => (
            <div key={category}>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span key={item} className="px-3 py-1.5 rounded-full border border-zinc-800 text-xs text-zinc-400 bg-zinc-900 hover:border-zinc-600 transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Activity ─────────────────────────────────────────────────────────────────
function ActivitySection() {
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [activity, setActivity] = useState<{total: number, contributions: {date: string, count: number}[]}>({ total: 0, contributions: [] });

  useEffect(() => {
    fetch('/api/npm-versions').then(r => r.json()).then(setVersions).catch(() => {});
    fetch('/api/github-activity').then(r => r.json()).then(setActivity).catch(() => {});
  }, []);

  const maxCount = Math.max(...activity.contributions.map(c => c.count), 1);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Live Activity</h2>
        <p className="text-sm text-zinc-500 mb-6">{activity.total.toLocaleString()} contributions this year.</p>

        {/* npm versions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {['goldset', 'quickdraw', 'tripwire'].map(pkg => (
            <Card key={pkg} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconBrandNpm size={14} className="text-red-400" />
                    <span className="text-xs text-zinc-400 font-mono">@{pkg}</span>
                  </div>
                <Badge variant="outline" className="text-cyan-400 border-cyan-900 text-[10px]">
                  {versions[pkg] || '...'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* contribution graph */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-600 mb-3">Last 30 days</p>
          <div className="flex flex-wrap gap-1">
            {activity.contributions.map((c, i) => {
              const intensity = c.count / maxCount;
              const bg = c.count === 0 ? 'bg-zinc-800' : `bg-cyan-${Math.max(400, Math.round(900 - intensity * 500))}`;
              return (
                <div
                  key={i}
                  title={`${c.date}: ${c.count}`}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: c.count === 0 ? '#1c1c1c' : `hsl(${185 - intensity * 40}, 80%, ${30 + intensity * 40}%)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Writing ──────────────────────────────────────────────────────────────────
const stubPosts = [
  { slug: 'tripwire', title: 'Building Tripwire: Mid-Stream LLM Safety', topic: 'LLM Safety', status: 'Coming soon' },
  { slug: 'anchor', title: 'Anchor: Provenance-First RAG Architecture', topic: 'RAG', status: 'Coming soon' },
  { slug: 'quickdraw', title: 'Quickdraw: Benchmarking LLM Streaming Performance', topic: 'AI Infra', status: 'Coming soon' },
];

function WritingSection() {
  return (
    <section className="py-16 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Writing</h2>
        <p className="text-sm text-zinc-500 mb-6">Technical deep-dives on AI systems, platform engineering, and tooling.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stubPosts.map(post => (
            <Card key={post.slug} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
              <CardContent className="p-4">
                <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 mb-2">{post.topic}</Badge>
                <h3 className="text-sm font-medium text-zinc-200 mb-3">{post.title}</h3>
                <span className="text-xs text-cyan-500">{post.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Connect ───────────────────────────────────────────────────────────────────
const connectLinks = [
  { href: 'mailto:raolakshyaraj@gmail.com', icon: Mail, label: 'Email' },
  { href: 'https://github.com/ykstorm', icon: IconBrandGithub, label: 'GitHub' },
  { href: 'https://www.npmjs.com/~ykstormsorg', icon: IconBrandNpm, label: 'npm' },
  { href: 'https://linkedin.com/in/lakshyaraj', icon: IconBrandLinkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com/ykstorm', icon: IconBrandTwitter, label: 'X / Twitter' },
  { href: '/rss.xml', icon: Rss, label: 'RSS' },
];

function ConnectSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Connect</h2>
        <p className="text-sm text-zinc-500 mb-8">Open to backend platform roles and AI infra contracts.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {connectLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white text-sm"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('boot-done')) {
      setBooting(false);
    }
  }, []);

  const handleBootDone = () => {
    sessionStorage.setItem('boot-done', '1');
    setBooting(false);
  };

  return (
    <>
      <AnimatePresence>{booting && <AsciiBoot onDone={handleBootDone} />}</AnimatePresence>
      {!booting && (
        <>
          <Hero />
          <NowWidget />
          <ProjectsSection />
          <StackSection />
          <ActivitySection />
          <WritingSection />
          <ConnectSection />
        </>
      )}
    </>
  );
}
