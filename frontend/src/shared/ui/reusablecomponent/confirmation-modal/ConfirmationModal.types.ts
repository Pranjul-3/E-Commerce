import type { ReactNode } from "react";
import type { ModalSize } from "../modal";

/**
 * - `"default"`: neutral confirmation (submit, approve…)
 * - `"danger"`: destructive action (delete, disable…)
 * - `"discard"`: leave without saving; adds a warning line and an "I understand" checkbox by default
 */
export type ConfirmationVariant = "default" | "danger" | "discard";

export interface ConfirmationDetail {
  label: ReactNode;
  /** A string array is shown as chips. */
  value: ReactNode | string[];
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** May be async: buttons show a loading state; throwing keeps the modal open with an error. */
  onConfirm: () => void | Promise<void>;
  variant?: ConfirmationVariant;
  /** Required except for `"discard"`, which has a default. */
  title?: ReactNode;
  message?: ReactNode;
  /** Highlighted line, e.g. "This action cannot be undone." */
  warning?: ReactNode;
  details?: ConfirmationDetail[];
  detailsTitle?: ReactNode;
  /**
   * Checkbox the user must tick before confirming.
   * `true` uses the default text; a string sets the text; `false` removes it (also for "discard").
   */
  acknowledgement?: boolean | string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
  /**
   * The action can't be confirmed any more (e.g. the record changed meanwhile): shown as the warning,
   * and Confirm stays disabled with it as the reason.
   */
  blockedReason?: string;
  /** Close automatically after `onConfirm` succeeds. Default `true`. */
  closeOnConfirm?: boolean;
  size?: ModalSize;
}
