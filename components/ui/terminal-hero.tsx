'use client';

// Dynamic terminal panel for the hero. Server-rendered static text lives in a
// <noscript> fallback (in the parent), so crawlers / no-JS visitors see the
// content. On client mount a typewriter cycles command/output pairs at 25ms/char
// with a blinking caret; hovering pauses the cycle. prefers-reduced-motion
// renders the final state immediately with no typing.
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Pair = { cmd: string; out: string };

const PAIRS: Pair[] = [
  { cmd: 'whoami', out: 'Backend Engineer · AI Infrastructure · DevOps' },
  { cmd: 'cat current_focus', out: 'Anvil — webhook→BullMQ pipeline' },
  { cmd: 'ls projects/', out: 'anchor  tripwire  goldset  quickdraw  stackup  codecraft  homesty  anvil' },
  { cmd: 'status', out: 'Open to backend / AI-infra roles' },
];

const PROMPT = 'lakshyaraj@dev:~$ ';
const SPEED = 25;

function StaticTranscript() {
  return (
    <>
      {PAIRS.map((p, i) => (
        <div key={i} className="space-y-0.5">
          <div>
            <span className="text-emerald-600 dark:text-green-400">{PROMPT}</span>
            <span className="text-cyan-600 dark:text-cyan-400">{p.cmd}</span>
          </div>
          <div className="pl-0 text-zinc-600 dark:text-zinc-400">{p.out}</div>
        </div>
      ))}
    </>
  );
}

export function TerminalHero() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<{ cmd: string; out: string; cmdDone: boolean }[]>([]);
  const [done, setDone] = useState(reduce);
  const pausedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (reduce) {
      setDone(true);
      return;
    }

    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const start = Date.now();
        const step = () => {
          if (cancelled) return resolve();
          if (pausedRef.current) {
            requestAnimationFrame(step);
            return;
          }
          if (Date.now() - start >= ms) return resolve();
          requestAnimationFrame(step);
        };
        step();
      });

    async function run() {
      // eslint-disable-next-line no-constant-condition
      while (!cancelled) {
        setLines([]);
        for (const pair of PAIRS) {
          if (cancelled) return;
          setLines((prev) => [...prev, { cmd: '', out: '', cmdDone: false }]);
          const idx = lineCount();
          for (let c = 1; c <= pair.cmd.length; c++) {
            if (cancelled) return;
            await wait(SPEED);
            setLines((prev) => {
              const next = [...prev];
              if (next[idx]) next[idx] = { ...next[idx], cmd: pair.cmd.slice(0, c) };
              return next;
            });
          }
          await wait(180);
          setLines((prev) => {
            const next = [...prev];
            if (next[idx]) next[idx] = { ...next[idx], cmdDone: true, out: pair.out };
            return next;
          });
          await wait(700);
        }
        await wait(2600);
      }
    }

    let counter = -1;
    function lineCount() {
      counter += 1;
      return counter;
    }

    run();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [reduce]);

  // Static render for reduced-motion (and the very first paint before effect).
  if (done) {
    return (
      <TerminalShell>
        <StaticTranscript />
      </TerminalShell>
    );
  }

  return (
    <TerminalShell
      onPause={() => (pausedRef.current = true)}
      onResume={() => (pausedRef.current = false)}
    >
      {lines.map((l, i) => {
        const last = i === lines.length - 1;
        return (
          <div key={i} className="space-y-0.5">
            <div>
              <span className="text-emerald-600 dark:text-green-400">{PROMPT}</span>
              <span className="text-cyan-600 dark:text-cyan-400">{l.cmd}</span>
              {last && !l.cmdDone && <Caret />}
            </div>
            {l.cmdDone && (
              <div className="text-zinc-600 dark:text-zinc-400">
                {l.out}
                {last && <Caret />}
              </div>
            )}
          </div>
        );
      })}
    </TerminalShell>
  );
}

function Caret() {
  return <span className="ml-px inline-block animate-pulse text-cyan-600 dark:text-cyan-400">▋</span>;
}

function TerminalShell({
  children,
  onPause,
  onResume,
}: {
  children: React.ReactNode;
  onPause?: () => void;
  onResume?: () => void;
}) {
  return (
    <div
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      className="font-mono text-[13px] sm:text-sm w-full max-w-xl mx-auto rounded-lg border border-zinc-300 dark:border-cyan-500/30 bg-white/70 dark:bg-[#0d0d0d]/80 backdrop-blur overflow-hidden text-left"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-[10px] text-zinc-400 dark:text-zinc-600">lakshyaraj — zsh</span>
      </div>
      <div className="p-4 space-y-1.5 min-h-[160px]">{children}</div>
    </div>
  );
}
