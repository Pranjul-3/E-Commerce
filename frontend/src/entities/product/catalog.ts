import {
  Camera, Headphones, Keyboard, Laptop, Monitor, Mouse, Package, Smartphone, Speaker, Tablet, Watch,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_TEXT } from "@/shared/config/constants";

export type Category = keyof typeof CATEGORY_TEXT;

interface Presentation {
  match: RegExp;
  category: Category;
  icon: LucideIcon;
  /** Plate colour of the artwork. */
  plate: "sage" | "sand" | "clay" | "slate";
}

/**
 * Our own product artwork. The API has no images or categories, so both are derived from the name here.
 * When it gains them, this file is the only place to change.
 */
const PRESENTATIONS: Presentation[] = [
  { match: /headphone/i, category: "audio", icon: Headphones, plate: "sand" },
  { match: /speaker/i, category: "audio", icon: Speaker, plate: "clay" },
  { match: /laptop/i, category: "computing", icon: Laptop, plate: "slate" },
  { match: /monitor/i, category: "computing", icon: Monitor, plate: "sage" },
  { match: /tablet/i, category: "mobile", icon: Tablet, plate: "sand" },
  { match: /phone|samsung/i, category: "mobile", icon: Smartphone, plate: "sage" },
  { match: /watch/i, category: "wearables", icon: Watch, plate: "clay" },
  { match: /camera/i, category: "photography", icon: Camera, plate: "slate" },
  { match: /keyboard/i, category: "accessories", icon: Keyboard, plate: "sage" },
  { match: /mouse/i, category: "accessories", icon: Mouse, plate: "sand" },
];

const FALLBACK: Presentation = {
  match: /.*/, category: "accessories", icon: Package, plate: "sand",
};

export const presentationOf = (name: string): Presentation =>
  PRESENTATIONS.find((p) => p.match.test(name)) ?? FALLBACK;
