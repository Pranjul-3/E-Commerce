import type { ReactNode } from "react";
import type { ChipTone } from "./Chip.config";

export type ChipSize = "sm" | "md" | "lg";
export type ChipShape = "rounded" | "rectangle";

export interface ChipProps {
  label: string;
  /** Colour. Default "neutral". Features map their own statuses to a tone (e.g. `waStatusTone`). */
  tone?: ChipTone;
  size?: ChipSize;
  shape?: ChipShape;
  icon?: ReactNode;
  /** Shows an × button. */
  onRemove?: () => void;
  /** Shows a restore (↑) button. Ignored when `onRemove` is set. */
  onRestore?: () => void;
  disabled?: boolean;
  /** Native browser tooltip; defaults to the label (useful when it is truncated). Ignored with `tooltip`. */
  title?: string;
  /** Styled hover tooltip (the shared Tooltip) instead of the native one. */
  tooltip?: ReactNode;
  className?: string;
}
