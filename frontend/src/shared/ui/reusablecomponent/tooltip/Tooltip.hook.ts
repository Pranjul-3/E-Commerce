import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useClickOutside } from "@/shared/lib";
import {
  TOOLTIP_DEFAULT_HIDE_DELAY,
  TOOLTIP_DEFAULT_SHOW_DELAY,
  TOOLTIP_MAX_HEIGHT,
} from "./Tooltip.config";
import type { TooltipCoords, TooltipProps } from "./Tooltip.types";
import { computeTooltipCoords } from "./lib/placement";

/** All hooks run unconditionally (warcs returned early before its hooks). */
export function useTooltip({
  content,
  position = "top",
  showDelay = TOOLTIP_DEFAULT_SHOW_DELAY,
  hideDelay = TOOLTIP_DEFAULT_HIDE_DELAY,
  disabled = false,
  isInfotip = false,
}: TooltipProps) {
  const tooltipId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /** Content is taller than TOOLTIP_MAX_HEIGHT: scrollbar + fade (warcs tooltipScrollable). */
  const [isScrollable, setScrollable] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const [isOpen, setOpen] = useState(false);
  /** Opened by click/tap (infotip): stays open until clicked outside. */
  const [isPinned, setPinned] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);

  const hasContent = !(
    content === null ||
    content === undefined ||
    content === false ||
    content === ""
  );
  const enabled = hasContent && !disabled;

  const clearTimer = () => window.clearTimeout(timer.current);

  const show = useCallback(
    (delay: number) => {
      if (!enabled) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setOpen(true), delay);
    },
    [enabled],
  );

  const hide = useCallback((delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
      setPinned(false);
    }, delay);
  }, []);

  const close = useCallback(() => hide(0), [hide]);

  useEffect(() => clearTimer, []);
  // Disabled (or emptied) while open: it closes, and doesn't pop back up when re-enabled. Adjusted while
  // rendering (React's pattern for state that follows a prop), not in an effect.
  if (!enabled && isOpen) setOpen(false);

  useClickOutside([anchorRef, tipRef], close, isOpen && isPinned);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const reposition = useCallback(() => {
    if (!anchorRef.current || !tipRef.current) return;
    setCoords(
      computeTooltipCoords(
        anchorRef.current.getBoundingClientRect(),
        tipRef.current.getBoundingClientRect(),
        position,
      ),
    );
  }, [position]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }
    reposition();
    setScrollable((contentRef.current?.scrollHeight ?? 0) > TOOLTIP_MAX_HEIGHT);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen, reposition, content]);

  return {
    tooltipId,
    anchorRef,
    tipRef,
    contentRef,
    isScrollable,
    isOpen: isOpen && enabled,
    coords,
    triggerHandlers: {
      onMouseEnter: () => show(showDelay),
      onMouseLeave: () => !isPinned && hide(hideDelay),
      onFocus: () => show(0),
      onBlur: () => !isPinned && hide(0),
    },
    tipHandlers: {
      // Moving the pointer onto the tooltip keeps it open (lets users select text).
      onMouseEnter: clearTimer,
      onMouseLeave: () => !isPinned && hide(hideDelay),
    },
    /** Infotip only: click/tap toggles and pins it, which is how it works on touch screens. */
    toggleFromClick: () => {
      if (!isInfotip || !enabled) return;
      clearTimer();
      const next = !(isOpen && isPinned);
      setPinned(next);
      setOpen(next);
    },
  };
}
