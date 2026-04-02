import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  base: process.env.PAGES_BASE_PATH ?? "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./src/test/setup.ts",
    exclude: [...configDefaults.exclude, "e2e/**"],
    testTimeout: 15000,
    hookTimeout: 15000
  },
  server: {
    port: 4173,
    host: "127.0.0.1"
  },
  preview: {
    port: 4173,
    host: "127.0.0.1"
  }
});
