export type LengthCounter = (value: string) => number;

export const defaultCountLength: LengthCounter = (value) => value.length;

/** Longest prefix of `value` whose counted length fits `limit` (binary search, works with custom counters). */
export function truncateToLimit(
  value: string,
  limit: number,
  count: LengthCounter = defaultCountLength,
): string {
  if (count(value) <= limit) return value;
  let low = 0;
  let high = value.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (count(value.slice(0, mid)) <= limit) low = mid;
    else high = mid - 1;
  }
  return value.slice(0, low);
}

/** Example counter: every non-empty `[variable]` counts as `weight` characters. */
export const bracketAwareLength =
  (weight = 10): LengthCounter =>
  (value) =>
    value.replace(/\[[^\]]+\]/g, "x".repeat(weight)).replace(/\[\]/g, "")
      .length;
