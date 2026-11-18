// Numbers as the browser's locale writes them (12,000 · 94.7%).

const whole = new Intl.NumberFormat();
const oneDecimal = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

export const formatCount = (n: number): string => whole.format(n);

/** part / total as "94.7%"; "0%" when there is no total. */
export const formatPercent = (part: number, total: number): string =>
  `${oneDecimal.format(total > 0 ? (part / total) * 100 : 0)}%`;
