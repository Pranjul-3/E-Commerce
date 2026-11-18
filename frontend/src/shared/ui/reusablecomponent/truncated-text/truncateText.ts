import { TEXT_MAX_CHARS } from "./TruncatedText.config";

/**
 * Which part of a too-long text is kept:
 * - "end" (default): the start — `abcdefgh…`  (names, titles)
 * - "start": the end — `…stuvwxyz`  (paths, ids whose end matters)
 * - "middle": both ends — `abcd…wxyz`  (ids and codes that differ at the end)
 */
export type TruncateMode = "start" | "middle" | "end";

export const isTruncated = (text: string, max: number = TEXT_MAX_CHARS) =>
  text.length > max;

/** Cut to `max` characters plus "…" where the text was cut; unchanged when it fits (≤ max). */
export function truncateText(
  text: string,
  max: number = TEXT_MAX_CHARS,
  mode: TruncateMode = "end",
): string {
  if (!isTruncated(text, max)) return text;
  if (mode === "start") return `…${text.slice(text.length - max).trimStart()}`;
  if (mode === "middle") {
    const head = Math.ceil(max / 2);
    const tail = max - head;
    const end = tail > 0 ? text.slice(text.length - tail).trimStart() : "";
    return `${text.slice(0, head).trimEnd()}…${end}`;
  }
  return `${text.slice(0, max).trimEnd()}…`;
}
