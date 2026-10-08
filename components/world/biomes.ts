// The world behind the hero: a mountain range of ridged, domain-warped noise
// that the camera flies over, plus a sky of stars. Every parameter comes from
// one seed, so the same seed always draws the same range. The contour bands
// follow ThreeUI's Topo Field (|fract(k·n) - 0.5|·2), MIT, © 2026 Meng To.
import { mulberry32, type Rand } from './random';
import { ValueNoise, ridged } from './noise';

export interface Star {
  u: number; // 0..1 across
  v: number; // 0..1 from the top of the canvas to the horizon
  speed: number; // twinkle rate, rad/s
  phase: number;
  size: number; // 0..1, picks the glyph
}

export interface TerrainWorld {
  stars: Star[];
  /** Height in [0, 1] at world (x, z). */
  height: (x: number, z: number) => number;
  bands: number; // contour lines per unit of height
  relief: number; // world units of height at h = 1
  camHeight: number;
  speed: number; // forward travel, world units per second
}

/** The range every visitor sees, chosen for its shape. */
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

/**
 * Builds the world for a seed. `dense` is false on small or touch screens and
 * only thins the sky: the terrain comes from the seed alone.
 */
export function createWorld(seed: number, dense: boolean): TerrainWorld {
  const rand = mulberry32(seed);
  rand(); // the first draw once picked a biome; kept so the seed draws the same range
  // Every screen draws all 150 stars, so the terrain below always starts from
  // the same point in the sequence; a light screen shows only the first 70.
  const sky = makeStars(rand, 150);
  const stars = dense ? sky : sky.slice(0, 70);
  const n = new ValueNoise(rand);
  const freq = 0.085 + rand() * 0.05;
  const warp = 0.5 + rand() * 0.9;
  const ox = rand() * 100;
  const oz = rand() * 100;
  return {
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
