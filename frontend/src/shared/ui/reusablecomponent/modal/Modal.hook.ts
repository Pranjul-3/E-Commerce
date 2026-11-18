import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useLatest } from "@/shared/lib";
import { MODAL_FOCUSABLE_SELECTOR } from "./Modal.config";
import type { ModalProps } from "./Modal.types";

/** Shared across modals so nested modals don't unlock scrolling too early. */
let openModalCount = 0;

export function useModal({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  initialFocusRef,
}: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useLatest(onClose);

  // Scroll lock + focus handling while open; focus goes back to the opener on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    openModalCount++;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const target =
      initialFocusRef?.current ??
      dialog?.querySelector<HTMLElement>(MODAL_FOCUSABLE_SELECTOR) ??
      dialog;
    target?.focus();

    return () => {
      openModalCount--;
      if (openModalCount === 0) document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isOpen, initialFocusRef]);

  /** Escape closes; Tab is kept inside the dialog. */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && closeOnEscape) {
      event.stopPropagation();
      onCloseRef.current();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = [
      ...dialogRef.current.querySelectorAll<HTMLElement>(
        MODAL_FOCUSABLE_SELECTOR,
      ),
    ];
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  /** Only a click that starts and ends on the overlay closes (not a text selection that ends there). */
  const pressStartedOnOverlay = useRef(false);
  const overlayHandlers = {
    onMouseDown: (e: MouseEvent<HTMLDivElement>) => {
      pressStartedOnOverlay.current = e.target === e.currentTarget;
    },
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      if (
        closeOnOverlayClick &&
        pressStartedOnOverlay.current &&
        e.target === e.currentTarget
      )
        onCloseRef.current();
    },
  };

  return {
    titleId: `${id}-title`,
    subtitleId: `${id}-subtitle`,
    dialogRef,
    handleKeyDown,
    overlayHandlers,
  };
}
