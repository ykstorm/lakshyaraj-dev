// A tiny event bus between the hero canvas and the things that drive it: the
// "New world" button and the terminal's `world` and `seed` commands. The canvas
// loads lazily, so commands are window events rather than shared React state.
// dispatchEvent is synchronous, so after sendWorldCommand returns, the new
// world has already been announced and currentWorld() reflects it.
import type { Biome } from './biomes';

type WorldInfo = { seed: number; biome: Biome };
type WorldCommand = { type: 'new' } | { type: 'seed'; seed: number };

const COMMAND = 'world:command';
const CHANGED = 'world:changed';

let current: WorldInfo | null = null;

export function sendWorldCommand(cmd: WorldCommand): void {
  window.dispatchEvent(new CustomEvent<WorldCommand>(COMMAND, { detail: cmd }));
}

export function onWorldCommand(fn: (cmd: WorldCommand) => void): () => void {
  const handler = (e: Event) => fn((e as CustomEvent<WorldCommand>).detail);
  window.addEventListener(COMMAND, handler);
  return () => window.removeEventListener(COMMAND, handler);
}

export function announceWorld(info: WorldInfo): void {
  current = info;
  window.dispatchEvent(new CustomEvent<WorldInfo>(CHANGED, { detail: info }));
}

/** useSyncExternalStore-compatible subscription. */
export function subscribeWorld(onChange: () => void): () => void {
  window.addEventListener(CHANGED, onChange);
  return () => window.removeEventListener(CHANGED, onChange);
}

export function currentWorld(): WorldInfo | null {
  return current;
}
