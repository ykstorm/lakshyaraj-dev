'use client';

// ── Interactive ASCII physics field ───────────────────────────────────────────
// A grid of monospace glyphs. Two things move them:
//   1. a slow sum-of-sines flow field sets each glyph's density (drift, always on)
//   2. a spring system: the cursor repels nearby glyphs, which then spring back to
//      their origin with damping — a tiny verlet-ish sim, so the field reacts to
//      the mouse and settles. Click = a radial shockwave impulse.
// Brand-tinted, pointer-events-none, ~30fps. prefers-reduced-motion → static frame.
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
    const cv: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    const CELL = 17;
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let t = 0;
    let raf = 0;
    let last = 0;
    let running = true;

    // per-cell displacement + velocity (spring back to origin)
    let dx = new Float32Array(0);
    let dy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);

    const mouse = { x: -9999, y: -9999, active: false };
    const R = 110;          // repel radius
    const FORCE = 26;       // repel strength
    const K = 0.12;         // spring stiffness
    const DAMP = 0.82;      // velocity damping

    const tint = () =>
      document.documentElement.classList.contains('dark')
        ? 'rgba(52,211,153,'
        : 'rgba(14,116,144,';

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
      const n = cols * rows;
      dx = new Float32Array(n);
      dy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
    }

    function physics() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const px = x * CELL;
          const py = y * CELL;
          // repulsion from cursor
          if (mouse.active) {
            const rx = px + dx[i] - mouse.x;
            const ry = py + dy[i] - mouse.y;
            const d2 = rx * rx + ry * ry;
            if (d2 < R * R && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              const f = (FORCE * (1 - d / R)) / d;
              vx[i] += rx * f;
              vy[i] += ry * f;
            }
          }
          // spring back to origin + damping
          vx[i] = (vx[i] - K * dx[i]) * DAMP;
          vy[i] = (vy[i] - K * dy[i]) * DAMP;
          dx[i] += vx[i];
          dy[i] += vy[i];
        }
      }
    }

    function draw() {
      c.clearRect(0, 0, cssW, cssH);
      const base = tint();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const v =
            Math.sin(x * 0.16 + t) +
            Math.sin(y * 0.21 - t * 0.8) +
            Math.sin((x + y) * 0.11 + t * 0.5);
          const n = (v + 3) / 6;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(n * RAMP.length))];
          if (ch === ' ') continue;
          // glyphs that got displaced glow a little brighter
          const disp = Math.min(1, (Math.abs(dx[i]) + Math.abs(dy[i])) / 30);
          const alpha = 0.04 + n * 0.16 + disp * 0.5;
          c.fillStyle = base + Math.min(0.85, alpha).toFixed(3) + ')';
          c.fillText(ch, x * CELL + dx[i], y * CELL + dy[i]);
        }
      }
    }

    function loop(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps
      last = now;
      t += 0.04;
      physics();
      draw();
    }

    function toLocal(e: { clientX: number; clientY: number }) {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    const onMove = (e: PointerEvent) => {
      toLocal(e);
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      toLocal(e);
      // shockwave: kick every cell radially away from the click
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const rx = x * CELL - mouse.x;
          const ry = y * CELL - mouse.y;
          const d = Math.hypot(rx, ry) || 1;
          if (d < 260) {
            const f = (8 * (1 - d / 260)) / d;
            vx[i] += rx * f;
            vy[i] += ry * f;
          }
        }
      }
    };

    resize();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerleave', onLeave);
    }
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: 'radial-gradient(ellipse 78% 78% at 50% 42%, #000 22%, transparent 80%)',
        maskImage: 'radial-gradient(ellipse 78% 78% at 50% 42%, #000 22%, transparent 80%)',
      }}
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
