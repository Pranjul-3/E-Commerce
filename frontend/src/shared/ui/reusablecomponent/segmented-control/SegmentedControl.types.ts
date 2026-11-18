import type { ReactNode } from "react";

export interface SegmentedOption<TValue extends string> {
  value: TValue;
  label: ReactNode;
  icon?: ReactNode;
  /** Shown on hover / focus of the option. */
  tooltip?: ReactNode;
  /** ⓘ inside the option; hovering it shows this instead of `tooltip`. */
  info?: ReactNode;
  /** Can't be chosen; the tooltip then shows `disabledReason` instead of `tooltip`. */
  disabled?: boolean;
  disabledReason?: ReactNode;
}

export interface SegmentedControlProps<TValue extends string> {
  options: SegmentedOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  /** Accessible name of the group. */
  ariaLabel: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}
