// Which glyph each letter of the footer name shows at scroll progress p, from 0
// as the name enters at the bottom of the screen to 1 once it has risen a
// third of the way up. An unsettled letter shows one of the glyphs the hero
// range is drawn in, so the name settles out of the same characters. Kept apart
// from the component so it can be tested without React.
import { CHARS } from './world/chars';
import { hash01, hash2 } from './world/random';

export const NAME = 'Lakshyaraj Singh Rao';
/** The world's glyphs without the blank, so an unsettled letter never vanishes. */
export const POOL = CHARS.replaceAll(' ', '');
const FRAMES = 48; // scroll positions that change the unsettled glyphs

export function glyphAt(i: number, p: number): string {
  const ch = NAME[i];
  if (ch === ' ') return ch;
  // in [0, 0.96): strictly past it, so the first letter (hash01(0) is 0) is
  // not settled before the footer is on screen, and all are settled at 1
  const settleAt = (i / NAME.length) * 0.8 + hash01(i) * 0.2;
  if (p > settleAt) return ch;
  return POOL[Math.floor(hash2(i, Math.floor(p * FRAMES)) * POOL.length)];
}
