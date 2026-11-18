import type { ReactNode } from "react";
import type { TruncateMode } from "../truncated-text";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  /** Secondary text shown on the right of the option. */
  description?: string;
}

export type DropdownSize = "sm" | "md" | "lg";

interface DropdownBaseProps {
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Shown in a tooltip on hover while disabled (why it can't be used yet). */
  disabledReason?: string;
  /** Hover tooltip on the field itself (not the open menu, so it never covers the options). */
  tooltip?: ReactNode;
  readOnly?: boolean;
  /** Adds a search box at the top of the menu. */
  searchable?: boolean;
  /** Shows an × to clear the value. Default `true`. */
  clearable?: boolean;
  size?: DropdownSize;
  /** Shown under the field in red; also marks the field invalid. */
  error?: string;
  helperText?: string;
  /** Adds an ⓘ infotip next to the label. */
  info?: ReactNode;
  /** Preferred menu height in px; shrinks automatically near viewport edges. Overrides `visibleOptions`. */
  maxMenuHeight?: number;
  /** How many options show before the menu scrolls. Default 4. */
  visibleOptions?: number;
  /** Cut option labels (and the selected value) to this many characters + "…"; the full text is a tooltip. */
  labelMaxChars?: number;
  /** Where long labels are cut (with `labelMaxChars`): "end" (default), "start" or "middle". */
  labelTruncateMode?: TruncateMode;
  emptyMessage?: string;
  id?: string;
  name?: string;
  className?: string;
}

export interface SingleDropdownProps extends DropdownBaseProps {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
}

export interface MultiDropdownProps extends DropdownBaseProps {
  multiple: true;
  value: string[];
  onChange: (values: string[]) => void;
  /** Chips shown before collapsing into "+N". Default 2. */
  maxVisibleChips?: number;
}

/** `multiple` decides the value type, so `onChange` is always correctly typed. */
export type DropdownProps = SingleDropdownProps | MultiDropdownProps;
