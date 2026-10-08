import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/responsiveness-qaqc.spec.ts"],
  timeout: 45_000,
  retries: 0,
  workers: 4,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3050",
    trace: "off",
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/qaqc/qaqc-results.json" }],
  ],
});
