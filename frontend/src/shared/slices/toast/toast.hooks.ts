import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOAST_DURATION_MS } from "@/shared/config/toast.config";
import { toastDismissed, toastShown, toastSlice } from "./toastSlice";
import type { ToastSliceState, ToastType } from "./toast.types";

/** The part of the root state this slice owns (keeps shared/ free of app-layer imports). */
type StateWithToast = { [toastSlice.reducerPath]: ToastSliceState };

/** Show a toast from anywhere: `toast.success("Saved")`, `toast.error(msg, 5000)`. */
export function useToast() {
  const dispatch = useDispatch();
  return useMemo(() => {
    const show = (type: ToastType) => (message: string, durationMs: number = TOAST_DURATION_MS) =>
      dispatch(toastShown({ type, message, durationMs }));
    return { success: show("success"), error: show("error"), warning: show("warning"), info: show("info") };
  }, [dispatch]);
}

/** Toasts on screen + dismiss (used by the viewport). */
export function useToastQueue() {
  const items = useSelector((state: StateWithToast) => toastSlice.selectors.selectToasts(state));
  const dispatch = useDispatch();
  return { items, dismiss: (id: string) => dispatch(toastDismissed(id)) };
}
