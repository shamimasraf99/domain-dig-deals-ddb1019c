import { defineConfig, mergeConfig } from "vite";
import { lovableTanstackConfig } from "@lovable.dev/vite-tanstack-config";

const target = (process.env.VERCEL ? "vercel" : "static") as "vercel" | "static";

export default defineConfig((env) =>
  mergeConfig(
    lovableTanstackConfig({ mode: env.mode, tanstackStart: { target } }),
    {},
  ),
);
