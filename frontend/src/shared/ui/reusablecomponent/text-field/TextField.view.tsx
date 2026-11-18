import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { TEXT_FIELD_TEXT } from "@/shared/config/constants";
import { cx } from "@/shared/lib";
import { Button } from "../button";
import { Tooltip } from "../tooltip";
import { TEXT_FIELD_DEFAULT_ROWS } from "./TextField.config";
import { useTextField } from "./TextField.hook";
import type { TextFieldProps, TextFieldStatus } from "./TextField.types";
import styles from "./TextField.module.scss";

const STATUS_ICON: Record<
  Exclude<TextFieldStatus, "default">,
  typeof CheckCircle2
> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

/**
 * One text component:
 * - `<TextField value onChange />`: single-line input
 * - `<TextField isTextbox value onChange />`: multi-line text box
 */
export function TextField(props: TextFieldProps) {
  const {
    value,
    label,
    subLabel,
    info,
    placeholder,
    required,
    disabled,
    readOnly,
    name,
    autoComplete,
    maxLength,
    showCount,
    leftIcon,
    clearable,
    action,
    className,
  } = props;
  const f = useTextField(props);
  const StatusIcon = f.status === "default" ? null : STATUS_ICON[f.status];

  const shared = {
    id: f.id,
    name,
    value,
    placeholder,
    required,
    disabled,
    readOnly,
    autoComplete,
    onChange: f.handleChange,
    onBlur: f.handleBlur,
    onFocus: f.handleFocus,
    onKeyDown: f.handleKeyDown,
    "aria-invalid": f.status === "error" || undefined,
    "aria-required": required || undefined,
    "aria-describedby": f.message ? f.messageId : undefined,
    className: styles.control,
  };

  const inputType = props.isTextbox
    ? undefined
    : f.isNumber
      ? "text"
      : f.isPassword && f.showPassword
        ? "text"
        : (props.type ?? "text");

  return (
    <div className={cx(styles.root, className)}>
      {(label || subLabel) && (
        <div className={styles.labelRow}>
          {label && (
            <label htmlFor={f.id} className={styles.label}>
              {label}
              {required && (
                <span className={styles.required} aria-hidden>
                  {" "}
                  *
                </span>
              )}
            </label>
          )}
          {info && <Tooltip isInfotip content={info} position="right" />}
          {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
        </div>
      )}

      <div
        className={cx(
          styles.field,
          props.isTextbox && styles.textbox,
          props.bottomBar !== undefined && styles.attached,
          styles[f.status],
          disabled && styles.disabled,
          readOnly && styles.readOnly,
        )}
      >
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

        {props.isTextbox ? (
          <textarea
            {...shared}
            ref={f.textareaRef}
            rows={props.rows ?? TEXT_FIELD_DEFAULT_ROWS}
          />
        ) : (
          <input
            {...shared}
            type={inputType}
            inputMode={f.isNumber ? "numeric" : undefined}
          />
        )}

        <span className={styles.adornments}>
          {StatusIcon && (
            <StatusIcon className={styles.statusIcon} size={16} aria-hidden />
          )}

          {clearable && value && f.isInteractive && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={f.clear}
              aria-label={TEXT_FIELD_TEXT.clear}
            >
              <X size={14} />
            </button>
          )}

          {f.isPassword && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={f.togglePassword}
              aria-label={
                f.showPassword
                  ? TEXT_FIELD_TEXT.hidePassword
                  : TEXT_FIELD_TEXT.showPassword
              }
              aria-pressed={f.showPassword}
            >
              {f.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {action && (
            <Button
              size="sm"
              variant={action.variant ?? "ghost"}
              icon={
                f.actionState === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  action.icon
                )
              }
              loading={f.actionState === "loading"}
              disabled={action.disabled || disabled}
              disabledReason={action.disabledReason}
              aria-label={action.ariaLabel}
              onClick={f.runAction}
              className={cx(
                styles.action,
                f.actionState === "success" && styles.actionSuccess,
              )}
            >
              {action.label}
            </Button>
          )}
        </span>
        {/* Inside the field's border: one box, one focus ring. */}
        {props.bottomBar !== undefined && (
          <div className={styles.bottomBar}>{props.bottomBar}</div>
        )}
      </div>

      {(f.message || (showCount && maxLength !== undefined)) && (
        <div className={styles.footer}>
          {/* Limit first, on the left, so it is always visible. */}
          {showCount && maxLength !== undefined && (
            <span
              className={cx(
                styles.counter,
                f.count >= maxLength && styles.counterFull,
              )}
            >
              {TEXT_FIELD_TEXT.counter(f.count, maxLength)}
            </span>
          )}
          {f.message && (
            <p
              id={f.messageId}
              className={cx(styles.message, styles[`${f.status}Message`])}
              role={f.status === "error" ? "alert" : undefined}
            >
              {f.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
