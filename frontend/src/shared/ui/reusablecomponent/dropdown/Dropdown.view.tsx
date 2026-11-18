import { createPortal } from "react-dom";
import { CHIP_TEXT, DROPDOWN_TEXT } from "@/shared/config/constants";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cx } from "@/shared/lib";
import { Chip } from "../chip";
import { Tooltip } from "../tooltip";
import { truncateText, type TruncateMode } from "../truncated-text";
import { DEFAULT_MAX_VISIBLE_CHIPS } from "./Dropdown.config";
import { useDropdown } from "./Dropdown.hook";
import type { DropdownProps } from "./Dropdown.types";
import styles from "./Dropdown.module.scss";

type DropdownState = ReturnType<typeof useDropdown>;

export function Dropdown(props: DropdownProps) {
  const {
    label,
    placeholder = DROPDOWN_TEXT.placeholder,
    required,
    disabled,
    disabledReason,
    readOnly,
    clearable = true,
    size = "md",
    error,
    helperText,
    name,
    className,
  } = props;
  const d = useDropdown(props);
  const describedBy = error || helperText ? `${d.id}-message` : undefined;

  return (
    <div className={cx(styles.root, className)}>
      {label && (
        <span id={`${d.id}-label`} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden>
              {" "}
              *
            </span>
          )}
          {props.info && (
            <Tooltip isInfotip ariaLabel={label} content={props.info} />
          )}
        </span>
      )}

      {/* Trigger only, never the open menu: disabled → why; otherwise the optional hover tooltip. */}
      <Tooltip
        content={disabled ? disabledReason : props.tooltip}
        disabled={d.isOpen || !(disabled ? disabledReason : props.tooltip)}
      >
        <div
          ref={d.triggerRef}
          id={d.id}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? `${d.id}-label` : undefined}
          aria-label={label ? undefined : placeholder}
          aria-expanded={d.isOpen}
          aria-haspopup="listbox"
          aria-controls={d.isOpen ? d.listboxId : undefined}
          aria-activedescendant={
            d.isOpen && d.activeIndex >= 0
              ? d.optionId(d.activeIndex)
              : undefined
          }
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-invalid={!!error || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={cx(
            styles.trigger,
            styles[size],
            d.isOpen && styles.open,
            !!error && styles.invalid,
            disabled && styles.disabled,
            readOnly && styles.readOnly,
          )}
          onClick={d.toggle}
          onKeyDown={d.handleKeyDown}
        >
          <div className={styles.value}>
            {d.hasValue ? (
              <SelectedValue props={props} d={d} />
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </div>

          <div className={styles.icons}>
            {clearable && d.hasValue && d.isInteractive && (
              <button
                type="button"
                className={styles.iconButton}
                aria-label={DROPDOWN_TEXT.clear}
                onClick={(e) => {
                  e.stopPropagation();
                  d.clear();
                }}
              >
                <X size={14} />
              </button>
            )}
            {!readOnly && (
              <ChevronDown
                size={16}
                className={cx(styles.chevron, d.isOpen && styles.chevronOpen)}
                aria-hidden
              />
            )}
          </div>
        </div>
      </Tooltip>

      {name && (
        <input
          type="hidden"
          name={name}
          value={props.multiple ? props.value.join(",") : (props.value ?? "")}
        />
      )}

      {(error || helperText) && (
        <p
          id={describedBy}
          className={cx(styles.message, error && styles.errorMessage)}
        >
          {error ?? helperText}
        </p>
      )}

      {d.isOpen &&
        createPortal(<DropdownMenu props={props} d={d} />, document.body)}
    </div>
  );
}

function SelectedValue({
  props,
  d,
}: {
  props: DropdownProps;
  d: DropdownState;
}) {
  if (!props.multiple) {
    const option = d.selectedOptions[0];
    return (
      <span className={styles.singleValue}>
        {option.icon}
        <ClippedLabel
          text={option.label}
          max={props.labelMaxChars}
          mode={props.labelTruncateMode}
        />
      </span>
    );
  }

  const max = props.maxVisibleChips ?? DEFAULT_MAX_VISIBLE_CHIPS;
  const visible = d.selectedOptions.slice(0, max);
  const hidden = d.selectedOptions.slice(max);

  return (
    <span className={styles.chips}>
      {visible.map((option) => (
        <Chip
          key={option.value}
          label={clip(
            option.label,
            props.labelMaxChars,
            props.labelTruncateMode,
          )}
          title={option.label}
          tone="brand"
          size="sm"
          onRemove={
            d.isInteractive ? () => d.removeValue(option.value) : undefined
          }
        />
      ))}
      {hidden.length > 0 && (
        // Hover / focus: the remaining values, as chips.
        <Tooltip
          position="bottom"
          content={
            <span className={styles.moreChips}>
              {hidden.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  tone="brand"
                  size="sm"
                  onRemove={
                    d.isInteractive
                      ? () => d.removeValue(option.value)
                      : undefined
                  }
                />
              ))}
            </span>
          }
        >
          <Chip
            label={CHIP_TEXT.more(hidden.length)}
            tone="neutral"
            size="sm"
            title=""
          />
        </Tooltip>
      )}
    </span>
  );
}

