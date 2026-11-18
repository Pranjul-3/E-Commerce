import { useEffect, useState } from "react";
import { CONFIRMATION_MODAL_TEXT } from "@/shared/config/constants";
import { useLatest } from "@/shared/lib";
import type { ConfirmationModalProps } from "./ConfirmationModal.types";

const DISCARD = CONFIRMATION_MODAL_TEXT.discard;

/** Resolves variant defaults once, so the view only renders. */
export function useConfirmationModal(props: ConfirmationModalProps) {
  const {
    isOpen,
    onClose,
    onConfirm,
    variant = "default",
    closeOnConfirm = true,
  } = props;
  const isDiscard = variant === "discard";

  const ackSetting = props.acknowledgement ?? isDiscard;
  const acknowledgementText =
    typeof ackSetting === "string"
      ? ackSetting
      : ackSetting
        ? isDiscard
          ? DISCARD.acknowledgement
          : CONFIRMATION_MODAL_TEXT.acknowledgement
        : null;

  const [acknowledged, setAcknowledged] = useState(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onCloseRef = useLatest(onClose);

  // Fresh state every time it opens.
  useEffect(() => {
    if (isOpen) {
      setAcknowledged(false);
      setError(null);
      setPending(false);
    }
  }, [isOpen]);

  const canConfirm =
    !isPending &&
    !props.blockedReason &&
    (!acknowledgementText || acknowledged);

  const confirm = async () => {
    if (!canConfirm) return;
    setError(null);
    setPending(true);
    try {
      await onConfirm();
      if (closeOnConfirm) onCloseRef.current();
    } catch {
      setError(CONFIRMATION_MODAL_TEXT.failed);
    } finally {
      setPending(false);
    }
  };

  const close = () => {
    if (!isPending) onClose();
  };

  return {
    tone: variant === "default" ? ("default" as const) : ("danger" as const),
    title: props.title ?? (isDiscard ? DISCARD.title : ""),
    message: props.message ?? (isDiscard ? DISCARD.message : undefined),
    // A blocked action says why instead of the usual warning.
    warning:
      props.blockedReason ??
      props.warning ??
      (isDiscard ? DISCARD.warning : undefined),
    blockedReason: props.blockedReason,
    confirmLabel:
      props.confirmLabel ??
      (isDiscard ? DISCARD.confirm : CONFIRMATION_MODAL_TEXT.confirm),
    cancelLabel:
      props.cancelLabel ??
      (isDiscard ? DISCARD.cancel : CONFIRMATION_MODAL_TEXT.cancel),
    acknowledgementText,
    acknowledged,
    setAcknowledged,
    isPending,
    error,
    canConfirm,
    confirm,
    close,
  };
}
