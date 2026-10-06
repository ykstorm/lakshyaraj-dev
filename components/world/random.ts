// Seeded randomness for the hero world. The world is a pure function of its
// seed: the same seed always draws the same range and sky.
//
// mulberry32 (Tommy Ettinger, public domain) seeds the world's parameters and
// star positions. hash01 (Chris Wellons' lowbias32) gives stateless per-glyph
// randomness, so a glyph's stipple depends only on its index, the same idea
// Canvas UI's Glyph Rain uses on the GPU.

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

/** Hash of two integers, for (glyph index, salt) pairs. */
export function hash2(a: number, b: number): number {
  return hash01(Math.imul(a, 0x27d4eb2d) ^ Math.imul(b + 0x165667b1, 0x9e3779b1));
}
