import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./app/tests",
  timeout: 30000,
  retries: 1,

  use: {
    baseURL: "http://localhost:3000",
    headless: false,
    trace: "on-first-retry",
  },
});
