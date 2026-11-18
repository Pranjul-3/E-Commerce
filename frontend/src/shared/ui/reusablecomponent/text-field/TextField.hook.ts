import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { LOG_TEXT, TEXT_FIELD_TEXT } from "@/shared/config/constants";
import { logger } from "@/shared/lib/logger";
import { TEXT_FIELD_MAX_AUTO_ROWS } from "./TextField.config";
import type {
  TextFieldActionState,
  TextFieldProps,
  TextFieldStatus,
} from "./TextField.types";
import { defaultCountLength, truncateToLimit } from "./lib/textLimit";

const DIGITS_ONLY = /\D+/g;

export function useTextField(props: TextFieldProps) {
  const {
    value,
    onChange,
    required = false,
    disabled = false,
    readOnly = false,
    maxLength,
    countLength = defaultCountLength,
    error,
    warning,
    success,
    helperText,
    validate,
    validateOn = "blur",
    onValid,
    onInvalid,
    action,
    onEnter,
    onBlur,
    onFocus,
    onEscape,
  } = props;
  const isNumber = !props.isTextbox && props.type === "number";
  const isPassword = !props.isTextbox && props.type === "password";

  const generatedId = useId();
  const id = props.id ?? generatedId;
  const messageId = `${id}-message`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [actionState, setActionState] = useState<TextFieldActionState>("idle");

  /* ---------- validation ---------- */
  const runValidation = (next: string) => {
    const message =
      required && !next.trim()
        ? TEXT_FIELD_TEXT.required
        : (validate?.(next) ?? null);
    setValidationError(message);
    if (message) onInvalid?.(message);
    else onValid?.(next);
    return message;
  };

  /* ---------- value changes ---------- */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let next = event.target.value;
    if (isNumber) next = next.replace(DIGITS_ONLY, "");
    if (maxLength !== undefined)
      next = truncateToLimit(next, maxLength, countLength);
    if (actionState !== "idle") setActionState("idle"); // old result no longer applies
    onChange(next);
    if (validateOn === "change" || touched) runValidation(next);
  };

  const handleBlur = () => {
    setTouched(true);
    runValidation(value);
    onBlur?.();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Escape") onEscape?.();
    // Enter submits single-line inputs; in a text box it adds a new line.
    if (event.key !== "Enter" || props.isTextbox) return;
    setTouched(true);
    if (!runValidation(value)) onEnter?.(value);
  };

  const clear = () => {
    onChange("");
    setActionState("idle");
    if (touched) runValidation("");
  };

  /* ---------- action button ---------- */
  // Reset on every mount (dev StrictMode remounts once; see Toggle).
  const runAction = async () => {
    if (!action || actionState === "loading") return;
    setActionState("loading");
    try {
      const result = await action.onClick(value);
      if (result === false)
        throw new Error(action.failMessage ?? TEXT_FIELD_TEXT.actionFailed);
      setActionState(action.showResult === false ? "idle" : "success");
      action.onSuccess?.(value);
    } catch (err) {
      logger.error(LOG_TEXT.ui.fieldActionFailed, err);
      setActionState(action.showResult === false ? "idle" : "fail");
      action.onFail?.(err);
    }
  };

  /* ---------- auto-resize text box ---------- */
  const autoResize = props.isTextbox && props.autoResize;
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!autoResize || !el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    el.style.height = `${Math.min(el.scrollHeight, lineHeight * TEXT_FIELD_MAX_AUTO_ROWS + 16)}px`;
  }, [autoResize, value]);

  /* ---------- status + message (single source) ---------- */
  const actionFailMessage =
    actionState === "fail"
      ? (action?.failMessage ?? TEXT_FIELD_TEXT.actionFailed)
      : undefined;
  const actionSuccessMessage =
    actionState === "success" ? action?.successMessage : undefined;
  const errorMessage =
    error ??
    (touched || validateOn === "change" ? validationError : null) ??
    actionFailMessage;

  const status: TextFieldStatus = errorMessage
    ? "error"
    : warning
      ? "warning"
      : success || actionSuccessMessage
        ? "success"
        : "default";
  const message =
    errorMessage ?? warning ?? success ?? actionSuccessMessage ?? helperText;

  return {
    id,
    messageId,
    textareaRef,
    status,
    message: message ?? undefined,
    count: countLength(value),
    isInteractive: !disabled && !readOnly,
    isNumber,
    isPassword,
    showPassword,
    togglePassword: () => setShowPassword((s) => !s),
    actionState,
    runAction,
    handleChange,
    handleBlur,
    handleFocus: () => onFocus?.(),
    handleKeyDown,
    clear,
  };
}
