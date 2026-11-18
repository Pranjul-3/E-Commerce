import { Check, Minus } from "lucide-react";
import { Tooltip } from "../tooltip";
import { useCheckbox } from "./Checkbox.hook";
import type { CheckboxProps } from "./Checkbox.types";
import styles from "./Checkbox.module.scss";

export function Checkbox(props: CheckboxProps) {
  const {
    checked,
    label,
    description,
    indeterminate,
    disabled,
    required,
    error,
    info,
    ariaLabel,
    name,
    value,
  } = props;
  const c = useCheckbox(props);
  const iconSize = props.size === "sm" ? 11 : 13;

  return (
    <div className={c.className}>
      <div className={styles.row}>
        <label htmlFor={c.id} className={styles.control}>
          <input
            ref={c.inputRef}
            id={c.id}
            type="checkbox"
            className={styles.input}
            checked={checked}
            onChange={c.handleChange}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            aria-checked={c.ariaChecked}
            aria-invalid={!!error || undefined}
            aria-describedby={c.messageId}
            aria-label={label ? undefined : ariaLabel}
          />
          <span className={styles.box} aria-hidden>
            {indeterminate ? (
              <Minus size={iconSize} strokeWidth={3} />
            ) : (
              checked && <Check size={iconSize} strokeWidth={3} />
            )}
          </span>
          {label && (
            <span className={styles.text}>
              <span className={styles.label}>
                {label}
                {required && (
                  <span className={styles.required} aria-hidden>
                    {" "}
                    *
                  </span>
                )}
              </span>
              {description && (
                <span className={styles.description}>{description}</span>
              )}
            </span>
          )}
        </label>
        {info && <Tooltip isInfotip content={info} />}
      </div>
      {error && (
        <p id={c.messageId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
