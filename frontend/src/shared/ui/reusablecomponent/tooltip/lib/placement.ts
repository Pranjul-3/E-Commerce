import { TOOLTIP_GAP, TOOLTIP_VIEWPORT_MARGIN } from "../Tooltip.config";
import type { TooltipCoords, TooltipPosition } from "../Tooltip.types";

const OPPOSITE: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const fits = (
  side: TooltipPosition,
  anchor: DOMRect,
  tip: DOMRect,
  vw: number,
  vh: number,
) => {
  const need = TOOLTIP_GAP + TOOLTIP_VIEWPORT_MARGIN;
  switch (side) {
    case "top":
      return anchor.top - tip.height >= need;
    case "bottom":
      return vh - anchor.bottom - tip.height >= need;
    case "left":
      return anchor.left - tip.width >= need;
    case "right":
      return vw - anchor.right - tip.width >= need;
  }
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/** Preferred side if it fits, else the opposite side, then clamped inside the viewport. */
export function computeTooltipCoords(
  anchor: DOMRect,
  tip: DOMRect,
  preferred: TooltipPosition,
): TooltipCoords {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const placement =
    fits(preferred, anchor, tip, vw, vh) ||
    !fits(OPPOSITE[preferred], anchor, tip, vw, vh)
      ? preferred
      : OPPOSITE[preferred];

  let top: number;
  let left: number;
  switch (placement) {
    case "top":
      top = anchor.top - tip.height - TOOLTIP_GAP;
      left = anchor.left + (anchor.width - tip.width) / 2;
      break;
    case "bottom":
      top = anchor.bottom + TOOLTIP_GAP;
      left = anchor.left + (anchor.width - tip.width) / 2;
      break;
    case "left":
      top = anchor.top + (anchor.height - tip.height) / 2;
      left = anchor.left - tip.width - TOOLTIP_GAP;
      break;
    case "right":
      top = anchor.top + (anchor.height - tip.height) / 2;
      left = anchor.right + TOOLTIP_GAP;
      break;
  }

  const m = TOOLTIP_VIEWPORT_MARGIN;
  return {
    placement,
    top: clamp(top, m, vh - tip.height - m),
    left: clamp(left, m, vw - tip.width - m),
  };
}
