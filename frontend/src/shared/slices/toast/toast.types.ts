export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  /** How long it stays on screen (ms). */
  durationMs: number;
}

export interface ToastSliceState {
  items: ToastItem[];
}
