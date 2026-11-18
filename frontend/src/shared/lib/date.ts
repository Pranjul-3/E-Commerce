import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// All dates in one place (dayjs). The UI works in the browser's local time as "YYYY-MM-DD HH:mm:ss";
// requests carry UTC ISO strings. No time-zone picking anywhere: the browser's zone is the zone.

/** The value format of date-time fields (browser local time). */
export const LOCAL_FORMAT = "YYYY-MM-DD HH:mm:ss";

/** Date (or any dayjs input, e.g. a UTC ISO string) → local field value; "" when invalid. */
export const toLocalValue = (input: Date | string | number): string => {
  const d = dayjs(input);
  return d.isValid() ? d.format(LOCAL_FORMAT) : "";
};

/** Local field value → Date; null when empty or not a real date (e.g. 2026-02-30). */
export const fromLocalValue = (value: string): Date | null => {
  const d = dayjs(value.trim(), LOCAL_FORMAT, true);
  return d.isValid() ? d.toDate() : null;
};

/** Request side: local field value → UTC ISO ("2026-10-08T03:30:00.000Z"); "" when empty / invalid. */
export const localToUtc = (value: string): string =>
  fromLocalValue(value)?.toISOString() ?? "";

/** Response side (edit / clone): UTC ISO → local field value; "" when empty / invalid. */
export const utcToLocal = (iso: string | null | undefined): string =>
  iso ? toLocalValue(iso) : "";

/** For reading (lists, previews): "8 Oct 2026, 09:00" in browser-local time; "" when invalid. */
export const formatDateTime = (
  input: Date | string | null | undefined,
): string => {
  if (!input) return "";
  const d = dayjs(input);
  return d.isValid() ? d.format("D MMM YYYY, HH:mm") : "";
};
