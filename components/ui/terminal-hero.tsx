'use client';

// The hero terminal. It types a short intro, then takes real commands: list and
// open projects, and jump to a section with cd. Arrow keys recall earlier
// commands. With prefers-reduced-motion the intro appears at once instead of
// being typed.
import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '@/lib/projects';

type Line = { kind: 'cmd' | 'out' | 'note'; text: string };

const PROMPT = 'lakshyaraj@portfolio:~$ ';
const SECTIONS = ['work', 'proof', 'stack', 'now', 'contact'] as const;

const WHOAMI = ['Lakshyaraj Singh Rao. Full-stack developer, backend focus.', 'Software engineer at Homesty.ai since November 2025.'];
const BOOT: { cmd: string; out: string[] }[] = [
  { cmd: 'whoami', out: WHOAMI },
  { cmd: 'cat now.txt', out: ['Building Homesty.ai. B.Tech CS at Manipal University Jaipur, 2026.'] },
];

const HELP = [
  'whoami          who I am',
  'ls              list my projects',
  'cat <project>   what a project does, e.g. cat anvil',
  'open <name>     open a project, resume, github, linkedin or npm',
  'cd <section>    jump to work, proof, stack, now or contact',
  'stack           the tools I use',
  'contact         how to reach me',
  'clear           clear the screen',
];

const LINKS: Record<string, string> = {
  resume: '/resume',
  github: 'https://github.com/ykstorm',
  linkedin: 'https://linkedin.com/in/lakshyaraj-singh-rao-840273152',
  npm: 'https://www.npmjs.com/~ykstormsorg',
  email: 'mailto:raolakshyaraj@gmail.com',
};

const shortId = (id: string) => id.replace(/-ai$/, '');
const findProject = (name: string) => PROJECTS.find((p) => p.id === name || shortId(p.id) === name);

function open(url: string): void {
  if (url.startsWith('/')) window.location.assign(url);
  else window.open(url, '_blank', 'noopener,noreferrer');
}

function jump(section: string): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = section === '~' ? document.body : document.getElementById(section);
  el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

const out = (...text: string[]): Line[] => text.map((t) => ({ kind: 'out', text: t }));

const STACK = [
  'TypeScript, JavaScript, SQL',
  'Node.js, Express, REST APIs, PostgreSQL, Prisma, Redis, MongoDB',
  'React, Next.js, Tailwind CSS',
  'Git, Docker, Kubernetes, GitHub Actions, Vercel, Sentry',
];
const CONTACT = [
  'email     raolakshyaraj@gmail.com',
  'github    github.com/ykstorm',
  'linkedin  linkedin.com/in/lakshyaraj-singh-rao-840273152',
  'npm       npmjs.com/~ykstormsorg',
];

function cat(arg: string): Line[] {
  if (!arg) return out('cat: name a project, e.g. cat anvil');
  const p = findProject(arg);
  return out(p ? `${p.name}: ${p.tagline}` : `cat: ${arg}: no such project. Type ls to list them.`);
}

function openArg(arg: string): Line[] {
  const p = findProject(arg);
  const url = p ? p.demo ?? p.code : LINKS[arg];
  if (!url) return out(`open: ${arg || '?'}: try open anvil, open resume or open github`);
  open(url);
  return out(`Opening ${p ? p.name : arg}.`);
}

function cd(arg: string): Line[] {
  const target = arg.replace(/^~\/?/, '') || '~';
  if (target === '~' || target === '..') {
    jump('~');
    return [];
  }
  if (!(SECTIONS as readonly string[]).includes(target)) return out(`cd: no such section: ${arg}. Try ${SECTIONS.join(', ')}.`);
  jump(target);
  return [];
}

const COMMANDS: Record<string, (arg: string) => Line[] | 'clear'> = {
  help: () => out(...HELP),
  whoami: () => out(...WHOAMI),
  ls: () => out(PROJECTS.map((p) => shortId(p.id)).join('  ')),
  cat,
  open: openArg,
  cd,
  stack: () => out(...STACK),
  contact: () => out(...CONTACT),
  clear: () => 'clear',
};

function run(raw: string): Line[] | 'clear' {
  const [cmd = '', ...rest] = raw.trim().split(/\s+/);
  if (!cmd) return [];
  const handler = Object.hasOwn(COMMANDS, cmd.toLowerCase()) ? COMMANDS[cmd.toLowerCase()] : null;
  return handler ? handler(rest.join(' ').toLowerCase()) : out(`command not found: ${cmd}. Type help to see the commands.`);
}

function Caret() {
  return (
    <span className="inline-block w-[0.55ch] text-accent" style={{ animation: 'caret-blink 1s step-end infinite' }} aria-hidden="true">
      ▋
    </span>
  );
}

export function TerminalHero() {
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const note: Line = { kind: 'note', text: 'Type help to see what this terminal can do.' };

    async function boot() {
      // Read once at boot: the intro either types or appears whole.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await Promise.resolve();
        if (cancelled) return;
        setLines([...BOOT.flatMap((b): Line[] => [{ kind: 'cmd', text: b.cmd }, ...b.out.map((t): Line => ({ kind: 'out', text: t }))]), note]);
        setBooted(true);
        return;
      }
      await wait(450);
      for (const b of BOOT) {
        for (let i = 1; i <= b.cmd.length; i++) {
          if (cancelled) return;
          const typed: Line = { kind: 'cmd', text: b.cmd.slice(0, i) };
          setLines((prev) => [...(prev[prev.length - 1]?.kind === 'cmd' ? prev.slice(0, -1) : prev), typed]);
          await wait(34);
        }
        await wait(180);
        if (cancelled) return;
        setLines((prev) => [...prev, ...b.out.map((t): Line => ({ kind: 'out', text: t }))]);
        await wait(380);
      }
      if (cancelled) return;
      setLines((prev) => [...prev, note]);
      setBooted(true);
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, booted]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = input;
    setInput('');
    if (value.trim()) history.current.push(value);
    cursor.current = history.current.length;
    const result = run(value);
    if (result === 'clear') setLines([]);
    else setLines((prev) => [...prev, { kind: 'cmd', text: value }, ...result]);
  }

  function recall(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const h = history.current;
    cursor.current = Math.max(0, Math.min(h.length, cursor.current + (e.key === 'ArrowUp' ? -1 : 1)));
    setInput(h[cursor.current] ?? '');
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      data-no-wave
      className="term-window w-full cursor-text text-left text-[12.5px] leading-relaxed sm:text-[13px]"
    >
      <div className="term-titlebar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="ml-2 text-[11px] text-muted-foreground">lakshyaraj@portfolio: ~</span>
      </div>

      <div ref={bodyRef} role="log" aria-live="polite" aria-label="Terminal output" className="h-[214px] space-y-0.5 overflow-y-auto p-4">
        {lines.map((l, i) => {
          if (l.kind === 'cmd') {
            return (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className="text-accent">{PROMPT}</span>
                <span className="text-foreground">{l.text}</span>
                {i === lines.length - 1 && !booted && <Caret />}
              </div>
            );
          }
          if (l.kind === 'note') return <div key={i} className="whitespace-pre-wrap text-muted-foreground">{l.text}</div>;
          return <div key={i} className="whitespace-pre-wrap break-words text-muted-foreground">{l.text}</div>;
        })}

        {booted && (
          <form onSubmit={submit} className="flex items-center whitespace-pre">
            <span className="text-accent">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={recall}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal input. Type a command, or help."
              className="min-w-0 flex-1 border-none bg-transparent text-foreground caret-[var(--accent)] outline-none"
            />
          </form>
        )}
      </div>
    </div>
  );
}
