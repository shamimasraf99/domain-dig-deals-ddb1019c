// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only)

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// Use Vercel target when building on Vercel (sets VERCEL=1 automatically),
// otherwise build as a static site for local/Cloudflare workflows.
const target = process.env.VERCEL ? "vercel" : "static";

export default defineConfig({
  plugins: [
    tanstackStart({
      target,
    }),
  ],
});
