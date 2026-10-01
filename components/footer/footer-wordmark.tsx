'use client';

// A large, quiet wordmark that writes itself in left-to-right as the footer comes
// up, lagging the scroll through a 48-frame clip-path reveal and rewinding when
// you scroll back up. The scroll listener is attached only while the footer is in
// view. Under prefers-reduced-motion it snaps to the final frame (fully drawn)
// and never listens to scroll. The element is always laid out at full size and
// only clipped, so it reserves its own height and the mono line and links below
// it never shift.

import { useEffect, useRef } from 'react';
import { SOCIAL } from '@/lib/site';
import { createFrameAnimator } from '@/lib/motion/frame-animator';

const FRAMES = 48;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mark = markRef.current;
    if (!wrap || !mark) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (frame: number) => {
      mark.style.clipPath = `inset(0 ${(1 - frame / (FRAMES - 1)) * 100}% 0 0)`;
    };
    if (reduce.matches) { apply(FRAMES - 1); return; }

    const anim = createFrameAnimator(FRAMES, 0.18);
    apply(0);
    let raf = 0;
    let last = performance.now();
    let running = false;
    const progress = () => {
      const r = wrap.getBoundingClientRect();
      return clamp01((window.innerHeight - r.top) / (window.innerHeight * 0.5));
    };
    const onScroll = () => anim.set(progress() * (FRAMES - 1));
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      apply(anim.tick(dt));
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      onScroll();
      last = performance.now();
      raf = requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) start(); else stop(); });
    io.observe(wrap);
    const onReduce = () => { if (reduce.matches) { stop(); io.disconnect(); apply(FRAMES - 1); } };
    reduce.addEventListener('change', onReduce);

    return () => {
      stop();
      io.disconnect();
      reduce.removeEventListener('change', onReduce);
    };
  }, []);

  return (
    <div ref={wrapRef}>
      <div
        ref={markRef}
        aria-hidden="true"
        className="font-medium leading-[0.95] tracking-[-0.02em] text-[var(--line)] break-words"
        style={{ fontSize: 'clamp(2.4rem, 11vw, 5.5rem)' }}
      >
        Lakshyaraj Singh Rao
      </div>
      <p className="mt-6 mono text-[0.82rem] text-[var(--muted-foreground)]">
        Mumbai / Bangalore · building Homesty.ai since November 2025
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 mono text-[0.82rem] text-[var(--muted-foreground)]">
        {SOCIAL.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            {label}
          </a>
        ))}
        <a href="/resume" className="hover:text-[var(--accent)] transition-colors">Résumé</a>
      </div>
    </div>
  );
}
