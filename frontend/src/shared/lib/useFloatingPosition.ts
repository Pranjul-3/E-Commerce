import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

export type FloatingPlacement = "bottom" | "top";

export interface FloatingPosition {
  placement: FloatingPlacement;
  /** Set when placed below the anchor. */
  top?: number;
  /** Set when placed above the anchor (distance from the viewport bottom). */
  bottom?: number;
  left: number;
  width: number;
  /** Never taller than the space left in the viewport. */
  maxHeight: number;
}

export interface FloatingOptions {
  open: boolean;
  /** Preferred max height; shrinks when the viewport has less room. */
  maxHeight: number;
  /** Gap between anchor and floating element. */
  offset?: number;
  /** Minimum gap kept from every viewport edge. */
  viewportMargin?: number;
  /** Floating element is at least this wide (defaults to the anchor width). */
  minWidth?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const samePosition = (a: FloatingPosition | null, b: FloatingPosition) =>
  !!a &&
  a.placement === b.placement &&
  a.top === b.top &&
  a.bottom === b.bottom &&
  a.left === b.left &&
  a.width === b.width &&
  a.maxHeight === b.maxHeight;

/**
 * Positions a `position: fixed` element (e.g. a portaled menu) next to an anchor so it
 * always stays inside the viewport:
 * - opens below, or above when there is not enough room below and more room above
 * - shrinks its max height to the space available
 * - is clamped horizontally so it never overflows the left/right edge
 * Recalculates on scroll, resize and size changes of the anchor or the floating element.
 *
 * The floating element should not constrain its own content height except through
 * `maxHeight` (its `scrollHeight` is used as the natural content height).
 */
export function useFloatingPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  {
    open,
    maxHeight,
    offset = 4,
    viewportMargin = 8,
    minWidth = 0,
  }: FloatingOptions,
): FloatingPosition | null {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight;
    const contentHeight = Math.min(
      floatingRef.current?.scrollHeight ?? maxHeight,
      maxHeight,
    );

    const spaceBelow = viewportHeight - rect.bottom - offset - viewportMargin;
    const spaceAbove = rect.top - offset - viewportMargin;
    const placement: FloatingPlacement =
      spaceBelow >= contentHeight || spaceBelow >= spaceAbove
        ? "bottom"
        : "top";
    const available = Math.max(
      placement === "bottom" ? spaceBelow : spaceAbove,
      0,
    );

    const width = Math.min(
      Math.max(rect.width, minWidth),
      viewportWidth - viewportMargin * 2,
    );
    const left = clamp(
      rect.left,
      viewportMargin,
      viewportWidth - width - viewportMargin,
    );

    const next: FloatingPosition = {
      placement,
      left,
      width,
      maxHeight: Math.min(maxHeight, available),
      ...(placement === "bottom"
        ? { top: rect.bottom + offset }
        : { bottom: viewportHeight - rect.top + offset }),
    };
    setPosition((prev) => (samePosition(prev, next) ? prev : next));
  }, [anchorRef, floatingRef, maxHeight, offset, viewportMargin, minWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    update();

    const observer = new ResizeObserver(update);
    if (anchorRef.current) observer.observe(anchorRef.current);
    if (floatingRef.current) observer.observe(floatingRef.current);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, update, anchorRef, floatingRef]);

  return open ? position : null;
}
