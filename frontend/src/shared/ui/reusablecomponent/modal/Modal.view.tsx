import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { MODAL_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import { Button } from "../button";
import { useModal } from "./Modal.hook";
import type { ModalProps } from "./Modal.types";
import styles from "./Modal.module.scss";

/** Base dialog. Build specific flows on top of it (see ConfirmationModal). */
export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    footer,
    size = "md",
    tone = "default",
    hideCloseButton,
    className,
  } = props;
  const m = useModal(props);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} {...m.overlayHandlers}>
      <div
        ref={m.dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={m.titleId}
        aria-describedby={subtitle ? m.subtitleId : undefined}
        tabIndex={-1}
        className={cx(styles.dialog, styles[size], className)}
        onKeyDown={m.handleKeyDown}
      >
        <header className={cx(styles.header, styles[tone])}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <div className={styles.headings}>
            <h2 id={m.titleId} className={styles.title}>
              {title}
            </h2>
            {subtitle && (
              <p id={m.subtitleId} className={styles.subtitle}>
                {subtitle}
              </p>
            )}
          </div>
          {!hideCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={18} />}
              aria-label={MODAL_TEXT.close}
              onClick={onClose}
            />
          )}
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
