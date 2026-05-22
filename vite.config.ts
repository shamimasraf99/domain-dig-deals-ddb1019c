import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    target: "static",
    spa: {
      enabled: true,
      prerender: { outputPath: "/index" },
    },
    prerender: { enabled: true },
  },
});
