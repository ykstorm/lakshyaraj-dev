// World generators. A seed picks one of three biomes and every parameter in
// it, so a world is fully reproducible from its seed:
//   ridge  a mountain range of ridged, domain-warped noise you fly over
//   tide   a sea of interfering waves, slow and calm
//   orbit  a spiral constellation, linked to its nearest neighbours
// The contour bands on the terrain biomes follow ThreeUI's Topo Field
// (|fract(k·n) - 0.5|·2); the orbit links fade to zero at their threshold as
// in ThreeUI's Particle Drift. Both are MIT, © 2026 Meng To.
import { gauss, mulberry32, type Rand } from './random';
import { ValueNoise, fbm, ridged } from './noise';

export type Biome = 'ridge' | 'tide' | 'orbit';

export interface Star {
  u: number; // 0..1 across
  v: number; // 0..1 from the top of the canvas to the horizon
  speed: number; // twinkle rate, rad/s
  phase: number;
  size: number; // 0..1, picks the glyph
}

interface Common {
  seed: number;
  biome: Biome;
  stars: Star[];
}

export interface TerrainWorld extends Common {
  kind: 'terrain';
  biome: 'ridge' | 'tide';
  /** Height in [0, 1] at world (x, z) and time t. */
  height: (x: number, z: number, t: number) => number;
  bands: number; // contour lines per unit of height
  relief: number; // world units of height at h = 1
  camHeight: number;
  speed: number; // forward travel, world units per second
}

export interface OrbitWorld extends Common {
  kind: 'orbit';
  biome: 'orbit';
  /** x, y, z, mass for each node. */
  nodes: Float32Array;
  count: number;
  /** pairs of node indices */
  links: Uint32Array;
  linkLen: Float32Array;
  linkRadius: number;
  tilt: number;
  spin: number; // rad/s
}

export type World = TerrainWorld | OrbitWorld;

/** The first world every visitor sees: a ridge, chosen for its shape. */
export const DEFAULT_SEED = 0x5eed0008;

function makeStars(rand: Rand, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    u: rand(),
    v: Math.pow(rand(), 1.35),
    speed: 0.35 + rand() * 1.5,
    phase: rand() * Math.PI * 2,
    size: rand(),
  }));
}

function makeRidge(seed: number, rand: Rand, stars: Star[]): TerrainWorld {
  const n = new ValueNoise(rand);
  const freq = 0.085 + rand() * 0.05;
  const warp = 0.5 + rand() * 0.9;
  const ox = rand() * 100;
  const oz = rand() * 100;
  return {
    kind: 'terrain',
    biome: 'ridge',
    seed,
    stars,
    height: (x, z) => {
      const wx = x * freq + ox;
      const wz = z * freq + oz;
      const q = n.noise(wx * 0.45 + 11.3, wz * 0.45 - 4.1) * warp;
      const raw = ridged(n, wx + q, wz - q * 0.6, 4);
      const h = (raw - 0.36) / 0.56;
      return h < 0 ? 0 : h > 1 ? 1 : h;
    },
    bands: 4 + Math.floor(rand() * 3),
    relief: 5.6 + rand() * 2.4,
    camHeight: 2.1 + rand() * 0.5,
    speed: 0.55 + rand() * 0.35,
  };
}

function makeTide(seed: number, rand: Rand, stars: Star[]): TerrainWorld {
  const n = new ValueNoise(rand);
  const waves = Array.from({ length: 4 }, (_, k) => {
    const angle = Math.PI / 2 + gauss(rand) * 0.55;
    return {
      dx: Math.cos(angle),
      dz: Math.sin(angle),
      freq: 0.32 + rand() * 0.55,
      speed: 0.35 + rand() * 0.7,
      phase: rand() * Math.PI * 2,
      amp: 1 / Math.pow(k + 1, 0.7),
    };
  });
  const total = waves.reduce((s, w) => s + w.amp, 0);
  return {
    kind: 'terrain',
    biome: 'tide',
    seed,
    stars,
    height: (x, z, t) => {
      let s = 0;
      for (const w of waves) s += w.amp * Math.sin((w.dx * x + w.dz * z) * w.freq + w.speed * t + w.phase);
      const swell = fbm(n, x * 0.05, z * 0.05 + t * 0.02, 2);
      return 0.5 + 0.32 * (s / total) + (swell - 0.5) * 0.36;
    },
    bands: 9 + Math.floor(rand() * 4),
    relief: 1.1 + rand() * 0.5,
    camHeight: 1.7 + rand() * 0.3,
    speed: 0.18 + rand() * 0.14,
  };
}

