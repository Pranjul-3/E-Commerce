import { createPortal } from "react-dom";
import { TOOLTIP_TEXT } from "@/shared/config/constants";
import { Info } from "lucide-react";
import { cx } from "@/shared/lib";
import {
  INFOTIP_DEFAULT_ICON_SIZE,
  TOOLTIP_DEFAULT_MAX_WIDTH,
  TOOLTIP_MAX_HEIGHT,
} from "./Tooltip.config";
import { useTooltip } from "./Tooltip.hook";
import type { TooltipProps } from "./Tooltip.types";
import styles from "./Tooltip.module.scss";

/**
 * One component for both:
 * - `<Tooltip content="…"><Button …/></Tooltip>`: tooltip on any element
 * - `<Tooltip isInfotip content="…" />`: ⓘ icon with an info popover
 */
export function Tooltip(props: TooltipProps) {
  const { content, maxWidth = TOOLTIP_DEFAULT_MAX_WIDTH, className } = props;
  const t = useTooltip(props);
  const describedBy = t.isOpen ? t.tooltipId : undefined;

  return (
    <>
      {props.isInfotip ? (
        <span
          ref={t.anchorRef}
          className={styles.anchor}
          {...t.triggerHandlers}
        >
          <button
            type="button"
            className={styles.infoButton}
            aria-label={props.ariaLabel ?? TOOLTIP_TEXT.infotipAria}
            aria-describedby={describedBy}
            aria-expanded={t.isOpen}
            onClick={t.toggleFromClick}
          >
            <Info
              size={props.iconSize ?? INFOTIP_DEFAULT_ICON_SIZE}
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        </span>
      ) : (
        <span
          ref={t.anchorRef}
          className={styles.anchor}
          aria-describedby={describedBy}
          {...t.triggerHandlers}
        >
          {props.children}
        </span>
      )}

      {t.isOpen &&
        createPortal(
          <div
            ref={t.tipRef}
            id={t.tooltipId}
            role="tooltip"
            className={cx(
              styles.tooltip,
              t.coords && styles[t.coords.placement],
              className,
            )}
            style={{
              maxWidth,
              top: t.coords?.top ?? 0,
              left: t.coords?.left ?? 0,
              visibility: t.coords ? "visible" : "hidden",
            }}
            {...t.tipHandlers}
          >
            {/* Inner box scrolls when the content is taller than TOOLTIP_MAX_HEIGHT. */}
            <div
              ref={t.contentRef}
              className={styles.content}
              data-scrollable={t.isScrollable || undefined}
              style={{ maxHeight: TOOLTIP_MAX_HEIGHT }}
            >
              {content}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
