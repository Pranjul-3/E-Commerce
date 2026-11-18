import { cx } from "@/shared/lib";
import { Tooltip } from "../tooltip";
import { useRadioGroup } from "./RadioGroup.hook";
import type { RadioGroupProps } from "./RadioGroup.types";
import styles from "./RadioGroup.module.scss";

/** Native radios inside a fieldset: arrow keys, labels and screen readers work out of the box. */
export function RadioGroup(props: RadioGroupProps) {
  const { options, label, info, required, readOnly, error, helperText } = props;
  const r = useRadioGroup(props);

  return (
    <fieldset
      className={r.className}
      aria-describedby={r.messageId}
      aria-invalid={!!error || undefined}
    >
      {label && (
        <legend className={styles.legend}>
          <span>
            {label}
            {required && (
              <span className={styles.required} aria-hidden>
                {" "}
                *
              </span>
            )}
          </span>
          {info && <Tooltip isInfotip content={info} position="right" />}
        </legend>
      )}

      <div className={r.listClassName}>
        {options.map((option, index) => {
          const checked = r.isChecked(option);
          const disabled = r.isOptionDisabled(option);
          return (
            <label
              key={option.value}
              htmlFor={r.optionId(index)}
              className={cx(
                styles.option,
                checked && styles.checked,
                disabled && styles.disabled,
              )}
            >
              <input
                id={r.optionId(index)}
                type="radio"
                className={styles.input}
                name={r.name}
                value={option.value}
                checked={checked}
                disabled={disabled}
                required={required}
                aria-readonly={readOnly || undefined}
                onChange={() => r.select(option)}
              />
              <span className={styles.circle} aria-hidden />
              <span className={styles.text}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && (
                  <span className={styles.description}>
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {(error || helperText) && (
        <p
          id={r.messageId}
          className={cx(styles.message, error && styles.error)}
          role={error ? "alert" : undefined}
        >
          {error ?? helperText}
        </p>
      )}
    </fieldset>
  );
}
