// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only)

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// On Vercel (VERCEL env auto-set) use the vercel preset; otherwise static.
const target = (process.env.VERCEL ? "vercel" : "static") as "vercel" | "static";

export default defineConfig({
  plugins: [
    tanstackStart({
      target,
    } as Parameters<typeof tanstackStart>[0]),
  ],
});
