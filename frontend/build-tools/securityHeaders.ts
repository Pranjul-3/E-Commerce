import type { Plugin } from "vite";

/**
 * Production only: puts a Content-Security-Policy (and a referrer policy) into index.html, so the
 * browser only runs our own scripts and only talks to the backend.
 *

 */
export function securityHeaders(options: { apiBaseUrl: string }): Plugin {
  const api = new URL(options.apiBaseUrl);
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'"],
    "img-src": ["'self'", "data:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", api.origin],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };
  // Only when the backend itself is https: http:// calls would break otherwise.
  const upgrade =
    api.protocol === "https:" ? "; upgrade-insecure-requests" : "";
  const csp =
    Object.entries(directives)
      .map(([name, values]) => `${name} ${values.join(" ")}`)
      .join("; ") + upgrade;

  return {
    name: "security-headers",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "meta",
        attrs: { "http-equiv": "Content-Security-Policy", content: csp },
        injectTo: "head-prepend",
      },
      {
        tag: "meta",
        attrs: { name: "referrer", content: "strict-origin-when-cross-origin" },
        injectTo: "head-prepend",
      },
    ],
  };
}
