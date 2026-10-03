'use client';

import { useSyncExternalStore } from 'react';
import { currentWorld, sendWorldCommand, subscribeWorld } from './bus';
import { seedToHex } from './random';

// The world's name and seed, and a button for a new one. The same seed always
// draws the same world, and the hero terminal accepts it: `seed 5eed1e55`.
export function WorldControls() {
  const world = useSyncExternalStore(subscribeWorld, currentWorld, () => null);

  return (
    <div
      className="mono panel flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 text-[12px] text-muted-foreground"
      data-no-wave
    >
      <p aria-live="polite" className="tabular-nums">
        {world ? (
          <>
            world=<span className="text-foreground">{world.biome}</span>{' '}
            seed=<span className="text-foreground">{seedToHex(world.seed)}</span>
          </>
        ) : (
          <span>world loading</span>
        )}
      </p>
      <button
        type="button"
        onClick={() => sendWorldCommand({ type: 'new' })}
        disabled={!world}
        className="rounded-[4px] border border-border-strong px-2.5 py-1 text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        New world
      </button>
      <p className="world-hint">
        <span className="hint-fine">Move the cursor to push it. Click to send a wave.</span>
        <span className="hint-touch">Tap to send a wave.</span>
      </p>
    </div>
  );
}
