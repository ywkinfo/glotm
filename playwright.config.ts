import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [["line"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results/playwright",
  use: {
    baseURL: "http://127.0.0.1:4273",
    headless: true,
    viewport: {
      width: 1280,
      height: 720
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command:
      "env -u NO_COLOR npm run build && env -u NO_COLOR npm run preview -- --host 127.0.0.1 --port 4273 --strictPort",
    url: "http://127.0.0.1:4273",
    reuseExistingServer: true,
    timeout: 120_000
  }
});
