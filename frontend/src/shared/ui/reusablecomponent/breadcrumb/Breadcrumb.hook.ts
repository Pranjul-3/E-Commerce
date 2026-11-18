import { useMemo, useState } from "react";
import type { BreadcrumbProps, VisibleCrumb } from "./Breadcrumb.types";

export const DEFAULT_MAX_ITEMS = 4;
export const DEFAULT_MIN_ITEMS = 2;

export function useBreadcrumb({
  items,
  maxItems = DEFAULT_MAX_ITEMS,
  minItems = DEFAULT_MIN_ITEMS,
}: BreadcrumbProps) {
  const [isExpanded, setExpanded] = useState(false);

  const crumbs = useMemo<VisibleCrumb[]>(() => {
    const last = items.length - 1;
    const asItems = items.map<VisibleCrumb>((item, index) => ({
      kind: "item",
      item,
      isCurrent: index === last,
    }));

    if (isExpanded || items.length <= maxItems || maxItems < 3) return asItems;

    // Keep the first crumb and the last (maxItems - 2); collapse the middle.
    const tailCount = maxItems - 2;
    return [
      asItems[0],
      { kind: "ellipsis", hidden: items.slice(1, items.length - tailCount) },
      ...asItems.slice(items.length - tailCount),
    ];
  }, [items, maxItems, isExpanded]);

  return {
    isVisible: items.length >= minItems,
    crumbs,
    expand: () => setExpanded(true),
  };
}
