import type { ReactNode } from "react";

export type CheckboxSize = "sm" | "md";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  /** Smaller text under the label. */
  description?: ReactNode;
  /** "Some selected" state. */
  indeterminate?: boolean;
  size?: CheckboxSize;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  /** Adds an ⓘ infotip next to the label. */
  info?: ReactNode;
  /** Needed when there is no visible `label`. */
  ariaLabel?: string;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
}
