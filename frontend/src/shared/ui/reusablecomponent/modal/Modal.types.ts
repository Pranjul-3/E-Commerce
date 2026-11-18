import type { ReactNode, RefObject } from "react";

export type ModalSize = "sm" | "md" | "lg" | "full";
/** `"danger"` colours the header for destructive flows. */
export type ModalTone = "default" | "danger";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Icon before the title. */
  icon?: ReactNode;
  children: ReactNode;
  /** Buttons row. Put the main action last; it wraps to full width on phones. */
  footer?: ReactNode;
  size?: ModalSize;
  tone?: ModalTone;
  /** Default `true`. */
  closeOnOverlayClick?: boolean;
  /** Default `true`. */
  closeOnEscape?: boolean;
  /** Hide the × (e.g. while a request is running). */
  hideCloseButton?: boolean;
  /** Element focused when the modal opens; defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}