function DropdownMenu({
  props,
  d,
}: {
  props: DropdownProps;
  d: DropdownState;
}) {
  const { searchable, emptyMessage = DROPDOWN_TEXT.empty } = props;
  const p = d.position;

  return (
    <div
      ref={d.menuRef}
      className={cx(styles.menu, p?.placement === "top" && styles.menuTop)}
      style={{
        top: p?.top,
        bottom: p?.bottom,
        left: p?.left,
        width: p?.width,
        maxHeight: p?.maxHeight,
        // Hidden for the single frame before the first measurement.
        visibility: p ? "visible" : "hidden",
      }}
    >
      {searchable && (
        <div className={styles.searchBox}>
          <Search size={14} aria-hidden />
          <input
            ref={d.searchRef}
            id={`${d.id}-search`}
            name={`${d.id}-search`}
            className={styles.searchInput}
            value={d.query}
            placeholder={DROPDOWN_TEXT.searchPlaceholder}
            aria-label={DROPDOWN_TEXT.searchAria}
            aria-controls={d.listboxId}
            aria-activedescendant={
              d.activeIndex >= 0 ? d.optionId(d.activeIndex) : undefined
            }
            onChange={(e) => d.handleQueryChange(e.target.value)}
            onKeyDown={d.handleKeyDown}
          />
        </div>
      )}

      <ul
        id={d.listboxId}
        role="listbox"
        aria-multiselectable={props.multiple || undefined}
        className={styles.list}
      >
        {d.visibleOptions.length === 0 ? (
          <li className={styles.empty}>{emptyMessage}</li>
        ) : (
          d.visibleOptions.map((option, index) => {
            const selected = d.isSelected(option.value);
            return (
              <li
                key={option.value}
                id={d.optionId(index)}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                className={cx(
                  styles.option,
                  index === d.activeIndex && styles.active,
                  selected && styles.selected,
                  option.disabled && styles.optionDisabled,
                )}
                // Keep focus on the trigger/search box while clicking.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => !option.disabled && d.setActiveIndex(index)}
                onClick={() => d.selectOption(option)}
              >
                {props.multiple && (
                  <span
                    className={cx(
                      styles.checkbox,
                      selected && styles.checkboxChecked,
                    )}
                    aria-hidden
                  >
                    {selected && <Check size={12} />}
                  </span>
                )}
                {option.icon && (
                  <span className={styles.optionIcon}>{option.icon}</span>
                )}
                <ClippedLabel
                  text={option.label}
                  max={props.labelMaxChars}
                  mode={props.labelTruncateMode}
                />
                {option.description && (
                  <span className={styles.description}>
                    {option.description}
                  </span>
                )}
                {!props.multiple && selected && (
                  <Check size={14} className={styles.tick} aria-hidden />
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

const clip = (text: string, max: number | undefined, mode?: TruncateMode) =>
  max ? truncateText(text, max, mode) : text;

/** A label cut to `max` characters, with the full text in a tooltip when cut. */
function ClippedLabel({
  text,
  max,
  mode,
}: {
  text: string;
  max?: number;
  mode?: TruncateMode;
}) {
  const shown = clip(text, max, mode);
  if (shown === text) return <span className={styles.ellipsis}>{text}</span>;
  return (
    <Tooltip content={text}>
      <span className={styles.ellipsis}>{shown}</span>
    </Tooltip>
  );
}
