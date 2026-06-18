'use client';

// Dynamic terminal panel for the hero. Static text lives in a <noscript> fallback
// (parent), so crawlers / no-JS visitors see the content. On client mount a
// typewriter cycles command/output pairs with a blinking caret; hovering pauses.
// The shell has a FIXED min-height and seeds the first prompt synchronously, so it
// never renders as an empty/short box on hydration (the previous bug). Shares the
// .term-window chrome with the contact terminal so both read as the same app.
// prefers-reduced-motion renders the final transcript immediately.
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Pair = { cmd: string; out: string };

const PAIRS: Pair[] = [
  { cmd: 'whoami', out: 'Backend Engineer · AI Infrastructure · DevOps' },
  { cmd: 'cat focus.txt', out: 'Anvil — idempotent webhook → BullMQ pipeline' },
  { cmd: 'ls ~/projects', out: 'anchor  tripwire  goldset  quickdraw  stackup  codecraft  anvil' },
  { cmd: 'status --availability', out: 'open to backend / AI-infra roles' },
];

const PROMPT = 'lakshyaraj@dev:~$ ';
const SPEED = 26;

function Caret() {
  return (
    <span
      className="ml-px inline-block w-[0.5ch] text-cyan-600 dark:text-cyan-400"
      style={{ animation: 'caret-blink 1s step-end infinite' }}
    >
      ▋
    </span>
  );
}

function Row({ cmd, out, showCmdCaret, showOutCaret }: { cmd: string; out?: string; showCmdCaret?: boolean; showOutCaret?: boolean }) {
  return (
    <div className="space-y-0.5">
      <div className="whitespace-pre-wrap break-words">
        <span className="text-emerald-600 dark:text-emerald-400">{PROMPT}</span>
        <span className="text-cyan-700 dark:text-cyan-300">{cmd}</span>
        {showCmdCaret && <Caret />}
      </div>
      {out !== undefined && (
        <div className="pl-0 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-words">
          {out}
          {showOutCaret && <Caret />}
        </div>
      )}
    </div>
  );
}

function Shell({ children, onPause, onResume }: { children: React.ReactNode; onPause?: () => void; onResume?: () => void }) {
  return (
    <div onMouseEnter={onPause} onMouseLeave={onResume} className="term-window w-full max-w-xl mx-auto text-left text-[12.5px] sm:text-[13px] leading-relaxed">
      <div className="term-titlebar">
        <span className="term-dot bg-red-400/70" />
        <span className="term-dot bg-amber-400/70" />
        <span className="term-dot bg-emerald-400/70" />
        <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-600">lakshyaraj@dev — zsh</span>
      </div>
      <div className="p-4 space-y-2 min-h-[168px]">{children}</div>
    </div>
  );
}

export function TerminalHero() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<{ cmd: string; out?: string; typing: boolean }[]>([
    { cmd: '', out: undefined, typing: true }, // seed: prompt visible immediately
  ]);
  const [done, setDone] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const step = (now: number) => {
          if (cancelled) return resolve();
          if (pausedRef.current) return requestAnimationFrame(step);
          if (now - start >= ms) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

    async function run() {
      while (!cancelled) {
        for (let i = 0; i < PAIRS.length; i++) {
          const pair = PAIRS[i];
          // new line for every pair except the seeded first
          setLines((prev) => {
            const base = i === 0 ? [] : prev;
            return [...base, { cmd: '', out: undefined, typing: true }];
          });
          const idx = i;
          for (let c = 1; c <= pair.cmd.length; c++) {
            if (cancelled) return;
            await wait(SPEED);
            setLines((prev) => {
              const next = [...prev];
              if (next[idx]) next[idx] = { ...next[idx], cmd: pair.cmd.slice(0, c) };
              return next;
            });
          }
          await wait(200);
          setLines((prev) => {
            const next = [...prev];
            if (next[idx]) next[idx] = { ...next[idx], out: pair.out, typing: false };
            return next;
          });
          await wait(750);
        }
        await wait(2800);
        if (cancelled) return;
        setLines([{ cmd: '', out: undefined, typing: true }]);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [reduce]);

  if (done) {
    return (
      <Shell>
        {PAIRS.map((p, i) => (
          <Row key={i} cmd={p.cmd} out={p.out} />
        ))}
      </Shell>
    );
  }

  return (
    <Shell onPause={() => (pausedRef.current = true)} onResume={() => (pausedRef.current = false)}>
      {lines.map((l, i) => {
        const last = i === lines.length - 1;
        const cmdTyping = last && l.out === undefined;
        return (
          <Row
            key={i}
            cmd={l.cmd}
            out={l.out}
            showCmdCaret={cmdTyping}
            showOutCaret={last && l.out !== undefined}
          />
        );
      })}
    </Shell>
  );
}
