import { TEXT_FIELD_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import type { FieldFooterProps } from "./FieldFooter.types";
import styles from "./FieldFooter.module.scss";

/** Under a field: character limit on the left, small tool buttons on the right. */
export function FieldFooter({
  count,
  max,
  children,
  className,
}: FieldFooterProps) {
  return (
    <div className={cx(styles.root, className)}>
      {max !== undefined && (
        <span className={cx(styles.count, count >= max && styles.full)}>
          {TEXT_FIELD_TEXT.counter(count, max)}
        </span>
      )}
      {children && <span className={styles.tools}>{children}</span>}
    </div>
  );
}
