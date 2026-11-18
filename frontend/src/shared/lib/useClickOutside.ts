import { useEffect, type RefObject } from "react";

/** Calls `handler` on a mousedown outside every ref'd element, while `enabled`. */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      handler();
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
    // Refs are stable; re-subscribe only when the handler or enabled flag changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, enabled]);
}
