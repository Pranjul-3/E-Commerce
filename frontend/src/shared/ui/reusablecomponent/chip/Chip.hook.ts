import type { MouseEvent } from "react";
import { cx } from "@/shared/lib";
import type { ChipProps } from "./Chip.types";
import styles from "./Chip.module.scss";

export function useChip({
  tone = "neutral",
  size = "md",
  shape = "rounded",
  onRemove,
  onRestore,
  disabled = false,
  className,
}: ChipProps) {
  const action = onRemove
    ? { kind: "remove" as const, run: onRemove }
    : onRestore
      ? { kind: "restore" as const, run: onRestore }
      : null;

  const handleAction = (event: MouseEvent<HTMLButtonElement>) => {
    // Chips often sit inside clickable rows/triggers.
    event.stopPropagation();
    if (!disabled) action?.run();
  };

  return {
    action,
    handleAction,
    className: cx(
      styles.chip,
      styles[tone],
      styles[size],
      shape === "rectangle" && styles.rectangle,
      disabled && styles.disabled,
      className,
    ),
  };
}
