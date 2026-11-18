import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useCallback, type ReactNode } from "react";
import { TOAST_TEXT } from "@/shared/config/constants";
import { TOAST_MAX_VISIBLE } from "@/shared/config/toast.config";
import { useToastQueue, type ToastType } from "@/shared/slices";
import { useToastTimer } from "./Toast.hook";
import type { ToastProps } from "./Toast.types";
import styles from "./Toast.module.scss";

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 size={18} aria-hidden />,
  error: <AlertCircle size={18} aria-hidden />,
  warning: <AlertTriangle size={18} aria-hidden />,
  info: <Info size={18} aria-hidden />,
};

function Toast(props: ToastProps) {
  const { toast, onDismiss } = props;
  const timer = useToastTimer(props);
  return (
    <div
      className={styles.toast}
      data-type={toast.type}
      data-paused={timer.paused || undefined}
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={timer.pause}
      onMouseLeave={timer.resume}
      onFocus={timer.pause}
      onBlur={timer.resume}
    >
      <span className={styles.icon}>{ICONS[toast.type]}</span>
      <p className={styles.message}>{toast.message}</p>
      <button
        type="button"
        className={styles.close}
        aria-label={TOAST_TEXT.dismiss}
        onClick={() => onDismiss(toast.id)}
      >
        <X size={14} />
      </button>
      <span
        className={styles.progress}
        style={{ animationDuration: `${toast.durationMs}ms` }}
        aria-hidden
      />
    </div>
  );
}

/** Renders the toast stack. Mount once near the app root; show toasts with `useToast()`. */
export function ToastViewport() {
  const { items, dismiss } = useToastQueue();
  const onDismiss = useCallback((id: string) => dismiss(id), [dismiss]);
  return (
    <div className={styles.viewport} aria-live="polite">
      {items.slice(-TOAST_MAX_VISIBLE).map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
