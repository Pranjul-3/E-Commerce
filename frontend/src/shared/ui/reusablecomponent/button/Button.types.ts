import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonShape = "default" | "pill";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Icon before the label. Without `children` the button becomes a square icon button. */
  icon?: ReactNode;
  /** Icon after the label. */
  iconRight?: ReactNode;
  /** Shows a spinner and blocks clicks. */
  loading?: boolean;
  /** Tooltip explaining why the button is disabled. */
  disabledReason?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}
