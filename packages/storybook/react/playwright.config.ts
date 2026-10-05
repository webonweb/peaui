import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.STORYBOOK_PORT ?? "6006");
const baseURL = process.env.STORYBOOK_URL ?? `http://127.0.0.1:${port}`;
const configDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 4,
  reporter: "list",
  timeout: 30_000,
  use: {
    baseURL,
    browserName: (process.env.PEAUI_BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit',
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run storybook",
    cwd: configDirectory,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
});
