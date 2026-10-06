'use client';

// Mounts the hero world. Loaded with next/dynamic (ssr: false) from the hero,
// so none of this ships in the HTML or competes with the headline for first
// paint. It pauses when scrolled away or when the tab is hidden, and with
// prefers-reduced-motion it draws one still frame and never animates.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { WorldEngine, type Composition } from './engine';
import { DEFAULT_SEED } from './biomes';

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(REDUCED).matches;
const getReducedOnServer = () => false;

// Clicks on these never send a wave: they belong to the control, not the world.
const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [data-no-wave]';

// Where the horizon sits. On small screens the hero marks a band between its
// copy and the terminal with [data-world-anchor], and the range is placed in
// that band whatever height the copy wraps to. Otherwise the hero's CSS
// variables decide, per breakpoint.
function composition(stage: HTMLElement): Composition {
  const cs = getComputedStyle(stage);
  const num = (name: string, fallback: number) => {
    const v = parseFloat(cs.getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  const comp = { horizon: num('--world-horizon', 0.55), bias: num('--world-bias', 0) };
  const anchor = stage.parentElement?.querySelector<HTMLElement>('[data-world-anchor]');
  const box = anchor?.getBoundingClientRect();
  const frame = stage.getBoundingClientRect();
  if (box && box.height > 0 && frame.height > 0) comp.horizon = (box.top - frame.top + box.height * 0.3) / frame.height;
  return comp;
}

function themeStyle() {
  const root = getComputedStyle(document.documentElement);
  return {
    glyph: root.getPropertyValue('--glyph').trim() || '233, 230, 222',
    hot: root.getPropertyValue('--glyph-hot').trim() || '242, 169, 59',
    family: root.getPropertyValue('--ff-mono').trim() || 'monospace',
  };
}

export default function WorldCanvas() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedOnServer);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    let cancelled = false;
    let engine: WorldEngine | null = null;
    let visible = true;
    let rect = stage.getBoundingClientRect();
    const cleanups: (() => void)[] = [];
    const listen = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) => {
      window.addEventListener(type, fn, { passive: true });
      cleanups.push(() => window.removeEventListener(type, fn));
    };

    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const dense = !coarse && window.innerWidth >= 768;
    const dpr = Math.min(window.devicePixelRatio || 1, dense ? 2 : 1.5);

    const run = () => {
      if (!engine) return;
      if (visible && !document.hidden) engine.start();
      else engine.stop();
    };
    const fit = () => {
      if (!engine) return;
      rect = stage.getBoundingClientRect();
      engine.resize(rect.width, rect.height, dpr, composition(stage));
      if (!engine.isRunning) engine.renderStill();
    };
    const local = (e: PointerEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    };

    const boot = async () => {
      // glyphs are drawn in the page's mono font; wait for it, but not for long
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]);
      if (cancelled) return;
      try {
        engine = new WorldEngine(canvas, DEFAULT_SEED, { reduced, dense });
      } catch {
        return; // no Canvas 2D: the hero keeps its copy and simply has no world
      }
      const style = themeStyle();
      engine.setStyle(style.glyph, style.hot, style.family);
      fit();
      if (reduced) {
        engine.renderStill();
      } else {
        engine.intro();
        run();
      }
      requestAnimationFrame(() => !cancelled && setReady(true));

      const ro = new ResizeObserver(fit);
      ro.observe(stage);
      cleanups.push(() => ro.disconnect());

      const io = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        run();
      });
      io.observe(stage);
      cleanups.push(() => io.disconnect());

      const onVisibility = () => run();
      document.addEventListener('visibilitychange', onVisibility);
      cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

      const mo = new MutationObserver(() => {
        if (!engine) return;
        const s = themeStyle();
        engine.setStyle(s.glyph, s.hot, s.family);
        if (!engine.isRunning) engine.renderStill();
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      cleanups.push(() => mo.disconnect());

      if (reduced) return; // still view: no pointer field, no waves
      listen('scroll', () => (rect = stage.getBoundingClientRect()));
      listen('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const p = local(e);
        engine?.pointer(p.x, p.y, p.inside);
      });
      listen('pointerdown', (e) => {
        if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
        const p = local(e);
        if (p.inside) engine?.pulse(p.x, p.y);
      });
      listen('blur', () => engine?.pointer(-1e4, -1e4, false));
      const onOut = (e: PointerEvent) => !e.relatedTarget && engine?.pointer(-1e4, -1e4, false);
      document.addEventListener('pointerout', onOut);
      cleanups.push(() => document.removeEventListener('pointerout', onOut));
    };

    boot();
    return () => {
      cancelled = true;
      engine?.stop();
      cleanups.forEach((fn) => fn());
    };
  }, [reduced]);

  return (
    <div ref={stageRef} className="world-stage pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="world-canvas absolute inset-0 h-full w-full" data-ready={ready ? 'true' : 'false'} />
    </div>
  );
}
