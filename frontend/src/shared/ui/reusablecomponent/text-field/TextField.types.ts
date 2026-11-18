import type { ReactNode } from "react";
import type { ButtonVariant } from "../button";

export type TextFieldStatus = "default" | "success" | "warning" | "error";
export type TextFieldInputType =
  "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";
export type TextFieldValidateOn = "change" | "blur";
export type TextFieldActionState = "idle" | "loading" | "success" | "fail";

/** Button inside the field (e.g. Verify, Send, Copy). */
export interface TextFieldAction {
  /** Visible text. Omit for an icon-only button (then set `ariaLabel`). */
  label?: string;
  icon?: ReactNode;
  ariaLabel?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  disabledReason?: string;
  /**
   * Runs with the current value. Async is supported: a spinner shows while it runs.
   * Return/resolve `false` or throw to mark it as failed.
   */
  onClick: (value: string) => void | boolean | Promise<void | boolean>;
  onSuccess?: (value: string) => void;
  onFail?: (error: unknown) => void;
  /**
   * Default `true`: after running, the button and field show success / failure (green tick or error).
   * `false`: they go back to normal; the caller reports the result itself (e.g. with a toast).
   */
  showResult?: boolean;
  /** Message shown under the field after success / failure. */
  successMessage?: string;
  failMessage?: string;
}

interface TextFieldBaseProps {
  value: string;
  onChange: (value: string) => void;

  label?: ReactNode;
  subLabel?: ReactNode;
  /** Adds an ⓘ infotip next to the label. */
  info?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  autoComplete?: string;
  className?: string;

  /** Character limit; input beyond it is cut off (also for pasted text). */
  maxLength?: number;
  /** Shows "count/maxLength" under the field. */
  showCount?: boolean;
  /** Custom length rule, e.g. counting `[variable]` as 10 characters. Default: `value.length`. */
  countLength?: (value: string) => number;

  /** Messages, highest priority first: error › warning › success › helperText. */
  error?: string;
  warning?: string;
  success?: string;
  helperText?: string;

  /** Return a message when invalid, nothing when valid. `required` is checked automatically. */
  validate?: (value: string) => string | null | undefined;
  /** When to show validation errors. Default `"blur"`. */
  validateOn?: TextFieldValidateOn;
  onValid?: (value: string) => void;
  onInvalid?: (message: string) => void;

  leftIcon?: ReactNode;
  /** Shows an × to clear the value. */
  clearable?: boolean;
  action?: TextFieldAction;

  onEnter?: (value: string) => void;
  onBlur?: () => void;
  /** Strip joined to the bottom edge of the field (shared border), e.g. a count and buttons. */
  bottomBar?: ReactNode;
  onFocus?: () => void;
  /** Escape pressed (e.g. close a suggestion list). */
  onEscape?: () => void;
}

/** Single-line input. */
export interface TextInputFieldProps extends TextFieldBaseProps {
  isTextbox?: false;
  /** `"number"` accepts digits only (no e, +, - or scroll-to-change). */
  type?: TextFieldInputType;
}

/** Multi-line text box. */
export interface TextboxFieldProps extends TextFieldBaseProps {
  isTextbox: true;
  rows?: number;
  /** Grows with the content up to `TEXT_FIELD_MAX_AUTO_ROWS`. */
  autoResize?: boolean;
}

export type TextFieldProps = TextInputFieldProps | TextboxFieldProps;
