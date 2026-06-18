'use client';

// ── ASCII flow-field ──────────────────────────────────────────────────────────
// A grid of monospace glyphs whose density follows a slowly-evolving sum-of-sines
// field, so it reads like a drifting topographic terminal readout. Brand-tinted,
// very low opacity, pointer-events-none. Throttled to ~14fps for a terminal cadence
// (and to stay cheap). Reads the live theme each frame so it tracks light/dark.
// prefers-reduced-motion → one static frame, no loop.
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const RAMP = ' .·:-=+*░▒'; // low → high density

export function AsciiBackground({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // narrow once for the nested render closures
    const cv: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    const CELL = 15; // px per glyph cell
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let t = 0;
    let raf = 0;
    let last = 0;
    let running = true;

    const tint = () =>
      document.documentElement.classList.contains('dark')
        ? 'rgba(52,211,153,' // emerald phosphor
        : 'rgba(14,116,144,'; // cyan-700 ink

    function resize() {
      const parent = cv.parentElement;
      cssW = parent?.clientWidth || window.innerWidth;
      cssH = parent?.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(cssW * dpr);
      cv.height = Math.floor(cssH * dpr);
      cv.style.width = cssW + 'px';
      cv.style.height = cssH + 'px';
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.font = `${CELL}px 'JetBrains Mono', ui-monospace, monospace`;
      c.textBaseline = 'top';
      cols = Math.ceil(cssW / CELL);
      rows = Math.ceil(cssH / CELL);
    }

    function draw() {
      c.clearRect(0, 0, cssW, cssH);
      const base = tint();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v =
            Math.sin(x * 0.16 + t) +
            Math.sin(y * 0.21 - t * 0.8) +
            Math.sin((x + y) * 0.11 + t * 0.5);
          const n = (v + 3) / 6; // 0..1
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(n * RAMP.length))];
          if (ch === ' ') continue;
          c.fillStyle = base + (0.04 + n * 0.16).toFixed(3) + ')';
          c.fillText(ch, x * CELL, y * CELL);
        }
      }
    }

    function loop(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 70) return; // ~14fps
      last = now;
      t += 0.04;
      draw();
    }

    resize();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        WebkitMaskImage:
          'radial-gradient(ellipse 75% 75% at 50% 45%, #000 25%, transparent 78%)',
        maskImage:
          'radial-gradient(ellipse 75% 75% at 50% 45%, #000 25%, transparent 78%)',
      }}
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
