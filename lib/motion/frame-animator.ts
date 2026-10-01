/*
 * frame-animator — adapted (~40 lines) from oil-oil/oil-motion.
 * Source: https://github.com/oil-oil/oil-motion
 *
 * MIT License. Copyright (c) oil-oil and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

// smoothDamp: critically-damped approach of `current` toward `target`, the
// Game Programming Gems 4 formulation. `vel` is carried across calls.
export function smoothDamp(
  current: number,
  target: number,
  vel: { value: number },
  smoothTime: number,
  dt: number,
): number {
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (vel.value + omega * change) * dt;
  vel.value = (vel.value - omega * temp) * exp;
  return target + (change + temp) * exp;
}

export interface FrameAnimator {
  readonly frameCount: number;
  set(target: number): void;
  tick(dt: number): number;
  snap(frame: number): void;
}

// Drives a frame index [0, frameCount-1] toward a target through smoothDamp, so
// the value lags its target and rewinds when the target drops, without overshoot.
export function createFrameAnimator(frameCount: number, smoothTime: number): FrameAnimator {
  const max = frameCount - 1;
  const vel = { value: 0 };
  let current = 0;
  let target = 0;
  return {
    frameCount,
    set(t) { target = Math.max(0, Math.min(max, t)); },
    tick(dt) { current = smoothDamp(current, target, vel, smoothTime, dt); return current; },
    snap(f) { current = target = Math.max(0, Math.min(max, f)); vel.value = 0; },
  };
}
