import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastProps } from "./Toast.types";

/** Auto-dismiss after the toast's duration; hovering pauses the countdown and resumes with the time left. */
export function useToastTimer({ toast, onDismiss }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.durationMs);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const id = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(id);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - startedAt.current),
      );
    };
  }, [paused, toast.id, onDismiss]);

  return {
    paused,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
  };
}
