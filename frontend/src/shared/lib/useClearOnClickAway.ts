import { useEffect, type RefObject } from "react";
import { useLatest } from "./useLatest";

/** Mark the elements that set a focus with this attribute; a click on any other spot clears it. */
export const FOCUS_KEEP_ATTR = "data-keeps-focus";

/**
 * While `active`, a click anywhere except on a `data-keeps-focus` element inside `root` calls `onClear`
 * (outside the chart, empty space in it, or another chart).
 */
export function useClearOnClickAway(
  root: RefObject<HTMLElement | null>,
  active: boolean,
  onClear: () => void,
) {
  const clear = useLatest(onClear);
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const keep = target?.closest(`[${FOCUS_KEEP_ATTR}]`);
      if (keep && root.current?.contains(keep)) return;
      clear.current();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active, root, clear]);
}
