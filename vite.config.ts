import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const target = (process.env.VERCEL ? "vercel" : "static") as "vercel" | "static";

export default defineConfig({
  tanstackStart: { target },
  cloudflare: process.env.VERCEL ? false : undefined,
});
