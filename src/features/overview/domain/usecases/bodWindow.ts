import { minutesOf, type TimeIST } from '@/core/domain';

import type { BodWindow } from '../entities';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Position of a time on the window scale (start → end), 0–1. */
export function windowRatio(w: BodWindow, t: TimeIST): number {
  const span = minutesOf(w.end) - minutesOf(w.start);
  return span <= 0 ? 0 : clamp01((minutesOf(t) - minutesOf(w.start)) / span);
}

/** Minutes until the cutoff (never negative). */
export const minutesToCutoff = (w: BodWindow, now: TimeIST): number =>
  Math.max(0, minutesOf(w.cutoff) - minutesOf(now));
