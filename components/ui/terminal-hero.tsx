'use client';

// Interactive hero terminal. Boots by typing a short intro sequence, then hands
// the user a live prompt: real typed commands (help, whoami, ls, cat, open, clear…)
// produce canned output. Clicking anywhere in the window focuses the input. Static
// transcript lives in a <noscript> fallback (parent) for crawlers / no-JS.
// prefers-reduced-motion skips the typewriter and lands straight on the prompt.
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Line = { kind: 'cmd' | 'out' | 'sys'; text: string };

const PROMPT = 'lakshyaraj@dev:~$ ';

const BOOT: { cmd: string; out: string }[] = [
  { cmd: 'whoami', out: 'Backend Engineer · AI Infrastructure · DevOps' },
  { cmd: 'cat focus.txt', out: 'Anvil — idempotent webhook → BullMQ pipeline' },
  { cmd: "echo $AVAILABILITY", out: 'open to backend / AI-infra roles' },
];

const PROJECTS: Record<string, string> = {
  anchor: 'provenance-first RAG · refuses below a similarity floor → anchor-iota-ten.vercel.app',
  tripwire: 'mid-stream LLM guardrail · aborts the stream before a bad token lands',
  goldset: 'LLM eval as a GitHub Action · golden + judge + structural',
  quickdraw: 'streaming benchmark CLI · TTFT, tokens/sec, $/1K',
  stackup: 'production-shape Kubernetes locally · ArgoCD + Argo Rollouts + Grafana',
  codecraft: 'in-browser IDE · boots a real Next.js dev server via WebContainers',
  anvil: 'idempotent webhook → BullMQ · HMAC, backoff, dead-letter replay · on npm',
  homesty: 'live commission-driven real-estate AI · the product the OSS came from',
};

const HELP = [
  'available commands:',
  '  whoami        role + focus',
  '  ls            list projects',
  '  cat <name>    project detail (e.g. cat anvil)',
  '  stack         the tools I reach for',
  '  contact       how to reach me',
  '  open <name>   open project / resume / github',
  '  clear         clear the screen',
];

function run(raw: string): Line[] {
  const input = raw.trim();
  if (!input) return [];
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ').toLowerCase();
  const out = (text: string): Line => ({ kind: 'out', text });

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?':
      return HELP.map(out);
    case 'whoami':
      return [out('Lakshyaraj Singh Rao — backend / AI-infra engineer. I ship AI to'), out('production, then extract the reliable parts into open source.')];
    case 'ls':
    case 'projects':
      return [out(Object.keys(PROJECTS).join('  '))];
    case 'cat': {
      if (!arg) return [out('usage: cat <project>  — try: cat anvil')];
      const hit = PROJECTS[arg];
      return [hit ? out(hit) : out(`cat: ${arg}: no such project. try 'ls'`)];
    }
    case 'stack':
      return [out('TypeScript · Node · Postgres/pgvector · Redis/BullMQ'), out('Docker · Kubernetes · ArgoCD · Helm · Terraform')];
    case 'contact':
      return [out('email   raolakshyaraj@gmail.com'), out('github  github.com/ykstorm'), out('npm     npmjs.com/~ykstormsorg')];
    case 'open': {
      const map: Record<string, string> = {
        resume: '/resume',
        github: 'https://github.com/ykstorm',
        anchor: 'https://anchor-iota-ten.vercel.app',
        codecraft: 'https://codecraft-ai-tau.vercel.app',
        homesty: 'https://homesty.ai',
      };
      const url = map[arg];
      if (url) {
        if (typeof window !== 'undefined') window.open(url, url.startsWith('http') ? '_blank' : '_self', 'noopener');
        return [out(`opening ${arg}…`)];
      }
      return [out(`open: ${arg || '?'}: try open resume | github | anchor`)];
    }
    case 'sudo':
      return [out("nice try — you don't have root here :)")];
    case 'clear':
      return [{ kind: 'sys', text: '__clear__' }];
    default:
      return [out(`command not found: ${cmd}. type 'help'`)];
  }
}

function Caret() {
  return <span className="inline-block w-[0.5ch] text-cyan-600 dark:text-cyan-400" style={{ animation: 'caret-blink 1s step-end infinite' }}>▋</span>;
}

export function TerminalHero() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // boot sequence
  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function boot() {
      if (reduce) {
        const transcript: Line[] = [
          ...BOOT.flatMap((b): Line[] => [
            { kind: 'cmd', text: b.cmd },
            { kind: 'out', text: b.out },
          ]),
          { kind: 'sys', text: "type 'help' to explore" },
        ];
        setLines(transcript);
        setBooted(true);
        return;
      }
      for (const b of BOOT) {
        if (cancelled) return;
        // type the command char by char
        for (let i = 1; i <= b.cmd.length; i++) {
          if (cancelled) return;
          setLines((prev) => {
            const base = prev[prev.length - 1]?.kind === 'cmd' ? prev.slice(0, -1) : prev;
            return [...base, { kind: 'cmd', text: b.cmd.slice(0, i) }];
          });
          await wait(26);
        }
        await wait(160);
        setLines((prev) => [...prev, { kind: 'out', text: b.out }]);
        await wait(420);
      }
      if (cancelled) return;
      setLines((prev) => [...prev, { kind: 'sys', text: "type 'help' to explore" }]);
      setBooted(true);
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [reduce]);

  // keep scrolled to bottom
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, booted]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = input;
    setInput('');
    const result = run(value);
    if (result.some((l) => l.text === '__clear__')) {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, { kind: 'cmd', text: value }, ...result]);
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="term-window w-full max-w-xl mx-auto text-left text-[12.5px] sm:text-[13px] leading-relaxed cursor-text"
    >
      <div className="term-titlebar">
        <span className="term-dot bg-red-400/70" />
        <span className="term-dot bg-amber-400/70" />
        <span className="term-dot bg-emerald-400/70" />
        <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-600">lakshyaraj@dev — zsh — interactive</span>
      </div>

      <div ref={bodyRef} className="p-4 space-y-0.5 h-[208px] overflow-y-auto">
        {lines.map((l, i) => {
          if (l.kind === 'cmd') {
            const lastCmd = i === lines.length - 1 && !booted;
            return (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className="text-emerald-600 dark:text-emerald-400">{PROMPT}</span>
                <span className="text-cyan-700 dark:text-cyan-300">{l.text}</span>
                {lastCmd && <Caret />}
              </div>
            );
          }
          if (l.kind === 'sys') {
            return <div key={i} className="text-zinc-400 dark:text-zinc-500 italic whitespace-pre-wrap">{l.text}</div>;
          }
          return <div key={i} className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-words">{l.text}</div>;
        })}

        {booted && (
          <form onSubmit={submit} className="flex items-center whitespace-pre-wrap">
            <span className="text-emerald-600 dark:text-emerald-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Terminal input — type a command like help"
              className="flex-1 bg-transparent border-none outline-none text-cyan-700 dark:text-cyan-300 caret-cyan-500 ml-0"
            />
          </form>
        )}
      </div>
    </div>
  );
}
