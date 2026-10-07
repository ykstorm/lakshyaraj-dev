// The hero world must depend on its seed alone: a light screen (`dense`
// false) gets fewer stars, never a different range.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, DEFAULT_SEED } from '../components/world/biomes';
import { WorldEngine } from '../components/world/engine';

test('dense changes the star count, not the terrain', () => {
  const dense = createWorld(DEFAULT_SEED, true);
  const light = createWorld(DEFAULT_SEED, false);
  assert.equal(dense.stars.length, 150);
  assert.equal(light.stars.length, 70);
  assert.deepEqual(light.stars, dense.stars.slice(0, 70));
  for (const key of ['bands', 'relief', 'camHeight', 'speed'] as const) assert.equal(light[key], dense[key], key);
  let differ = 0;
  for (let i = 0; i < 99; i++)
    for (let j = 0; j < 99; j++) {
      const x = -20 + (40 * i) / 98;
      const z = (60 * j) / 98;
      if (light.height(x, z) !== dense.height(x, z)) differ++;
    }
  assert.equal(differ, 0, `${differ} of 9801 heights differ`);
});

// Projection fills the engine's cell arrays without drawing, so a context
// that only takes the size transform is enough.
function projected(width: number, height: number, dense: boolean) {
  const ctx = { setTransform() {} };
  const canvas = { width: 0, height: 0, getContext: () => ctx } as unknown as HTMLCanvasElement;
  const engine = new WorldEngine(canvas, DEFAULT_SEED, { reduced: true, dense });
  engine.resize(width, height, 1, { horizon: 0.55, bias: 0.5 });
  const cells = engine as unknown as {
    project(): void;
    topY: Float32Array;
    depth: Float32Array;
    kind: Uint8Array;
    glyph: Uint8Array;
  };
  cells.project();
  return cells;
}

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  test(`dense and light screens draw the same ridge line at ${width} by ${height}`, () => {
    const dense = projected(width, height, true);
    const light = projected(width, height, false);
    assert.deepEqual(light.topY, dense.topY);
    assert.deepEqual(light.depth, dense.depth);
    assert.deepEqual(light.kind, dense.kind);
    assert.deepEqual(light.glyph, dense.glyph);
  });
}
