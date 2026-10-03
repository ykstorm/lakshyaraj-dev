// Seeded randomness for the hero world. Every world is a pure function of its
// seed: the same seed always draws the same terrain, sky and constellation.
//
// mulberry32 (Tommy Ettinger, public domain) seeds per-world parameters and
// initial positions. hash01 (Chris Wellons' lowbias32) gives stateless
// per-glyph randomness, so a glyph's flicker depends only on (index, tick),
// the same idea Canvas UI's Glyph Rain and Decrypt Reveal use on the GPU.

export type Rand = () => number;

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless hash of an integer to [0, 1). */
export function hash01(n: number): number {
  let x = n | 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/** Hash of two integers, for (glyph index, time tick) pairs. */
export function hash2(a: number, b: number): number {
  return hash01(Math.imul(a, 0x27d4eb2d) ^ Math.imul(b + 0x165667b1, 0x9e3779b1));
}

/** Approximately normal, mean 0, sd about 1 (sum of three uniforms). */
export function gauss(rand: Rand): number {
  return (rand() + rand() + rand() - 1.5) * 2;
}

/** A fresh random seed for "new world". Uses crypto when available. */
export function randomSeed(): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    return crypto.getRandomValues(new Uint32Array(1))[0] >>> 0;
  }
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

export function seedToHex(seed: number): string {
  return (seed >>> 0).toString(16).padStart(8, '0');
}

/** Parses a seed as shown on screen: 1 to 8 hex digits, optional 0x. */
export function parseSeed(input: string): number | null {
  const s = input.trim().toLowerCase().replace(/^0x/, '');
  return /^[0-9a-f]{1,8}$/.test(s) ? parseInt(s, 16) >>> 0 : null;
}
