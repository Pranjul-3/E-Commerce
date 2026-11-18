/** Bump the version when the saved shape changes. */
export const PERSIST_CONFIG = {
  key: "meridian:state",
  version: 1,
  slices: ["cart"],
} as const;

/** Tab-scoped, so a session ends when the tab closes. */
export const SESSION_TOKEN_KEY = "meridian:session";
