import { useId } from "react";
import { cx } from "@/shared/lib";
import type { RadioGroupProps, RadioOption } from "./RadioGroup.types";
import styles from "./RadioGroup.module.scss";

export function useRadioGroup({
  value,
  onChange,
  name: nameProp,
  direction = "vertical",
  variant = "default",
  disabled = false,
  readOnly = false,
  error,
  helperText,
  className,
}: RadioGroupProps) {
  const id = useId();
  const name = nameProp ?? `radio-${id}`;
  const messageId = error || helperText ? `${id}-message` : undefined;

  return {
    name,
    messageId,
    optionId: (index: number) => `${id}-option-${index}`,
    isChecked: (option: RadioOption) => option.value === value,
    isOptionDisabled: (option: RadioOption) => disabled || !!option.disabled,
    // Read straight from props: no internal copy of the value.
    select: (option: RadioOption) => {
      if (!disabled && !readOnly && !option.disabled && option.value !== value)
        onChange(option.value);
    },
    className: cx(styles.root, className),
    listClassName: cx(
      styles.options,
      styles[direction],
      styles[variant],
      !!error && styles.invalid,
    ),
  };
}
