import { useState, type KeyboardEvent } from "react";
import { Info } from "lucide-react";
import { cx } from "@/shared/lib";
import { Tooltip } from "../tooltip";
import type { SegmentedControlProps } from "./SegmentedControl.types";
import styles from "./SegmentedControl.module.scss";

/** Pill-style single choice (radio group semantics, arrow keys move the selection). */
export function SegmentedControl<TValue extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  fullWidth = false,
  className,
}: SegmentedControlProps<TValue>) {
  // Option whose ⓘ is hovered: its own tooltip is muted so only the ⓘ text shows.
  const [infoHover, setInfoHover] = useState<TValue | null>(null);
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    // Arrow keys skip disabled options.
    const enabled = options.filter((o) => !o.disabled || o.value === value);
    const index = enabled.findIndex((o) => o.value === value);
    const next = enabled[(index + step + enabled.length) % enabled.length];
    onChange(next.value);
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)
      ?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        styles.root,
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      onKeyDown={move}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const button = (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-value={option.value}
            aria-disabled={option.disabled || undefined}
            className={cx(
              styles.option,
              selected && styles.selected,
              option.disabled && styles.disabled,
            )}
            onClick={() => !option.disabled && onChange(option.value)}
          >
            {option.icon}
            {option.label}
            {option.info && (
              <Tooltip content={option.info}>
                <span
                  className={styles.info}
                  onMouseEnter={() => setInfoHover(option.value)}
                  onMouseLeave={() => setInfoHover(null)}
                >
                  <Info size={13} strokeWidth={2.5} aria-hidden />
                </span>
              </Tooltip>
            )}
          </button>
        );
        const tip = option.disabled ? option.disabledReason : option.tooltip;
        return tip || option.info ? (
          <Tooltip
            key={option.value}
            content={tip}
            disabled={infoHover === option.value}
          >
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </div>
  );
}
