import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { securityHeaders } from "./build-tools/securityHeaders.ts";
import { precompress } from "./build-tools/precompress.ts";

const PROD_MODE = "prod";
/** The API gateway; the dev server proxies to it, so the browser never needs CORS. */
const GATEWAY_URL = "http://localhost:8080";

/** A production build without a real backend URL would ship a broken app: stop the build instead. */
function assertProdEnv(mode: string): string {
  if (mode !== PROD_MODE) return "";
  const url =
    loadEnv(mode, process.cwd(), "VITE_").VITE_API_BASE_URL?.trim() ?? "";
  if (!/^https?:\/\/\S+$/.test(url))
    throw new Error(
      `[build:${PROD_MODE}] Set VITE_API_BASE_URL in .env.${PROD_MODE} to the production backend URL (got "${url}").`,
    );
  return url;
}

export default defineConfig(({ mode }) => {
  const prodApiUrl = assertProdEnv(mode);
  return {
    server: {
      proxy: { "/api": { target: GATEWAY_URL, changeOrigin: true } },
    },
    plugins: [
      react(),
      ...(mode === PROD_MODE
        ? [
            securityHeaders({ apiBaseUrl: prodApiUrl }),
            precompress({ outDir: "dist" }),
          ]
        : []),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      minify: true,
      cssMinify: true,
      sourcemap: mode !== PROD_MODE,
      rollupOptions: {
        output: {
          ...(mode === PROD_MODE && {
            minify: { compress: { dropConsole: true, dropDebugger: true } },
            comments: { legal: false },
          }),
        },
      },
    },
  };
});
