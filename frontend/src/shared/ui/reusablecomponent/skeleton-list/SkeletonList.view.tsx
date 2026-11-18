import { SKELETON_LIST_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import { SKELETON_ROWS, SKELETON_ROW_HEIGHT } from "./SkeletonList.config";
import type { SkeletonListProps } from "./SkeletonList.types";
import styles from "./SkeletonList.module.scss";

/** Shimmering placeholder lines while a list loads. */
export function SkeletonList({
  rows = SKELETON_ROWS,
  rowHeight = SKELETON_ROW_HEIGHT,
  ariaLabel = SKELETON_LIST_TEXT.loading,
  className,
}: SkeletonListProps) {
  return (
    <ul className={cx(styles.list, className)} aria-busy aria-label={ariaLabel}>
      {Array.from({ length: rows }, (_, k) => (
        <li key={k} className={styles.skeleton} style={{ height: rowHeight }} />
      ))}
    </ul>
  );
}
