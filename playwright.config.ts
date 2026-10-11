import { defineConfig, devices } from "@playwright/test";

const auth = process.env.STAGING_BASIC_AUTH || "ckstaging:changeme";
const [username, password] = auth.split(":");

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 2,
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  expect: {
    toHaveScreenshot: { maxDiffPixels: 120, threshold: 0.18 },
  },
  snapshotPathTemplate: "{testDir}/__snapshots__/{testFilePath}/{arg}{ext}",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://staging.ckcapital.co.uk",
    httpCredentials: { username, password },
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3002/en",
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
