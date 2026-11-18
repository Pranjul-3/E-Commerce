import { useEffect, useId, useRef, type ChangeEvent } from "react";
import { cx } from "@/shared/lib";
import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.scss";

export function useCheckbox({
  checked,
  onChange,
  indeterminate = false,
  size = "md",
  disabled = false,
  error,
  id: idProp,
  className,
}: CheckboxProps) {
  // Unique id per instance (warcs used the label as id, which clashed when labels repeated).
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  // Read straight from props: no internal copy of `checked` that can drift.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return {
    id,
    inputRef,
    messageId: error ? `${id}-error` : undefined,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {
      if (!disabled) onChange(e.target.checked);
    },
    ariaChecked: indeterminate ? ("mixed" as const) : checked,
    className: cx(
      styles.root,
      styles[size],
      disabled && styles.disabled,
      !!error && styles.invalid,
      className,
    ),
  };
}
