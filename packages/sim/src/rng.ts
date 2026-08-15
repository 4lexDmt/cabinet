import type { SeededRng } from "./types.ts";

/** xorshift32. Same seed always yields the same sequence. */
export function createRng(seed: number): SeededRng {
  let state = seed >>> 0;
  if (state === 0) state = 0x9e3779b9;

  function nextU32(): number {
    let x = state;
    x ^= (x << 13) >>> 0;
    x ^= x >>> 17;
    x ^= (x << 5) >>> 0;
    state = x >>> 0;
    return state;
  }

  return {
    nextU32,
    int(maxExclusive: number): number {
      if (maxExclusive <= 0) return 0;
      return nextU32() % maxExclusive;
    },
    intRange(minInclusive: number, maxExclusive: number): number {
      const span = maxExclusive - minInclusive;
      if (span <= 0) return minInclusive;
      return minInclusive + (nextU32() % span);
    },
    chanceMille(mille: number): boolean {
      if (mille <= 0) return false;
      if (mille >= 10_000) return true;
      return nextU32() % 10_000 < mille;
    },
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) {
        throw new Error("rng.pick on empty list");
      }
      return items[nextU32() % items.length] as T;
    },
    shuffleInPlace<T>(items: T[]): T[] {
      for (let i = items.length - 1; i > 0; i--) {
        const j = nextU32() % (i + 1);
        const tmp = items[i] as T;
        items[i] = items[j] as T;
        items[j] = tmp;
      }
      return items;
    },
  };
}

export function mixSeed(matchSeed: number, tick: number): number {
  let h = matchSeed >>> 0;
  h = Math.imul(h ^ tick, 0x9e3779b9) >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) >>> 0;
  h ^= h >>> 13;
  return h >>> 0;
}
