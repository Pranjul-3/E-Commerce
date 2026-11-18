import { LOG_TEXT } from "@/shared/config/constants";
import { logger } from "@/shared/lib/logger";

/** A value's kind as JSON has it. */
export type ValueKind =
  "string" | "number" | "boolean" | "list" | "object" | "null";

/**
 * What an endpoint's response should look like — only the keys our code reads. Checked in dev, and only
 * reported (a missing key, a different type, another structure); nothing is changed.
 * A key ending in "?" may be missing.
 */
export interface ResponseContract {
  shape: "list" | "object";
  /** Allowed kinds per key (of the object, or of each list item). */
  keys?: Record<string, ValueKind | readonly ValueKind[]>;
  /** Keys whose value is checked against its own contract (e.g. the `data` list of a paged answer). */
  nested?: Record<string, ResponseContract>;
}

const kindOf = (value: unknown): ValueKind =>
  value === null
    ? "null"
    : Array.isArray(value)
      ? "list"
      : typeof value === "object"
        ? "object"
        : (typeof value as ValueKind);

const describe = (value: unknown) => {
  const kind = kindOf(value);
  if (kind === "object")
    return `an object with keys: ${Object.keys(value as object).join(", ") || "none"}`;
  if (kind === "list") return `a list (${(value as unknown[]).length} items)`;
  return `${kind} ${JSON.stringify(value)?.slice(0, 40)}`;
};

/** How many list items are checked (enough to catch a changed shape, cheap on long lists). */
const ITEMS_CHECKED = 3;

function checkObject(
  endpoint: string,
  value: unknown,
  contract: ResponseContract,
) {
  if (kindOf(value) !== "object") {
    logger.warn(LOG_TEXT.api.structure(endpoint, "an object", describe(value)));
    return;
  }
  const record = value as Record<string, unknown>;
  for (const [rawKey, allowed] of Object.entries(contract.keys ?? {})) {
    const optional = rawKey.endsWith("?");
    const key = optional ? rawKey.slice(0, -1) : rawKey;
    const kinds = typeof allowed === "string" ? [allowed] : allowed;
    if (!(key in record)) {
      if (!optional)
        logger.warn(
          LOG_TEXT.api.missingKey(
            endpoint,
            key,
            Object.keys(record).join(", "),
          ),
        );
      continue;
    }
    const got = kindOf(record[key]);
    if (!kinds.includes(got))
      logger.warn(
        LOG_TEXT.api.wrongType(
          endpoint,
          key,
          kinds.join(" or "),
          describe(record[key]),
        ),
      );
  }
  for (const [key, inner] of Object.entries(contract.nested ?? {}))
    if (key in record && record[key] !== null)
      checkContract(`${endpoint}.${key}`, record[key], inner);
}

/** Reports (dev console) where a response differs from its contract. Never throws, never changes it. */
export function checkContract(
  endpoint: string,
  raw: unknown,
  contract: ResponseContract,
) {
  try {
    if (contract.shape === "list") {
      if (!Array.isArray(raw)) {
        logger.warn(LOG_TEXT.api.structure(endpoint, "a list", describe(raw)));
        return;
      }
      raw
        .slice(0, ITEMS_CHECKED)
        .forEach((item) => checkObject(endpoint, item, contract));
      return;
    }
    checkObject(endpoint, raw, contract);
  } catch {
    // A check must never break a request.
  }
}
