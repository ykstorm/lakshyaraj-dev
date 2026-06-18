'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TerminalHero } from '@/components/ui/terminal-hero';
import { AsciiBackground } from '@/components/ui/ascii-background';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { ProjectCard } from '@/components/ui/project-card';
import { TechBadge } from '@/components/ui/tech-badge';
import { TerminalContact } from '@/components/ui/terminal-contact';
import { ResumeButton } from '@/components/ui/resume-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { IconBrandGithub, IconBrandLinkedin, IconBrandNpm } from '@tabler/icons-react';
import { Mail, ExternalLink } from 'lucide-react';
import projectsData from '@/data/projects.json';
import nowData from '@/data/now.json';

// ── Section wrapper ─────────────────────────────────────────────────────────
function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <span className="section-label">{label}</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        {children}
      </div>
    </section>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      <AsciiBackground />
      <div className="relative z-10 space-y-6 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="mono text-[11px] text-cyan-700 dark:text-cyan-400 tracking-[0.28em] uppercase opacity-80">
            // initialize
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-4xl sm:text-5xl md:text-[3.4rem] font-semibold text-zinc-900 dark:text-white tracking-tight leading-[1.05]"
        >
          Lakshyaraj Singh&nbsp;Rao
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mono tracking-tight"
        >
          Backend Engineer · AI Infrastructure · Full-Stack · DevOps
        </motion.p>

        {/* Dynamic terminal: client typewriter + server <noscript> fallback */}
        <div className="pt-2">
          <TerminalHero />
          <noscript>
            <div className="term-window w-full max-w-xl mx-auto p-4 text-left text-[13px] space-y-2">
              <div><span className="text-emerald-600 dark:text-emerald-400">lakshyaraj@dev:~$ </span>whoami
                <div className="text-zinc-600 dark:text-zinc-400">Backend Engineer · AI Infrastructure · DevOps</div></div>
              <div><span className="text-emerald-600 dark:text-emerald-400">lakshyaraj@dev:~$ </span>cat focus.txt
                <div className="text-zinc-600 dark:text-zinc-400">Anvil — webhook→BullMQ pipeline</div></div>
              <div><span className="text-emerald-600 dark:text-emerald-400">lakshyaraj@dev:~$ </span>ls ~/projects
                <div className="text-zinc-600 dark:text-zinc-400">anchor tripwire goldset quickdraw stackup codecraft anvil</div></div>
              <div><span className="text-emerald-600 dark:text-emerald-400">lakshyaraj@dev:~$ </span>status
                <div className="text-zinc-600 dark:text-zinc-400">Open to backend / AI-infra roles</div></div>
            </div>
          </noscript>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-5 justify-center items-center pt-2"
        >
          {[
            { href: 'mailto:raolakshyaraj@gmail.com', label: 'email', icon: Mail },
            { href: 'https://github.com/ykstorm', label: 'github', icon: IconBrandGithub },
            { href: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152', label: 'linkedin', icon: IconBrandLinkedin },
            { href: 'https://npmjs.com/~ykstormsorg', label: 'npm', icon: IconBrandNpm },
            { href: '/resume', label: 'resume', icon: ExternalLink },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener"
              className="flex items-center gap-1.5 text-[12px] mono text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="pt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-500/40 rounded-full text-[11px] mono text-cyan-700 dark:text-cyan-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            Mumbai · Remote · Open to opportunities
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <Section id="about" label="// About">
      <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          I build backend and AI-infrastructure systems and ship them to production. Right now I&apos;m solo on{' '}
          <a href="https://homesty.ai" target="_blank" rel="noopener" className="text-cyan-700 dark:text-cyan-400 hover:underline">
            homesty.ai
          </a>
          , a commission-driven real-estate advisor running on Next.js, pgvector, and a refusal-first retrieval layer.
        </p>
        <p>
          The reliability patterns I needed there became open source: Anchor (RAG that refuses instead of hallucinating),
          Tripwire (mid-stream LLM guardrails), and Anvil (an idempotent webhook → BullMQ pipeline with dead-letter replay).
          Same engine, made public.
        </p>
        <p>
          I care about the unglamorous parts — constant-time HMAC verification, backoff schedules, golden-dataset evals
          that block a merge on regression. I&apos;m open to backend / AI-infra roles and contract work on RAG, streaming
          LLMs, and queue/webhook reliability.
        </p>
      </div>
    </Section>
  );
}

// ── Now / Mission Status ──────────────────────────────────────────────────────
function NowSection() {
  return (
    <Section id="now" label="// Mission Status">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="telemetry-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            <span className="section-label text-[10px]">Currently</span>
          </div>
          <p className="mono text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">{nowData.currently}</p>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Shipped this week</span>
          <ul className="space-y-2">
            {nowData.shipped_this_week.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">›</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Next up</span>
          <ul className="space-y-2">
            {nowData.next_up.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">›</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Open to</span>
          <ul className="space-y-2">
            {nowData.open_to.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                <span className="text-green-600 dark:text-green-400 mt-0.5">›</span><span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <span className="section-label text-[10px]">Location</span>
            <p className="mono text-sm text-zinc-700 dark:text-zinc-300 mt-1">{nowData.location}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const projects = projectsData as any[];
  const flagship = projects.find((p) => p.flagship);
  const others = projects.filter((p) => !p.flagship);

  const items = others.map((project, i) => ({
    id: project.id,
    content: <ProjectCard key={project.id} project={project} index={i} />,
  }));

  return (
    <Section id="projects" label="// System Architectures">
      {flagship && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <ProjectCard project={flagship} index={0} />
        </motion.div>
      )}
      <HoverEffect items={items} />
    </Section>
  );
}

// ── Technical Arsenal ─────────────────────────────────────────────────────────
const STACK = {
  Languages: ['TypeScript', 'Python', 'SQL', 'Bash', 'YAML', 'Go (learning)'],
  'Backend/Data': ['Node.js', 'Next.js 15', 'Postgres', 'pgvector', 'Prisma 7', 'Redis', 'BullMQ'],
  'Infra/AI': ['Docker', 'Kubernetes', 'ArgoCD', 'Helm', 'GPT-4o', 'Claude', 'Ollama', 'vLLM'],
};

function StackSection() {
  return (
    <Section id="stack" label="// Technical Arsenal">
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(STACK).map(([category, items]) => (
          <div key={category} className="telemetry-card space-y-4">
            <span className="section-label text-[10px]">{category}</span>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <TechBadge key={item} label={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Live Telemetry ────────────────────────────────────────────────────────────
function TelemetrySection() {
  const [npmVersions, setNpmVersions] = useState<Record<string, string>>({});
  const [ghContribs, setGhContribs] = useState(0);

  useEffect(() => {
    fetch('/api/npm-versions').then((r) => r.json()).then((d) => setNpmVersions(d)).catch(() => {});
    fetch('/api/github-activity').then((r) => r.json()).then((d) => setGhContribs(d.total || 0)).catch(() => {});
  }, []);

  return (
    <Section id="telemetry" label="// Live Telemetry">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: '@ykstormsorg/tripwire', value: npmVersions['@ykstormsorg/tripwire'] || '…' },
          { label: '@ykstormsorg/goldset', value: npmVersions['@ykstormsorg/goldset'] || '…' },
          { label: '@ykstormsorg/quickdraw', value: npmVersions['@ykstormsorg/quickdraw'] || '…' },
          { label: 'GitHub contributions (30d)', value: ghContribs > 0 ? String(ghContribs) : '…' },
          { label: 'Timezone', value: 'IST (UTC+5:30)' },
          { label: 'Status', value: 'Available' },
        ].map(({ label, value }) => (
          <div key={label} className="telemetry-card">
            <p className="mono text-[10px] text-zinc-500 dark:text-zinc-600 mb-1 truncate">{label}</p>
            <p className="mono text-sm text-cyan-700 dark:text-cyan-400">{value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <Section id="contact" label="// Establish Connection">
      <div className="space-y-8">
        <TerminalContact />
        <div className="flex justify-center">
          <ResumeButton href="/resume" />
        </div>
      </div>
    </Section>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const links = [
    { href: '/#about', label: 'About' },
    { href: '/#now', label: 'Now' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#stack', label: 'Stack' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          lakshyaraj<span className="text-cyan-600 dark:text-cyan-400">/</span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] mono text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tracking-wide"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  // Sections render unconditionally so all content (projects, copy) is present
  // in server-rendered HTML — crawlers, link unfurls, and no-JS visitors see it.
  // The hero terminal degrades to a <noscript> static transcript.
  return (
    <div className="relative min-h-screen text-zinc-800 dark:text-zinc-100">
      {/* fixed atmosphere: grid + scanlines + drifting phosphor glow */}
      <div className="terminal-bg" aria-hidden="true">
        <div className="phosphor-glow" />
      </div>

      <Nav />
      <main className="pt-14">
        <Hero />
        <AboutSection />
        <NowSection />
        <ProjectsSection />
        <StackSection />
        <TelemetrySection />
        <ContactSection />
        <footer className="border-t border-[var(--border)] py-8 text-center">
          <p className="mono text-[11px] text-zinc-500 dark:text-zinc-600">
            © {new Date().getFullYear()} Lakshyaraj Singh Rao · Apache 2.0
          </p>
        </footer>
      </main>
    </div>
  );
}
