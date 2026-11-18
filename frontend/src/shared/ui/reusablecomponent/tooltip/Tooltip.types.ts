import type { ReactNode } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipBaseProps {
  /** Plain text or JSX. Never rendered as HTML, so it is safe for any string. */
  content: ReactNode;
  /** Preferred side; flips to the opposite side when there is no room. Default `"top"`. */
  position?: TooltipPosition;
  /** Max width in px. Default 300. */
  maxWidth?: number;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  className?: string;
}

/** Wraps any element and shows `content` on hover / keyboard focus. */
export interface TooltipTriggerProps extends TooltipBaseProps {
  isInfotip?: false;
  children: ReactNode;
}

/** Renders an ⓘ icon that shows `content` on hover, focus or tap (mobile). */
export interface InfotipProps extends TooltipBaseProps {
  isInfotip: true;
  children?: never;
  iconSize?: number;
  /** Accessible name of the icon button. */
  ariaLabel?: string;
}

export type TooltipProps = TooltipTriggerProps | InfotipProps;

export interface TooltipCoords {
  top: number;
  left: number;
  placement: TooltipPosition;
}
