import type { ToastItem } from "@/shared/slices";

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}