// Links: each node joins its two nearest neighbours inside linkRadius, found
// with a uniform grid instead of testing every pair.
function linkNodes(nodes: Float32Array, count: number, radius: number): { links: Uint32Array; len: Float32Array } {
  const cell = radius;
  const grid = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  for (let i = 0; i < count; i++) {
    const k = key(Math.floor(nodes[i * 4] / cell), Math.floor(nodes[i * 4 + 1] / cell), Math.floor(nodes[i * 4 + 2] / cell));
    const bucket = grid.get(k);
    if (bucket) bucket.push(i);
    else grid.set(k, [i]);
  }
  const pairs: number[] = [];
  const lens: number[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < count; i++) {
    const x = nodes[i * 4];
    const y = nodes[i * 4 + 1];
    const z = nodes[i * 4 + 2];
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const cz = Math.floor(z / cell);
    const near: { j: number; d: number }[] = [];
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++) {
          for (const j of grid.get(key(cx + a, cy + b, cz + c)) ?? []) {
            if (j === i) continue;
            const d = Math.hypot(nodes[j * 4] - x, nodes[j * 4 + 1] - y, nodes[j * 4 + 2] - z);
            if (d < radius) near.push({ j, d });
          }
        }
    near.sort((p, q) => p.d - q.d);
    for (const { j, d } of near.slice(0, 2)) {
      const id = i < j ? i * count + j : j * count + i;
      if (seen.has(id)) continue;
      seen.add(id);
      pairs.push(i, j);
      lens.push(d);
    }
  }
  return { links: Uint32Array.from(pairs), len: Float32Array.from(lens) };
}

function makeOrbit(seed: number, rand: Rand, stars: Star[], dense: boolean): OrbitWorld {
  const count = dense ? 720 : 320;
  const arms = 2 + Math.floor(rand() * 3);
  const twist = 2.2 + rand() * 2.6;
  const coreShare = 0.14;
  const nodes = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    let r: number;
    let angle: number;
    let y: number;
    if (i < count * coreShare) {
      r = Math.abs(gauss(rand)) * 0.1;
      angle = rand() * Math.PI * 2;
      y = gauss(rand) * 0.045;
    } else {
      const t = Math.pow(rand(), 0.6);
      angle = ((i % arms) / arms) * Math.PI * 2 + t * twist + gauss(rand) * 0.26 * (1 - 0.4 * t);
      r = 0.1 + t * 0.9;
      y = gauss(rand) * 0.035 * (1 - 0.5 * t);
    }
    nodes[i * 4] = Math.cos(angle) * r;
    nodes[i * 4 + 1] = y;
    nodes[i * 4 + 2] = Math.sin(angle) * r;
    nodes[i * 4 + 3] = rand();
  }
  const linkRadius = dense ? 0.085 : 0.12;
  const { links, len } = linkNodes(nodes, count, linkRadius);
  return {
    kind: 'orbit',
    biome: 'orbit',
    seed,
    stars,
    nodes,
    count,
    links,
    linkLen: len,
    linkRadius,
    tilt: 0.95 + rand() * 0.35,
    spin: (rand() < 0.5 ? -1 : 1) * (0.045 + rand() * 0.04),
  };
}

/** Builds the world for a seed. `dense` is false on small or touch screens. */
export function createWorld(seed: number, dense: boolean): World {
  const rand = mulberry32(seed);
  const roll = rand();
  const stars = makeStars(rand, dense ? 150 : 70);
  if (roll < 0.45) return makeRidge(seed, rand, stars);
  if (roll < 0.75) return makeTide(seed, rand, stars);
  return makeOrbit(seed, rand, stars, dense);
}
