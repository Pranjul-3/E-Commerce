const env = import.meta.env;

/** Written as `import.meta.env.MODE` on purpose: Vite replaces that exact expression at build time. */
export const IS_PROD_BUILD = import.meta.env.MODE === "prod";

/** To add a server: add one entry here, then use `server: "<name>"` on its endpoints. */
export const API_SERVERS = {
  main: { envVar: "VITE_API_BASE_URL", placeholder: "" },
} as const satisfies Record<string, { envVar: string; placeholder: string }>;

export type ApiServerName = keyof typeof API_SERVERS;

const envString = (name: string): string | undefined => {
  const value: unknown = env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const serverUrls = Object.fromEntries(
  (Object.keys(API_SERVERS) as ApiServerName[]).map((name) => [
    name,
    envString(API_SERVERS[name].envVar) ?? API_SERVERS[name].placeholder,
  ]),
) as Record<ApiServerName, string>;

export const API_CONFIG = {
  servers: serverUrls,
  defaultServer: "main" as ApiServerName,
} as const;
