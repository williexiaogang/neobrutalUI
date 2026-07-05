import { defineConfig, devices } from "@playwright/test";

/**
 * Neo-Brutal UI — Visual Regression Configuration
 *
 * Screenshot tests run against the built showcase app.
 * Baseline snapshots are committed in tests/visual/screenshots/.
 */

export default defineConfig({
  testDir: "./specs",
  snapshotDir: "../screenshots",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "../report", open: "never" }],
  ],
  use: {
    baseURL: process.env.SHOWCASE_URL || "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
  webServer: {
    command: "pnpm --filter @neo-brutal-ui/showcase preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
