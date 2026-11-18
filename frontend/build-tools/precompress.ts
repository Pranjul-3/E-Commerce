import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { gzipSync } from "node:zlib";
import type { Plugin } from "vite";

/** Text files worth compressing (images / fonts are already compressed). */
const COMPRESSIBLE = new Set([
  ".js",
  ".css",
  ".html",
  ".svg",
  ".json",
  ".txt",
  ".xml",
]);
/** Smaller files gain nothing from compression (headers cost more than they save). */
const MIN_BYTES = 1024;

/**
 * After a production build, writes `file.gz` next to every text file in the output folder (Node's own zlib,
 * no third-party dependency). Gzip works with every browser, server and CDN: a server that supports it
 * sends the .gz with no work per request; one that does not simply serves the
 * original files, so the build works anywhere unchanged.
 */
export function precompress(options: { outDir: string }): Plugin {
  return {
    name: "precompress",
    apply: "build",
    closeBundle() {
      const files = listFiles(options.outDir).filter(
        (f) => COMPRESSIBLE.has(extname(f)) && statSync(f).size >= MIN_BYTES,
      );
      let before = 0;
      let after = 0;
      for (const file of files) {
        const data = readFileSync(file);
        const gz = gzipSync(data, { level: 9 });
        writeFileSync(`${file}.gz`, gz);
        before += data.length;
        after += gz.length;
      }
      this.info(
        `gzipped ${files.length} files: ${(before / 1024).toFixed(0)} kB → ${(after / 1024).toFixed(0)} kB`,
      );
    },
  };
}

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}
