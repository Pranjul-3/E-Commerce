import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useClickOutside, useFloatingPosition } from "@/shared/lib";
import {
  DEFAULT_VISIBLE_OPTIONS,
  LIST_PADDING,
  OPTION_HEIGHT,
  SEARCH_BOX_HEIGHT,
} from "./Dropdown.config";
import type { DropdownOption, DropdownProps } from "./Dropdown.types";

const matches = (option: DropdownOption, query: string) => {
  const q = query.trim().toLowerCase();
  return (
    !q ||
    option.label.toLowerCase().includes(q) ||
    option.value.toLowerCase().includes(q)
  );
};

const nextEnabledIndex = (
  options: DropdownOption[],
  from: number,
  step: 1 | -1,
): number => {
  for (let i = 1; i <= options.length; i++) {
    const index = (from + step * i + options.length) % options.length;
    if (!options[index].disabled) return index;
  }
  return -1;
};

export function useDropdown(props: DropdownProps) {
  const { options, disabled = false, readOnly = false } = props;
  // Exactly `visibleOptions` rows (+ the search box), then the list scrolls.
  const rows = props.visibleOptions ?? DEFAULT_VISIBLE_OPTIONS;
  const maxMenuHeight =
    props.maxMenuHeight ??
    rows * OPTION_HEIGHT +
      LIST_PADDING +
      (props.searchable ? SEARCH_BOX_HEIGHT : 0);
  const isInteractive = !disabled && !readOnly;

  const baseId = useId();
  const id = props.id ?? `dropdown-${baseId}`;
  const listboxId = `${id}-listbox`;
  const optionId = useCallback(
    (index: number) => `${id}-option-${index}`,
    [id],
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  /* ---------- value (normalised to an array) ---------- */
  const selectedValues = useMemo(
    () =>
      props.multiple ? props.value : props.value !== null ? [props.value] : [],
    [props.multiple, props.value],
  );
  const isSelected = useCallback(
    (value: string) => selectedValues.includes(value),
    [selectedValues],
  );
  const selectedOptions = useMemo(
    () =>
      selectedValues.map(
        (value) =>
          options.find((o) => o.value === value) ?? { value, label: value },
      ),
    [selectedValues, options],
  );

  const commit = (values: string[]) => {
    if (props.multiple) props.onChange(values);
    else props.onChange(values[0] ?? null);
  };

  /* ---------- open / close ---------- */
  const visibleOptions = useMemo(
    () => options.filter((o) => matches(o, query)),
    [options, query],
  );

  const open = () => {
    if (!isInteractive || isOpen) return;
    const selectedIndex = visibleOptions.findIndex(
      (o) => isSelected(o.value) && !o.disabled,
    );
    setActiveIndex(
      selectedIndex >= 0
        ? selectedIndex
        : nextEnabledIndex(visibleOptions, -1, 1),
    );
    setOpen(true);
  };

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, []);

  const toggle = () => (isOpen ? close() : open());

  useClickOutside([triggerRef, menuRef], close, isOpen);

  useEffect(() => {
    if (isOpen && props.searchable) searchRef.current?.focus();
  }, [isOpen, props.searchable]);

  // Keep the highlighted option in view while navigating with the keyboard.
  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      document
        .getElementById(optionId(activeIndex))
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, activeIndex, optionId]);

  const position = useFloatingPosition(triggerRef, menuRef, {
    open: isOpen,
    maxHeight: maxMenuHeight,
  });

  /* ---------- selection ---------- */
  const selectOption = (option: DropdownOption) => {
    if (option.disabled || !isInteractive) return;
    if (props.multiple) {
      commit(
        isSelected(option.value)
          ? selectedValues.filter((v) => v !== option.value)
          : [...selectedValues, option.value],
      );
      return; // stay open for more picks
    }
    commit([option.value]);
    close();
    triggerRef.current?.focus();
  };

  const removeValue = (value: string) => {
    if (isInteractive) commit(selectedValues.filter((v) => v !== value));
  };

  const clear = () => {
    if (isInteractive) commit([]);
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    const filtered = options.filter((o) => matches(o, text));
    setActiveIndex(nextEnabledIndex(filtered, -1, 1));
  };

  /* ---------- keyboard (shared by trigger and search box) ---------- */
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isInteractive) return;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!isOpen) return open();
        setActiveIndex((i) =>
          nextEnabledIndex(
            visibleOptions,
            i,
            event.key === "ArrowDown" ? 1 : -1,
          ),
        );
        return;
      }
      case "Home":
      case "End":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(
          event.key === "Home"
            ? nextEnabledIndex(visibleOptions, -1, 1)
            : nextEnabledIndex(visibleOptions, visibleOptions.length, -1),
        );
        return;
      case "Enter":
        event.preventDefault();
        if (!isOpen) return open();
        if (visibleOptions[activeIndex])
          selectOption(visibleOptions[activeIndex]);
        return;
      case " ":
        // Space types into the search box; elsewhere it opens/selects.
        if (event.target === searchRef.current) return;
        event.preventDefault();
        if (!isOpen) return open();
        if (visibleOptions[activeIndex])
          selectOption(visibleOptions[activeIndex]);
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          close();
          triggerRef.current?.focus();
        }
        return;
      case "Tab":
        if (isOpen) close();
        return;
    }
  };

  return {
    id,
    listboxId,
    optionId,
    triggerRef,
    menuRef,
    searchRef,
    isOpen,
    isInteractive,
    query,
    activeIndex,
    setActiveIndex,
    visibleOptions,
    selectedOptions,
    hasValue: selectedValues.length > 0,
    isSelected,
    position,
    toggle,
    selectOption,
    removeValue,
    clear,
    handleQueryChange,
    handleKeyDown,
  };
}
