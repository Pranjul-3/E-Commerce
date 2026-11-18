import { LOG_TEXT } from "@/shared/config/constants";
import { logger } from "./logger";

// Small localStorage persistence for chosen Redux slices (no extra library), with versioned upgrades.
// Why saved data was dropped is logged (dev only), so "my draft disappeared" can be explained.

export type PersistedSlices = Record<string, unknown>;

/** Turns data saved by version N into the shape of version N + 1. */
export type PersistMigration = (slices: PersistedSlices) => PersistedSlices;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Saved slices brought up to `version`, or undefined when there is nothing usable: private mode, bad JSON,
 * saved by a newer app, or an older version with no upgrade path (a missing step or one that throws).
 * `migrations[n]` upgrades version n to n + 1; they run one after another, oldest first.
 */
export function loadPersisted(
  key: string,
  version: number,
  migrations: Readonly<Record<number, PersistMigration>> = {},
): PersistedSlices | undefined {
  let parsed: unknown;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    parsed = JSON.parse(raw);
  } catch (error) {
    logger.warn(LOG_TEXT.persist.unreadable, error);
    return undefined;
  }
  if (
    !isRecord(parsed) ||
    typeof parsed.version !== "number" ||
    !isRecord(parsed.slices)
  ) {
    logger.warn(LOG_TEXT.persist.badShape, parsed);
    return undefined;
  }
  if (parsed.version > version) {
    logger.warn(LOG_TEXT.persist.newer(parsed.version, version));
    return undefined;
  }
  let slices: PersistedSlices = parsed.slices;
  for (let from = parsed.version; from < version; from++) {
    const migrate = migrations[from];
    if (!migrate) {
      logger.warn(LOG_TEXT.persist.noMigration(from, from + 1));
      return undefined;
    }
    try {
      const next: unknown = migrate(slices);
      if (!isRecord(next)) throw new TypeError("migration returned no object");
      slices = next;
    } catch (error) {
      logger.warn(LOG_TEXT.persist.migrationFailed(from), error);
      return undefined;
    }
  }
  if (parsed.version < version)
    logger.info(LOG_TEXT.persist.migrated(parsed.version, version));
  return slices;
}

export function savePersisted(
  key: string,
  version: number,
  slices: PersistedSlices,
) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ version, slices }));
  } catch (error) {
    // Storage full or blocked: the app simply starts fresh next time.
    logger.warn(LOG_TEXT.persist.saveFailed, error);
  }
}

/**
 * Saved data laid over the current defaults, at every depth:
 * - a field added since it was saved gets its default;
 * - a value of the wrong kind (e.g. text where a number belongs) falls back to the default;
 * - a saved field the defaults don't define (optional fields) is kept as saved.
 * A default of null / undefined accepts any saved value. Arrays are taken whole.
 */
export function mergeOverDefaults<T>(defaults: T, saved: unknown): T {
  if (saved === undefined) return defaults;
  if (defaults === null || defaults === undefined) return saved as T;
  if (isRecord(defaults)) {
    if (!isRecord(saved)) return defaults;
    const merged: Record<string, unknown> = { ...saved };
    for (const [field, fallback] of Object.entries(defaults))
      merged[field] = mergeOverDefaults(fallback, saved[field]);
    return merged as T;
  }
  if (Array.isArray(defaults))
    return (Array.isArray(saved) ? saved : defaults) as T;
  return (typeof saved === typeof defaults ? saved : defaults) as T;
}
