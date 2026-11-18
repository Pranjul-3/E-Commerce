import { AlertTriangle, CircleHelp } from "lucide-react";
import {
  BUTTON_TEXT,
  CONFIRMATION_MODAL_TEXT,
} from "@/shared/config/constants";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { Chip } from "../chip";
import { Modal } from "../modal";
import { useConfirmationModal } from "./ConfirmationModal.hook";
import type {
  ConfirmationDetail,
  ConfirmationModalProps,
} from "./ConfirmationModal.types";
import styles from "./ConfirmationModal.module.scss";

/**
 * The one confirmation dialog for the app.
 * `<ConfirmationModal variant="discard" isOpen onClose onConfirm />` is a complete discard prompt.
 */
export function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    isOpen,
    details,
    detailsTitle = CONFIRMATION_MODAL_TEXT.detailsTitle,
    icon,
    size = "sm",
  } = props;
  const c = useConfirmationModal(props);
  const defaultIcon =
    c.tone === "danger" ? (
      <AlertTriangle size={20} />
    ) : (
      <CircleHelp size={20} />
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={c.close}
      title={c.title}
      icon={icon ?? defaultIcon}
      tone={c.tone}
      size={size}
      hideCloseButton={c.isPending}
      closeOnEscape={!c.isPending}
      closeOnOverlayClick={!c.isPending}
      footer={
        <>
          <Button
            variant="outline"
            onClick={c.close}
            disabled={c.isPending}
            disabledReason={BUTTON_TEXT.busy}
          >
            {c.cancelLabel}
          </Button>
          <Button
            variant={c.tone === "danger" ? "danger" : "primary"}
            onClick={c.confirm}
            loading={c.isPending}
            disabled={!c.canConfirm}
            disabledReason={
              c.isPending
                ? BUTTON_TEXT.busy
                : (c.blockedReason ??
                  (c.acknowledgementText && !c.acknowledged
                    ? c.acknowledgementText
                    : undefined))
            }
          >
            {c.confirmLabel}
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        {c.message && <p className={styles.message}>{c.message}</p>}

        {c.warning && (
          <p className={styles.warning}>
            <AlertTriangle size={16} aria-hidden />
            <span>{c.warning}</span>
          </p>
        )}

        {details && details.length > 0 && (
          <section className={styles.details}>
            <h3 className={styles.detailsTitle}>{detailsTitle}</h3>
            <dl className={styles.detailList}>
              {details.map((detail, index) => (
                <div key={index} className={styles.detailRow}>
                  <dt>{detail.label}</dt>
                  <dd>
                    <DetailValue value={detail.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {c.acknowledgementText && (
          <div className={c.tone === "danger" ? styles.ackDanger : styles.ack}>
            <Checkbox
              label={c.acknowledgementText}
              checked={c.acknowledged}
              onChange={c.setAcknowledged}
              disabled={c.isPending}
            />
          </div>
        )}

        {c.error && (
          <p className={styles.error} role="alert">
            {c.error}
          </p>
        )}
      </div>
    </Modal>
  );
}

function DetailValue({ value }: { value: ConfirmationDetail["value"] }) {
  if (!Array.isArray(value)) return <>{value}</>;
  if (value.length === 0)
    return <span className={styles.muted}>{CONFIRMATION_MODAL_TEXT.none}</span>;
  return (
    <span className={styles.chips}>
      {value.map((item) => (
        <Chip
          key={String(item)}
          label={String(item)}
          tone="neutral"
          size="sm"
        />
      ))}
    </span>
  );
}
