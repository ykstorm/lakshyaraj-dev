// The hero world: a seeded ASCII landscape you fly over, or a spiral
// constellation, drawn entirely in code on a Canvas 2D context.
//
// Terrain (ridge, tide) is rendered like a voxel-space engine: each screen
// column marches front to back through the heightfield, so nearer ground hides
// what is behind it and every character cell knows the depth it shows. Cells
// are then classified: a ridgeline (depth jumps above it), a contour line (the
// height band changes between neighbours), or open ground. Ridgelines and
// contours get slope-aware glyphs (/ \ _ ^ -), a cheap CPU cousin of the
// shape-matched glyphs in Canvas UI's Decrypt Reveal.
//
// Interaction is a spring field in screen space: the cursor pushes glyphs and
// they settle back; a click sends a ring that kicks them outward. The ring and
// the pointer easing follow Canvas UI's Force Field (g = exp(-(d-r)²/2σ²)·fade²,
// k = 1 - e^(-dt/τ)); the scramble on disturbed glyphs follows its Decrypt
// Reveal. Canvas UI is MIT + Commons Clause, © 2026 David Haz. These are
// adaptations of its techniques, written for this site, not its components.
import { createWorld, type Biome, type OrbitWorld, type TerrainWorld, type World } from './biomes';
import { hash01, hash2 } from './random';
import { smoothstep } from './noise';
import { GlyphAtlas } from './atlas';

export const CHARS = ' .·:-=+*#%_/\\^|~ABCDEFGHKLMNPRSTUVXYZ0123456789$&<>';
const at = (ch: string) => CHARS.indexOf(ch);
const GL = {
  dot: at('.'),
  mid: at('·'),
  colon: at(':'),
  dash: at('-'),
  eq: at('='),
  plus: at('+'),
  star: at('*'),
  hash: at('#'),
  under: at('_'),
  slash: at('/'),
  back: at('\\'),
  caret: at('^'),
  tilde: at('~'),
};
const POOL_START = at('A');
const POOL_LEN = CHARS.length - POOL_START;

const SKY = 0;
const GROUND = 1;
const CONTOUR = 2;
const RIDGE = 3; // a nearer ridge, standing in front of farther ground
const SKYLINE = 4; // a ridge with open sky above it: drawn in the accent

// spring field, integrated at a fixed 60 Hz
const SPRING = 0.075;
const DAMP = 0.86;
const REPEL_RADIUS = 125;
const REPEL = 2.2;
const WAVE_SPEED = 760; // px/s
const WAVE_SIGMA = 36; // px
const WAVE_LIFE = 1.8; // s
const WAVE_KICK = 6.5;
const STEP = 1 / 60;

const FOV_TAN = Math.tan((32 * Math.PI) / 180);
const Z_FAR = 64;

export interface Composition {
  horizon: number; // 0..1 of canvas height
  bias: number; // 0..1, how much lower the terrain sits on the left
  orbitX: number;
  orbitY: number;
  orbitScale: number; // constellation size; below 1 keeps it clear of the copy
}

export interface EngineOptions {
  reduced: boolean;
  dense: boolean;
  onWorld?: (seed: number, biome: Biome) => void;
}

type Wave = { x: number; y: number; t0: number };

export class WorldEngine {
  private readonly ctx: CanvasRenderingContext2D;
  private atlas: GlyphAtlas | null = null;
  private colours: string[] = ['rgb(233,230,222)', 'rgb(242,169,59)'];
  private family = 'monospace';
  private world: World;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private comp: Composition = { horizon: 0.55, bias: 0, orbitX: 0.6, orbitY: 0.5, orbitScale: 1 };

  private t = 3.7; // start mid-motion, so the first frame is not a blank slate
  private travel = 0;
  private yaw = 0;
  private pitch = 0;
  private yawTarget = 0;
  private pitchTarget = 0;
  private mouseX = -1e4;
  private mouseY = -1e4;
  private presence = 0;
  private presenceTarget = 0;
  private waves: Wave[] = [];
  private reveal = { t0: -100, x: 0, y: 0 };

  // terrain grid
  private cols = 0;
  private rows = 0;
  private cellW = 12;
  private cellH = 19;
  private zNear = 3;
  private steps = new Float32Array(0);
  private depth = new Float32Array(0);
  private hgt = new Float32Array(0);
  private kind = new Uint8Array(0);
  private glyph = new Uint8Array(0);
  private gkey = new Int32Array(0); // quantised world position, pins ground dots to the terrain
  private bridge = new Uint8Array(0); // glyph override for cells that join a steep skyline
  private topY = new Float32Array(0);
  private horizonPx = 0;

