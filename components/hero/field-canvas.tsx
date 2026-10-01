'use client';

// The "Still Field" engine. Loaded only on the client via next/dynamic from
// hero-field.tsx, and only when the browser can run it. Raw WebGL1: compile one
// program, draw a fullscreen quad every frame, feed it time, a damped look
// offset, and three colours read from the page's CSS tokens.
//
// The mount effect is deliberately the one dense function here (wiring GL state,
// four listeners, two observers, the frame loop and teardown). Every helper it
// calls stays trivial so the complexity lives in one justified place.

import { useEffect, useRef } from 'react';
import { VERT, FRAG } from './field-shader';

type RGB = [number, number, number];

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readColor(name: string, fallback: RGB): RGB {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return hexToRgb(raw) ?? fallback;
}

// Game-programming-gems critically-damped approach. Returns [value, velocity].
function damp(cur: number, target: number, vel: number, dt: number, smooth: number): [number, number] {
  const omega = 2 / smooth;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (vel + omega * change) * dt;
  return [target + (change + temp) * exp, (vel - omega * temp) * exp];
}

export default function FieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      powerPreference: 'low-power',
      antialias: false,
      alpha: false,
      depth: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT)!);
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG)!);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, 'u_res'),
      time: gl.getUniformLocation(prog, 'u_time'),
      look: gl.getUniformLocation(prog, 'u_look'),
      cell: gl.getUniformLocation(prog, 'u_cell'),
      bg: gl.getUniformLocation(prog, 'u_bg'),
      dot: gl.getUniformLocation(prog, 'u_dot'),
      accent: gl.getUniformLocation(prog, 'u_accent'),
    };

    let colBg: RGB = [0.96, 0.95, 0.93];
    let colDot: RGB = [0.72, 0.71, 0.67];
    let colAccent: RGB = [0.18, 0.54, 0.47];
    const refreshColors = () => {
      colBg = readColor('--background', colBg);
      colDot = readColor('--field-dot', colDot);
      colAccent = readColor('--field-accent', colAccent);
    };
    refreshColors();
    const themeObs = new MutationObserver(refreshColors);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let scale = 1;
    let cell = 0.6;
    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const cw = canvas.clientWidth || 1;
      const ch = canvas.clientHeight || 1;
      let w = cw * dpr * scale;
      let h = ch * dpr * scale;
      if (w > 1440) { h *= 1440 / w; w = 1440; }
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      gl.viewport(0, 0, canvas.width, canvas.height);
      cell = cw < 640 ? 0.6 + (0.5 * (640 - cw)) / 640 : 0.6;
    };
    resize();

    // Pointer: fine pointers steer; coarse (touch) devices drift on their own.
    const fine = window.matchMedia('(pointer: fine)').matches;
    let targetX = 0;
    let targetY = 0;
    const MAX = 0.026; // ~1.5 degrees
    const onMove = (e: MouseEvent) => {
      targetX = ((e.clientX / window.innerWidth) * 2 - 1) * MAX;
      targetY = ((e.clientY / window.innerHeight) * 2 - 1) * MAX;
    };
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });

    let inView = true;
    const io = new IntersectionObserver((es) => { inView = es[0]?.isIntersecting ?? true; }, { threshold: 0 });
    io.observe(canvas);

    let hidden = document.hidden;
    const onVis = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    let raf = 0;
    let lookX = 0, lookY = 0, velX = 0, velY = 0;
    let last = performance.now();
    let slow = 0;
    let primed = false;
    const start = last;

    // Adaptive downscale: sustained frames over 12ms drop the backing scale.
    const maybeDownscale = (now: number, dt: number) => {
      if (now - start < 400) return;
      if (dt * 1000 > 12) slow++; else slow = Math.max(0, slow - 1);
      if (slow > 30 && scale > 0.6) { scale -= 0.2; slow = 0; resize(); }
    };
    const lookTarget = (now: number): [number, number] => [
      fine ? targetX : Math.sin(now * 0.00016) * MAX,
      fine ? targetY : Math.cos(now * 0.00012) * MAX * 0.6,
    ];

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (hidden || !inView) return;
      // Re-read the theme on the first drawn frame, in case the effect mounted
      // before the theme class had settled.
      if (!primed) { primed = true; refreshColors(); }
      maybeDownscale(now, dt);
      const [tx, ty] = lookTarget(now);
      [lookX, velX] = damp(lookX, tx, velX, dt, 0.18);
      [lookY, velY] = damp(lookY, ty, velY, dt, 0.18);

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniform2f(u.look, lookX, lookY);
      gl.uniform1f(u.cell, cell);
      gl.uniform3fv(u.bg, colBg);
      gl.uniform3fv(u.dot, colDot);
      gl.uniform3fv(u.accent, colAccent);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
      if (fine) window.removeEventListener('mousemove', onMove);
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
