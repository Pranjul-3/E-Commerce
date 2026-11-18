export const CHIP_TONES = [
  "neutral",
  "brand",
  "success",
  "warning",
  "danger",
  "info",
  "purple",
  "teal",
  "slate",
  "indigo",
  "pink",
  "cyan",
  "rose",
  "lime",
  "brown",
] as const;
export type ChipTone = (typeof CHIP_TONES)[number];
