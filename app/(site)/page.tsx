'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BinaryBackground } from '@/components/ui/binary-background';
import { AsciiBoot } from '@/components/ui/ascii-boot';
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
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        {children}
      </div>
    </section>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onBootDone }: { onBootDone: () => void }) {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('lakshyaraj-boot');
    if (hasBooted) {
      setShowBoot(false);
      onBootDone();
    }
  }, [onBootDone]);

  function handleBootDone() {
    sessionStorage.setItem('lakshyaraj-boot', '1');
    setShowBoot(false);
    onBootDone();
  }

  return (
    <>
      {showBoot && <AsciiBoot onDone={handleBootDone} />}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <BinaryBackground />
        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="text-[11px] font-mono text-cyan-400 tracking-[0.25em] uppercase opacity-70">
              // Identify
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight"
          >
            Lakshyaraj Singh Rao
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-base sm:text-lg text-zinc-400 font-mono"
          >
            Backend Engineer · AI Infrastructure · Full-Stack · DevOps
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-sm text-zinc-500 max-w-xl mx-auto"
          >
            I ship production AI systems. Currently solo on{' '}
            <a href="https://homesty.ai" target="_blank" rel="noopener" className="text-cyan-400 hover:underline">
              homesty.ai
            </a>
            {' '}— patterns extracted to OSS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap gap-5 justify-center items-center pt-2"
          >
            {[
              { href: 'mailto:raolakshyaraj@gmail.com', label: 'email', icon: Mail },
              { href: 'https://github.com/ykstorm', label: 'github', icon: IconBrandGithub },
              { href: 'https://linkedin.com/in/lakshyaraj', label: 'linkedin', icon: IconBrandLinkedin },
              { href: 'https://npmjs.com/~ykstormsorg', label: 'npm', icon: IconBrandNpm },
              { href: '/Lakshyaraj_Singh_Rao_Resume.pdf', label: 'resume', icon: ExternalLink, isResume: true },
            ].map(({ href, label, icon: Icon, isResume }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener"
                className="flex items-center gap-1.5 text-[12px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors tracking-wide"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-500/30 rounded-full text-[11px] font-mono text-cyan-400/70">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Remote · IST · Open to opportunities
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

// ── Now / Mission Status ──────────────────────────────────────────────────────
function NowSection() {
  return (
    <Section id="now" label="// Mission Status">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="telemetry-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="section-label text-[10px]">Currently</span>
          </div>
          <p className="font-mono text-sm text-zinc-200 leading-relaxed">
            {nowData.currently}
          </p>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Shipped this week</span>
          <ul className="space-y-2">
            {nowData.shipped_this_week.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400">
                <span className="text-cyan-400 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Next up</span>
          <ul className="space-y-2">
            {nowData.next_up.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400">
                <span className="text-amber-400 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="telemetry-card space-y-4">
          <span className="section-label text-[10px]">Open to</span>
          <ul className="space-y-2">
            {nowData.open_to.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-400">
                <span className="text-green-400 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <span className="section-label text-[10px]">Location</span>
            <p className="font-mono text-sm text-zinc-300 mt-1">{nowData.location}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const projects = projectsData as any[];
  const flagship = projects.find(p => p.flagship);
  const others = projects.filter(p => !p.flagship);
  const sorted = flagship ? [flagship, ...others] : others;

  return (
    <Section id="projects" label="// System Architectures">
      <div className="grid md:grid-cols-2 gap-5">
        {sorted.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
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
              {items.map(item => (
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
    fetch('/api/npm-versions')
      .then(r => r.json())
      .then(d => setNpmVersions(d))
      .catch(() => {});
    fetch('/api/github-activity')
      .then(r => r.json())
      .then(d => setGhContribs(d.total || 0))
      .catch(() => {});
  }, []);

  return (
    <Section id="telemetry" label="// Live Telemetry">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: '@ykstormsorg/tripwire', value: npmVersions['@ykstormsorg/tripwire'] || '...' },
          { label: '@ykstormsorg/goldset', value: npmVersions['@ykstormsorg/goldset'] || '...' },
          { label: '@ykstormsorg/quickdraw', value: npmVersions['@ykstormsorg/quickdraw'] || '...' },
          { label: 'GitHub contributions (30d)', value: ghContribs > 0 ? String(ghContribs) : '...' },
          { label: 'Timezone', value: 'IST (UTC+5:30)' },
          { label: 'Status', value: 'Available' },
        ].map(({ label, value }) => (
          <div key={label} className="telemetry-card">
            <p className="font-mono text-[10px] text-zinc-600 mb-1 truncate">{label}</p>
            <p className="font-mono text-sm text-cyan-400">{value}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Field Notes ───────────────────────────────────────────────────────────────
const FIELD_NOTES = [
  {
    title: 'Tripwire — Mid-Stream LLM Safety',
    excerpt: 'How to catch a hallucination before the user finishes reading it.',
    status: 'Coming soon',
  },
  {
    title: 'Anchor — Provenance-First RAG Architecture',
    excerpt: 'Cosine-floor retrieval: when similarity is high, return chunks; when it isn\'t, refuse.',
    status: 'Coming soon',
  },
  {
    title: 'Quickdraw — LLM Streaming Benchmarks',
    excerpt: 'TTFT, tokens/sec, cost per 1K tokens — why these metrics matter for production.',
    status: 'Coming soon',
  },
];

function FieldNotesSection() {
  return (
    <Section id="writing" label="// Field Notes">
      <div className="grid md:grid-cols-3 gap-5">
        {FIELD_NOTES.map((note, i) => (
          <motion.div
            key={note.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="telemetry-card space-y-3 relative"
          >
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">
                {note.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 pr-16 leading-snug">{note.title}</h3>
            <p className="text-[12px] text-zinc-500 leading-relaxed">{note.excerpt}</p>
          </motion.div>
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
          <ResumeButton href="/Lakshyaraj_Singh_Rao_Resume.pdf" />
        </div>
      </div>
    </Section>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const links = [
    { href: '/#now', label: 'Now' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#stack', label: 'Stack' },
    { href: '/#writing', label: 'Writing' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold text-zinc-200 tracking-tight hover:text-cyan-400 transition-colors">
          lakshyaraj/
        </Link>
        <div className="flex items-center gap-5 sm:gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors tracking-wide"
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
  const [booted, setBooted] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] dark:bg-[#050505] text-zinc-100">
      <Nav />
      <main className="pt-14">
        <Hero onBootDone={() => setBooted(true)} />
        {booted && (
          <>
            <NowSection />
            <ProjectsSection />
            <StackSection />
            <TelemetrySection />
            <FieldNotesSection />
            <ContactSection />
            <footer className="border-t border-zinc-800/60 py-8 text-center">
              <p className="font-mono text-[11px] text-zinc-600">
                © {new Date().getFullYear()} Lakshyaraj Singh Rao · Apache 2.0
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}