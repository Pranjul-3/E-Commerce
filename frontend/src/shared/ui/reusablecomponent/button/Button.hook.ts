import { logger } from "@/shared/lib/logger";
import type { MouseEvent } from "react";
import { BUTTON_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.scss";

/** Splits styling props from DOM props and handles the disabled/loading guard. */
export function useButton(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    shape = "default",
    fullWidth = false,
    loading = false,
    disabled = false,
    disabledReason,
    icon,
    iconRight,
    children,
    className,
    onClick,
    type = "button",
    ...domProps
  } = props;

  const isDisabled = disabled || loading;
  const hasLabel =
    children !== undefined && children !== null && children !== false;
  const isIconOnly = !!icon && !hasLabel;

  if (import.meta.env.DEV && isIconOnly && !domProps["aria-label"]) {
    logger.warn(BUTTON_TEXT.iconOnlyWarning);
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return {
    buttonProps: {
      ...domProps,
      type,
      disabled: isDisabled,
      "aria-busy": loading || undefined,
      onClick: handleClick,
      className: cx(
        styles.button,
        styles[variant],
        styles[size],
        shape === "pill" && styles.pill,
        isIconOnly && styles.iconOnly,
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      ),
    },
    loading,
    icon,
    iconRight,
    children,
    hasLabel,
    /** Tooltip shown on a wrapper, because disabled buttons get no hover events. */
    disabledTooltip: isDisabled ? disabledReason : undefined,
  };
}
