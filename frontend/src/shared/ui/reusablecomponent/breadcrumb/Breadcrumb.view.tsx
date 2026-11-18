import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { BREADCRUMB_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import { useBreadcrumb } from "./Breadcrumb.hook";
import type { BreadcrumbItem, BreadcrumbProps } from "./Breadcrumb.types";
import styles from "./Breadcrumb.module.scss";

export function Breadcrumb(props: BreadcrumbProps) {
  const b = useBreadcrumb(props);
  if (!b.isVisible) return null;

  return (
    <nav
      aria-label={BREADCRUMB_TEXT.navLabel}
      className={cx(styles.root, props.className)}
    >
      <ol className={styles.list}>
        {b.crumbs.map((crumb, index) => (
          <li
            key={
              crumb.kind === "item"
                ? `${crumb.item.label}-${index}`
                : "ellipsis"
            }
            className={styles.item}
          >
            {index > 0 && (
              <ChevronRight
                className={styles.separator}
                size={14}
                aria-hidden
              />
            )}

            {crumb.kind === "ellipsis" ? (
              <button
                type="button"
                className={styles.ellipsis}
                onClick={b.expand}
                title={crumb.hidden.map((h) => h.label).join(" › ")}
                aria-label={BREADCRUMB_TEXT.showMore(crumb.hidden.length)}
              >
                …
              </button>
            ) : crumb.isCurrent || !crumb.item.to ? (
              <span
                className={cx(styles.text, crumb.isCurrent && styles.current)}
                aria-current={crumb.isCurrent ? "page" : undefined}
              >
                <CrumbContent item={crumb.item} />
              </span>
            ) : (
              <Link
                to={crumb.item.to}
                className={cx(styles.text, styles.link)}
                aria-label={crumb.item.iconOnly ? crumb.item.label : undefined}
                title={crumb.item.iconOnly ? crumb.item.label : undefined}
              >
                <CrumbContent item={crumb.item} />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CrumbContent({ item }: { item: BreadcrumbItem }) {
  return (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      {!item.iconOnly && item.label}
    </>
  );
}
