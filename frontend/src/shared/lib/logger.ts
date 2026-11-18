/**
 * The ONE place the app logs from — never call `console.*` directly.
 *
 * Same methods and signatures as `console` (log, info, warn, error, debug, trace, table, group, time, …),
 * so `console.x(...)` becomes `logger.x(...)`.
 *
 * Logs only show while developing (`npm run dev`, mode "dev"). In the production build
 * (`npm run build:prod`, mode "prod") every method is a no-op: `import.meta.env.MODE` is replaced at build
 * time, so the bundle keeps no logging code, and the build additionally strips any stray `console.*`.
 */

/** True only in development builds / the dev server. */
export const LOGS_ENABLED = import.meta.env.MODE !== "prod";

/** Every console method the app may use (all of them keep console's own signature). */
const METHODS = [
  // messages
  "log",
  "info",
  "warn",
  "error",
  "debug",
  // stack trace / assertions
  "trace",
  "assert",
  // structured output
  "table",
  "dir",
  "dirxml",
  // grouping
  "group",
  "groupCollapsed",
  "groupEnd",
  // timing
  "time",
  "timeLog",
  "timeEnd",
  // counting
  "count",
  "countReset",
  // housekeeping
  "clear",
] as const satisfies ReadonlyArray<keyof Console>;

type LogMethod = (typeof METHODS)[number];
export type Logger = Pick<Console, LogMethod>;

const noop = (): void => undefined;

/* eslint-disable no-console -- the logger is the only allowed caller of console.* */
export const logger: Logger = Object.fromEntries(
  METHODS.map((method) => [
    method,
    // Bound so the browser shows the real call site and keeps console's own formatting.
    LOGS_ENABLED ? console[method].bind(console) : noop,
  ]),
) as Logger;
/* eslint-enable no-console */
