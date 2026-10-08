import { defineConfig } from "@playwright/test";

/** Pure-formula tests only: no dev server, no browser. */
export default defineConfig({
  testDir: "./tests",
  testMatch: /calculators\.spec\.ts/,
  retries: 0,
  reporter: [["list"]],
});
