/**
 * Post-build script: injects a MessagePort polyfill at the top of the
 * OpenNext server bundle so that undici's module-evaluation code
 * (`webidl.is.MessagePort = webidl.util.MakeTypeAssertion(MessagePort)`)
 * does not throw a ReferenceError on Cloudflare Workers.
 *
 * Run after `opennextjs-cloudflare build` and before `wrangler deploy`.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const HANDLER_PATH = resolve(".open-next/server-functions/default/handler.mjs");

const POLYFILL = `
// --- MessagePort polyfill (injected by scripts/patch-worker.mjs) ---
if (typeof globalThis.MessagePort === "undefined") {
  if (typeof globalThis.MessageChannel !== "undefined") {
    globalThis.MessagePort = new globalThis.MessageChannel().port1.constructor;
  } else {
    globalThis.MessagePort = class MessagePort {};
  }
}
// --- end polyfill ---
`;

const src = readFileSync(HANDLER_PATH, "utf8");

if (src.includes("MessagePort polyfill (injected by scripts/patch-worker.mjs)")) {
  console.log("[patch-worker] polyfill already present — skipping.");
  process.exit(0);
}

// Insert AFTER the first line (the esbuild banner import) so the import stays valid ESM.
const firstNewline = src.indexOf("\n");
const patched = src.slice(0, firstNewline + 1) + POLYFILL + src.slice(firstNewline + 1);

writeFileSync(HANDLER_PATH, patched);
console.log("[patch-worker] MessagePort polyfill injected into handler.mjs");
