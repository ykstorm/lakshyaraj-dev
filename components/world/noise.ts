// Seeded 2D value noise with a quintic fade, plus the two fractal sums the
// terrain biomes use. Value noise is enough here: it is sampled on a coarse
// glyph grid, where its lattice artefacts are below one character.
import type { Rand } from './random';

export class ValueNoise {
  private perm = new Uint8Array(512);
  private vals = new Float32Array(256);

  constructor(rand: Rand) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
      this.vals[i] = rand() * 2 - 1;
    }
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  /** Noise in [-1, 1]. */
  noise(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const p = this.perm;
    const v = this.vals;
    const aa = v[p[p[X] + Y]];
    const ab = v[p[p[X] + Y + 1]];
    const ba = v[p[p[X + 1] + Y]];
    const bb = v[p[p[X + 1] + Y + 1]];
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const w = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const top = aa + (ba - aa) * u;
    const bottom = ab + (bb - ab) * u;
    return top + (bottom - top) * w;
  }
}

/** Ridged fractal noise in [0, 1]: sharp crests, for mountain ranges. */
export function ridged(n: ValueNoise, x: number, y: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    const r = 1 - Math.abs(n.noise(x * freq, y * freq));
    sum += r * r * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

/** Plain fractal noise in [0, 1]: soft rolling ground. */
export function fbm(n: ValueNoise, x: number, y: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += n.noise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.01;
  }
  return (sum / norm) * 0.5 + 0.5;
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}
