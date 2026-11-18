/** Joins truthy class names: `cx("a", isOn && "b")` -> `"a b"`. */
export const cx = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");