  // per point: grid cells for terrain, nodes for orbit
  private n = 0;
  private bx = new Float32Array(0);
  private by = new Float32Array(0);
  private bz = new Float32Array(0);
  private ox = new Float32Array(0);
  private oy = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private energy = new Float32Array(0);

  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    seed: number,
    private readonly opts: EngineOptions,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.ctx = ctx;
    this.world = createWorld(seed, opts.dense);
  }

  get seed(): number {
    return this.world.seed;
  }
  get biome(): Biome {
    return this.world.biome;
  }
  get isRunning(): boolean {
    return this.running;
  }

  setStyle(glyphRgb: string, hotRgb: string, family: string): void {
    this.colours = [`rgb(${glyphRgb})`, `rgb(${hotRgb})`];
    this.family = family;
    this.atlas = null;
  }

  resize(width: number, height: number, dpr: number, comp: Composition): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.comp = comp;
    this.canvas.width = Math.max(1, Math.round(width * dpr));
    this.canvas.height = Math.max(1, Math.round(height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.atlas = null;
    this.layout();
  }

  /** Swaps in the world for `seed`, revealing it outward from `origin`. */
  setSeed(seed: number, origin?: { x: number; y: number }): void {
    this.world = createWorld(seed, this.opts.dense);
    this.layout();
    this.startReveal(origin);
    this.opts.onWorld?.(this.world.seed, this.world.biome);
    if (!this.running) this.renderStill();
  }

  /** First paint: reveal the opening world from the lower middle. */
  intro(): void {
    this.startReveal();
    this.opts.onWorld?.(this.world.seed, this.world.biome);
  }

  pointer(x: number, y: number, inside: boolean): void {
    this.mouseX = x;
    this.mouseY = y;
    this.presenceTarget = inside ? 1 : 0;
    this.yawTarget = inside ? (x / Math.max(1, this.width) - 0.5) * 2 : 0;
    this.pitchTarget = inside ? (y / Math.max(1, this.height) - 0.5) * 2 : 0;
  }

  pulse(x: number, y: number): void {
    if (this.opts.reduced) return;
    this.waves.push({ x, y, t0: this.t });
    if (this.waves.length > 4) this.waves.shift();
  }

  start(): void {
    if (this.running || this.opts.reduced) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** One frame with no motion: the reduced-motion view, and redraws while paused. */
  renderStill(): void {
    this.project();
    this.draw();
  }

  // ── setup ──────────────────────────────────────────────────────────────────
  private layout(): void {
    if (this.world.kind === 'terrain') {
      this.cellW = this.width < 640 ? 10 : this.width < 1100 ? 11 : 12;
      this.cellH = Math.round(this.cellW * 1.6);
      this.cols = Math.ceil(this.width / this.cellW);
      this.rows = Math.ceil(this.height / this.cellH);
      this.n = this.cols * this.rows;
      this.depth = new Float32Array(this.n);
      this.hgt = new Float32Array(this.n);
      this.kind = new Uint8Array(this.n);
      this.glyph = new Uint8Array(this.n);
      this.gkey = new Int32Array(this.n);
      this.bridge = new Uint8Array(this.n);
      this.topY = new Float32Array(this.cols);
    } else {
      this.n = this.world.count;
    }
    this.bx = new Float32Array(this.n);
    this.by = new Float32Array(this.n);
    this.bz = new Float32Array(this.n);
    this.ox = new Float32Array(this.n);
    this.oy = new Float32Array(this.n);
    this.vx = new Float32Array(this.n);
    this.vy = new Float32Array(this.n);
    this.energy = new Float32Array(this.n);
    if (this.world.kind === 'terrain') {
      for (let r = 0; r < this.rows; r++)
        for (let c = 0; c < this.cols; c++) {
          this.bx[r * this.cols + c] = (c + 0.5) * this.cellW;
          this.by[r * this.cols + c] = (r + 0.5) * this.cellH;
        }
    }
  }

  private startReveal(origin?: { x: number; y: number }): void {
    if (this.opts.reduced) return;
    const x = origin?.x ?? this.width * Math.max(0.5, this.comp.orbitX);
    const y = origin?.y ?? this.height * Math.min(0.85, this.comp.horizon + 0.15);
    this.reveal = { t0: this.t, x, y };
    this.waves.push({ x, y, t0: this.t });
  }

  private ensureAtlas(): GlyphAtlas {
    if (!this.atlas) this.atlas = new GlyphAtlas(CHARS, this.family, this.colours, this.dpr);
    return this.atlas;
  }

  // ── frame ──────────────────────────────────────────────────────────────────
  private frame = (now: number): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    // Same cap as the physics accumulator (three 60 Hz steps): real time down
    // to 20 fps, an even slow-down below it, never a jump.
    const dt = Math.min((now - this.last) / 1000, STEP * 3);
    this.last = now;
    this.advance(dt);
    this.draw();
  };

  private advance(dt: number): void {
    this.t += dt;
    if (this.world.kind === 'terrain') this.travel += dt * this.world.speed;
    const kc = 1 - Math.exp(-dt / 0.9);
    this.yaw += (this.yawTarget - this.yaw) * kc;
    this.pitch += (this.pitchTarget - this.pitch) * kc;
    this.presence += (this.presenceTarget - this.presence) * (1 - Math.exp(-dt / 0.2));
    this.waves = this.waves.filter((w) => this.t - w.t0 < WAVE_LIFE);
    this.project();
    this.acc = Math.min(this.acc + dt, STEP * 3);
    while (this.acc >= STEP) {
      this.physicsStep();
      this.acc -= STEP;
    }
    const decay = Math.exp(-dt / 0.45);
    for (let i = 0; i < this.n; i++) this.energy[i] *= decay;
  }

  private physicsStep(): void {
    const { bx, by, ox, oy, vx, vy, energy } = this;
    const mx = this.mouseX;
    const my = this.mouseY;
    const pres = this.presence;
    const r2 = REPEL_RADIUS * REPEL_RADIUS;
    for (let i = 0; i < this.n; i++) {
      const x = bx[i] + ox[i];
      const y = by[i] + oy[i];
      let ax = 0;
      let ay = 0;
      if (pres > 0.01) {
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const d = Math.sqrt(d2) + 1e-3;
          const k = 1 - d / REPEL_RADIUS;
          const f = REPEL * k * k * pres;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
          if (k * pres > energy[i]) energy[i] = k * pres;
        }
      }
      for (const w of this.waves) {
        const dx = x - w.x;
        const dy = y - w.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 1e-3;
        const tau = this.t - w.t0;
        const off = d - WAVE_SPEED * tau;
        if (off > WAVE_SIGMA * 3 || off < -WAVE_SIGMA * 3) continue;
        const fade = 1 - smoothstep(0.55, WAVE_LIFE, tau);
        const g = Math.exp(-(off * off) / (2 * WAVE_SIGMA * WAVE_SIGMA)) * fade * fade;
        ax += (dx / d) * g * WAVE_KICK;
        ay += (dy / d) * g * WAVE_KICK;
        if (g > energy[i]) energy[i] = g;
      }
      vx[i] = (vx[i] + ax - SPRING * ox[i]) * DAMP;
      vy[i] = (vy[i] + ay - SPRING * oy[i]) * DAMP;
      ox[i] += vx[i];
      oy[i] += vy[i];
    }
  }

  // ── projection ─────────────────────────────────────────────────────────────
  private project(): void {
    if (this.world.kind === 'terrain') {
      this.march(this.world);
      this.classify(this.world);
    } else {
      this.projectOrbit(this.world);
    }
  }

  private march(w: TerrainWorld): void {
    const { cols, rows, cellW, cellH, width: W, height: H, depth, hgt, gkey, topY } = this;
    const horizon = H * this.comp.horizon + this.pitch * H * 0.035;
    this.horizonPx = horizon;
    const below = Math.max(40, H - horizon);
    const f = below / FOV_TAN;
    // the bottom edge of the canvas sees the ground at this depth
    const zNear = (w.camHeight * f) / below;
    if (Math.abs(zNear - this.zNear) > 1e-3 || this.steps.length === 0) {
      this.zNear = zNear;
      const K = this.opts.dense ? 96 : 64;
      this.steps = new Float32Array(K);
      for (let k = 0; k < K; k++) this.steps[k] = zNear * Math.pow(Z_FAR / zNear, k / (K - 1));
    }
    const camX = this.yaw * 2.4 + Math.sin(this.t * 0.07) * 1.6;
    const plainEnd = zNear * 3.6;
    depth.fill(Infinity);
    for (let c = 0; c < cols; c++) {
      const u = (c + 0.5) / cols;
      // Wide screens put the copy in the left half, so the ground stays low
      // there and rises to full height only past it. bias is 0 on small screens.
      const sideLift = 1 - this.comp.bias * (1 - smoothstep(0.34, 0.78, u));
      const ray = ((c + 0.5) * cellW - W / 2) / f;
      let row = rows - 1;
      let yMax = H + cellH;
      for (let k = 0; k < this.steps.length && row >= 0; k++) {
        const z = this.steps[k];
        const lift = (0.14 + 0.86 * smoothstep(zNear * 1.15, plainEnd, z)) * sideLift;
        const wx = ray * z + camX;
        const wz = z + this.travel;
        const h = w.height(wx, wz, this.t);
        const sy = horizon + ((w.camHeight - h * w.relief * lift) * f) / z;
        if (sy >= yMax) continue;
        const key = Math.floor(wx * 2.2) * 7919 + Math.floor(wz * 2.2);
        while (row >= 0 && (row + 0.5) * cellH >= sy) {
          const i = row * cols + c;
          depth[i] = z;
          hgt[i] = h;
          gkey[i] = key;
          row--;
        }
        yMax = sy;
      }
      topY[c] = (row + 1) * cellH;
    }
  }

  private band(i: number, bands: number): number {
    return Math.floor(this.hgt[i] * bands);
  }

  // Hierarchy, strongest first: the skyline (ground with open sky above), inner
  // ridges (a big depth jump above), contours (near ground only), then a faint
  // texture on everything else so mountains read as mass against an empty sky.
  private classify(w: TerrainWorld): void {
    const { cols, rows, depth, kind } = this;
    const contourDepth = this.zNear * 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const z = depth[i];
        if (z === Infinity) {
          kind[i] = SKY;
          continue;
        }
        const above = r > 0 ? depth[i - cols] : Infinity;
        if (above === Infinity) kind[i] = SKYLINE;
        else if (above > z * 1.75 + 0.8) kind[i] = RIDGE;
        else if (z < contourDepth && r < rows - 1 && depth[i + cols] !== Infinity && this.band(i + cols, w.bands) !== this.band(i, w.bands))
          kind[i] = CONTOUR;
        else kind[i] = GROUND;
      }
    }
    this.bridgeSkyline();
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) this.glyph[r * cols + c] = this.pickGlyph(c, r);
  }

  // On a steep slope the skyline jumps several rows between neighbouring
  // columns. The cells in between become skyline too, drawn as / or \, so the
  // outline of each mountain stays unbroken.
  private bridgeSkyline(): void {
    const { cols, rows, kind, bridge, cellH } = this;
    bridge.fill(0);
    for (let c = 0; c < cols - 1; c++) {
      const a = Math.round(this.topY[c] / cellH);
      const b = Math.round(this.topY[c + 1] / cellH);
      if (a >= rows || b >= rows) continue;
      if (b < a - 1) {
        for (let r = b + 1; r < a; r++) {
          kind[r * cols + c + 1] = SKYLINE;
          bridge[r * cols + c + 1] = GL.slash;
        }
      } else if (a < b - 1) {
        for (let r = a + 1; r < b; r++) {
          kind[r * cols + c] = SKYLINE;
          bridge[r * cols + c] = GL.back;
        }
      }
    }
  }

  private is(c: number, r: number, k: number): boolean {
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return false;
    const got = this.kind[r * this.cols + c];
    return got === k || (k === RIDGE && got === SKYLINE);
  }

  // A line's glyph follows its neighbours: rising to the right is /, falling
  // is \, level is _ (ridgeline) or - (contour), a lone summit is ^.
  private lineGlyph(c: number, r: number, k: number): number {
    const lUp = this.is(c - 1, r - 1, k);
    const lSame = this.is(c - 1, r, k);
    const lDown = this.is(c - 1, r + 1, k);
    const rUp = this.is(c + 1, r - 1, k);
    const rSame = this.is(c + 1, r, k);
    const rDown = this.is(c + 1, r + 1, k);
    const level = k === RIDGE ? GL.under : GL.dash;
    if (k === RIDGE && lDown && rDown && !lSame && !rSame) return GL.caret;
    if (lDown && rUp) return GL.slash;
    if (lUp && rDown) return GL.back;
    if (lSame || rSame) return level;
    if (lDown || rUp) return GL.slash;
    if (lUp || rDown) return GL.back;
    return k === RIDGE ? GL.caret : GL.tilde;
  }

  private pickGlyph(c: number, r: number): number {
    const i = r * this.cols + c;
    const k = this.kind[i];
    if (this.bridge[i]) return this.bridge[i];
    if (k === RIDGE || k === SKYLINE) return this.lineGlyph(c, r, RIDGE);
    if (k === CONTOUR) return this.lineGlyph(c, r, k);
    if (k !== GROUND) return 0;
    // Body texture: dots pinned to world positions, so they stream past as you
    // fly. Slopes facing the light (from the left) are stippled denser, so the
    // mountains read as lit and shaded volumes against the empty sky.
    const z = this.depth[i];
    const near = 1 - smoothstep(this.zNear, this.zNear * 5, z);
    const lit = this.facing(c, i, z);
    const p = hash2(this.gkey[i], 17);
    const density = 0.08 + 0.14 * near + 0.3 * lit;
    if (p >= density) return 0;
    return lit > 0.6 && p < density * 0.4 ? GL.colon : GL.dot;
  }

  /** 0..1: how squarely the ground at cell i faces a light from the left. */
  private facing(c: number, i: number, z: number): number {
    if (c === 0 || c === this.cols - 1) return 0.5;
    const l = i - 1;
    const r = i + 1;
    const dl = this.depth[l];
    const dr = this.depth[r];
    if (dl === Infinity || dr === Infinity || Math.abs(dl - dr) > z * 0.35) return 0.5;
    return smoothstep(-0.05, 0.05, this.hgt[r] - this.hgt[l]);
  }

  private projectOrbit(w: OrbitWorld): void {
    const { width: W, height: H } = this;
    const theta = this.t * w.spin + this.yaw * 0.5;
    const phi = w.tilt + this.pitch * 0.18;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);
    const dist = 2.7;
    const scale = Math.min(W * 0.36, H * 0.5) * dist * this.comp.orbitScale;
    const cx = W * this.comp.orbitX;
    const cy = H * this.comp.orbitY;
    const nodes = w.nodes;
    for (let i = 0; i < w.count; i++) {
      const x = nodes[i * 4];
      const y = nodes[i * 4 + 1];
      const z = nodes[i * 4 + 2];
      const x1 = x * cosT - z * sinT;
      const z1 = x * sinT + z * cosT;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      const s = scale / (dist + z2);
      this.bx[i] = cx + x1 * s;
      this.by[i] = cy + y2 * s;
      this.bz[i] = (z2 + 1) * 0.5; // 0 near .. 1 far
    }
  }

  // ── drawing ────────────────────────────────────────────────────────────────
  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const atlas = this.ensureAtlas();
    this.drawStars(atlas);
    if (this.world.kind === 'terrain') this.drawTerrain(atlas);
    else this.drawOrbit(atlas, this.world);
    ctx.globalAlpha = 1;
  }

  // Result of shown(), kept in fields so the per-glyph hot path allocates nothing.
  private outG = 0;
  private outHot = false;
  private outMul = 1;

  /** Picks the glyph shown at point i, honouring the reveal scramble and any disturbance. */
  private shown(i: number, base: number, x: number, y: number): void {
    const since = this.t - this.reveal.t0;
    if (since < 1.6) {
      const reach = Math.hypot(x - this.reveal.x, y - this.reveal.y) / Math.hypot(this.width, this.height);
      if (since < reach * 1.1 + hash01(i) * 0.35) {
        this.outG = POOL_START + Math.floor(hash2(i, Math.floor(this.t * 14)) * POOL_LEN);
        this.outHot = true;
        this.outMul = smoothstep(0, 0.25, since) * 0.7;
        return;
      }
    }
    const e = this.energy[i];
    this.outMul = 1;
    if (e > 0.45) {
      this.outG = POOL_START + Math.floor(hash2(i, Math.floor(this.t * 12)) * POOL_LEN);
      this.outHot = true;
      return;
    }
    this.outG = base;
    this.outHot = e > 0.12;
  }

  private drawTerrain(atlas: GlyphAtlas): void {
    const ctx = this.ctx;
    const { cols, rows, depth, kind, glyph, bx, by, ox, oy, energy, cellH } = this;
    const zNear = this.zNear;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const base = glyph[i];
        if (base === 0) continue;
        const z = depth[i];
        const fog = smoothstep(zNear, Z_FAR * 0.8, z);
        const k = kind[i];
        // Ground and contours carry the landscape, so they stay legible at rest;
        // the far fade keeps about a third of the strength instead of a fifth.
        const strength = k === SKYLINE ? 0.95 : k === RIDGE ? 0.78 : k === CONTOUR ? 0.44 + 0.14 * (1 - fog) : 0.34;
        const alpha = strength * (1 - 0.62 * Math.pow(fog, 0.85));
        const x = bx[i] + ox[i];
        const y = by[i] + oy[i];
        this.shown(i, base, x, y);
        const e = energy[i];
        const hot = this.outHot || k === SKYLINE;
        ctx.globalAlpha = Math.min(1, (this.outHot ? Math.max(alpha, 0.35 + 0.6 * e) : alpha) * this.outMul);
        const size = cellH * (0.86 - 0.24 * fog);
        atlas.draw(ctx, this.outG, hot ? 1 : 0, x, y, size);
      }
    }
  }

  private drawOrbit(atlas: GlyphAtlas, w: OrbitWorld): void {
    const ctx = this.ctx;
    const { bx, by, bz, ox, oy, energy } = this;
    // links, batched into four alpha levels so each level is one stroke
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.colours[0];
    for (let level = 1; level <= 4; level++) {
      ctx.globalAlpha = level * 0.06;
      ctx.beginPath();
      for (let l = 0; l < w.linkLen.length; l++) {
        const a = w.links[l * 2];
        const b = w.links[l * 2 + 1];
        const depthFade = 1 - 0.75 * ((bz[a] + bz[b]) * 0.5);
        const v = (1 - w.linkLen[l] / w.linkRadius) * depthFade;
        if (Math.min(4, Math.max(1, Math.ceil(v * 4))) !== level || v <= 0.02) continue;
        ctx.moveTo(bx[a] + ox[a], by[a] + oy[a]);
        ctx.lineTo(bx[b] + ox[b], by[b] + oy[b]);
      }
      ctx.stroke();
    }
    const coreCount = Math.floor(w.count * 0.14);
    for (let i = 0; i < w.count; i++) {
      const mass = w.nodes[i * 4 + 3];
      const near = 1 - bz[i];
      const base = mass > 0.97 ? GL.hash : mass > 0.86 ? GL.star : mass > 0.55 || i < coreCount ? GL.plus : GL.mid;
      const x = bx[i] + ox[i];
      const y = by[i] + oy[i];
      this.shown(i, base, x, y);
      const alpha = (0.22 + 0.78 * near) * (i < coreCount ? 1 : 0.85);
      ctx.globalAlpha = Math.min(1, (this.outHot ? Math.max(alpha, 0.4 + 0.6 * energy[i]) : alpha) * this.outMul);
      atlas.draw(ctx, this.outG, this.outHot ? 1 : 0, x, y, 7 + 10 * near);
    }
  }

  private drawStars(atlas: GlyphAtlas): void {
    const ctx = this.ctx;
    const terrain = this.world.kind === 'terrain';
    const skyBottom = terrain ? this.horizonPx : this.height;
    const drift = this.yaw * 6;
    for (let i = 0; i < this.world.stars.length; i++) {
      const s = this.world.stars[i];
      const x = (((s.u * this.width - drift) % this.width) + this.width) % this.width;
      const y = s.v * skyBottom * 0.96;
      if (terrain) {
        const col = Math.min(this.cols - 1, Math.max(0, Math.floor(x / this.cellW)));
        if (y > this.topY[col] - this.cellH * 0.6) continue; // behind a ridge
      }
      const twinkle = smoothstep(0.55, 1, Math.sin(s.speed * this.t + s.phase));
      const b = 0.25 + 0.75 * twinkle;
      ctx.globalAlpha = b * (0.75 - 0.4 * s.v);
      const g = s.size > 0.93 ? GL.plus : s.size > 0.7 ? GL.mid : GL.dot;
      atlas.draw(ctx, g, 0, x, y, 10 + s.size * 4);
    }
  }
}
