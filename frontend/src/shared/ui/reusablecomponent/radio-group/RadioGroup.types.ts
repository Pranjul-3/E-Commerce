import type { ReactNode } from "react";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export type RadioGroupDirection = "vertical" | "horizontal";
export type RadioGroupVariant = "default" | "card";

export interface RadioGroupProps {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  label?: ReactNode;
  /** Adds an ⓘ infotip next to the label. */
  info?: ReactNode;
  /** Default `"vertical"`; horizontal wraps on small screens. */
  direction?: RadioGroupDirection;
  /** `"card"` puts each option in a bordered, full-width box. */
  variant?: RadioGroupVariant;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  helperText?: string;
  /** Form field name; generated when omitted. */
  name?: string;
  className?: string;
}
