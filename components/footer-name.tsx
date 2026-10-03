'use client';

import { useEffect, useRef, useState } from 'react';
import { CHARS } from './world/engine';
import { hash01, hash2 } from './world/random';

// The site opens with a world scrambling into place and closes with the name
// doing the same, except this one is scrubbed by scroll instead of time: each
// character settles as the footer rises into view, and scrolling back up
// unsettles it again. The scrub idea follows oil-motion (MIT, oil-oil), which
// drives frame sequences from scroll position; here the frames are glyphs.
const NAME = 'Lakshyaraj Singh Rao';
const POOL = CHARS.slice(CHARS.indexOf('A'));
const FRAMES = 48; // scroll positions that change the unsettled glyphs

function glyphAt(i: number, p: number): string {
  const ch = NAME[i];
  if (ch === ' ') return ch;
  const settleAt = (i / NAME.length) * 0.8 + hash01(i) * 0.2;
  if (p >= settleAt) return ch;
  return POOL[Math.floor(hash2(i, Math.floor(p * FRAMES)) * POOL.length)];
}

export function FooterName() {
  const ref = useRef<HTMLSpanElement>(null);
  // Rendered settled on the server and on the first paint; the scrub only
  // takes over once there is a scroll position to read.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      // 0 as the name enters at the bottom edge, 1 once it sits a third of
      // the way up. A page too short to scroll that far counts as arrived.
      const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      setProgress(atEnd ? 1 : Math.min(1, Math.max(0, (vh - top) / (vh * 0.33))));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  return (
    <span ref={ref} className="mono block text-[22px] tracking-tight sm:text-[26px]">
      <span className="sr-only">{NAME}</span>
      <span aria-hidden="true">
        {Array.from(NAME, (_, i) => {
          const g = glyphAt(i, progress);
          return (
            <span key={i} className={g === NAME[i] ? undefined : 'text-accent'}>
              {g}
            </span>
          );
        })}
      </span>
    </span>
  );
}
