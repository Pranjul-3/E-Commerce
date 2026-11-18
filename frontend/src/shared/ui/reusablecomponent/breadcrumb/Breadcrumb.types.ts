import type { ReactNode } from "react";

export interface BreadcrumbItem {
  /** Visible text, or the accessible name when `iconOnly`. */
  label: string;
  icon?: ReactNode;
  /** Show only the icon (label is still read by screen readers). */
  iconOnly?: boolean;
  /** Link target. The last item is always rendered as plain text (current page). */
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Max items before the middle collapses into "…". Default 4.
   * The first and the last `maxItems - 2` items stay visible.
   */
  maxItems?: number;
  /** Hide when there are fewer items than this. Default 2 (a single crumb adds nothing). */
  minItems?: number;
  className?: string;
}

/** An item, or the "…" placeholder for collapsed items. */
export type VisibleCrumb =
  | { kind: "item"; item: BreadcrumbItem; isCurrent: boolean }
  | { kind: "ellipsis"; hidden: BreadcrumbItem[] };
