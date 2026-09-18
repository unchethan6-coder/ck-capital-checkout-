import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/responsiveness-qaqc.spec.ts"],
  timeout: 45_000,
  retries: 0,
  workers: 4,
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/qaqc/qaqc-results.json" }],
  ],
});
