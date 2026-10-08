// CPU cost of one hero-world frame, outside the browser. Canvas calls are
// counted, not executed, so the number is the JS side only: raymarch,
// classify, physics, glyph selection. Run with Node 22.18 or later:
// node --import ./tests/resolve-ts.mjs scripts/bench-world.mts [width] [height]
import { performance } from 'node:perf_hooks';

let draws = 0;
const ctx = {
  setTransform() {},
  clearRect() {},
  drawImage() {
    draws++;
  },
  beginPath() {},
  moveTo() {},
  lineTo() {},
  stroke() {},
  fillText() {},
  globalAlpha: 1,
  lineWidth: 1,
  strokeStyle: '',
  fillStyle: '',
  font: '',
  textAlign: '',
  textBaseline: '',
};
const fakeCanvas = () => ({ width: 0, height: 0, getContext: () => ctx });
(globalThis as { document?: unknown }).document = { createElement: fakeCanvas };

const { WorldEngine } = await import('../components/world/engine');

const W = Number(process.argv[2] ?? 1920);
const H = Number(process.argv[3] ?? 1080);
const comp = { horizon: 0.55, bias: 0.5 };

for (const seed of [7, 9, 12, 14, 0x5eed0008]) {
  const eng = new WorldEngine(fakeCanvas() as unknown as HTMLCanvasElement, seed, { reduced: false, dense: true });
  eng.resize(W, H, 2, comp);
  eng.intro();
  const priv = eng as unknown as { advance(dt: number): void; draw(): void };
  // warm up the JIT, then time steady state with a click wave in flight
  for (let i = 0; i < 30; i++) {
    priv.advance(1 / 60);
    priv.draw();
  }
  eng.pulse(W / 2, H / 2);
  eng.pointer(W * 0.4, H * 0.6, true);
  draws = 0;
  const frames = 120;
  let sim = 0;
  let paint = 0;
  for (let i = 0; i < frames; i++) {
    const a = performance.now();
    priv.advance(1 / 60);
    const b = performance.now();
    priv.draw();
    sim += b - a;
    paint += performance.now() - b;
  }
  console.log(
    `seed ${seed.toString(16)} sim ${(sim / frames).toFixed(2)}ms  draw-js ${(paint / frames).toFixed(2)}ms  drawImage/frame ${Math.round(draws / frames)}`,
  );
}
