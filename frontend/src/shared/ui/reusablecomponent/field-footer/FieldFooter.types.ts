import type { ReactNode } from "react";

export interface FieldFooterProps {
  /** Current length (use your own counting rule, e.g. variables as 10). */
  count: number;
  /** Limit; the "x/y chars used" counter is hidden without it. */
  max?: number;
  /** Small tool buttons on the right (Add variable, Emoji …). */
  children?: ReactNode;
  className?: string;
}
