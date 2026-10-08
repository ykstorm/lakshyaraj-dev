// The footer name settles out of the hero's glyphs as it scrolls into view.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NAME, POOL, glyphAt } from '../components/footer-glyphs';

const shown = (p: number) => Array.from(NAME, (_, i) => glyphAt(i, p)).join('');

test('the pool is the world glyphs: several, no letters, no blank', () => {
  assert.ok(POOL.length > 1, `pool is ${JSON.stringify(POOL)}`);
  assert.doesNotMatch(POOL, /[A-Za-z0-9\s]/);
});

test('at progress 1 (server render, first paint, reduced motion) the name is settled', () => {
  assert.equal(shown(1), NAME);
});

test('at progress 0 every letter is a pool glyph and the spaces stay', () => {
  const s = shown(0);
  assert.equal(s.length, NAME.length);
  for (let i = 0; i < NAME.length; i++) {
    if (NAME[i] === ' ') assert.equal(s[i], ' ');
    else assert.ok(POOL.includes(s[i]), `letter ${i} shows ${s[i]}`);
  }
});

test('scrolling changes the unsettled glyphs and never unsettles a settled one', () => {
  const last = NAME.length - 1;
  const seen = new Set<string>();
  let settled = false;
  for (let k = 0; k <= 200; k++) {
    const g = glyphAt(last, k / 200);
    if (g === NAME[last]) settled = true;
    else {
      assert.equal(settled, false, `letter ${last} unsettled again at ${k / 200}`);
      seen.add(g);
    }
  }
  assert.ok(settled);
  assert.ok(seen.size > 1, `only ${[...seen].join('')} while unsettled`);
});
