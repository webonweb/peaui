import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.STORYBOOK_PORT ?? "6007");
const baseURL = process.env.STORYBOOK_URL ?? `http://127.0.0.1:${port}`;
const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const browserName = (process.env.PEAUI_BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit';

export default defineConfig({
  testDir: "./tests",
  outputDir: path.join(configDirectory, 'test-results', browserName),
  fullyParallel: true,
  workers: 4,
  reporter: "list",
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    browserName,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
    viewport: {
      width: 1280,
      height: 900,
    },
  },
  webServer: process.env.STORYBOOK_URL ? undefined : {
    command: process.env.STORYBOOK_TEST_STATIC === "1"
      ? `node ../../../scripts/storybook-server.mjs ./storybook-static ${port}`
      : `npm exec -- storybook dev --ci --host 127.0.0.1 --port ${port}`,
    cwd: configDirectory,
    env: { BROWSER: "none", STORYBOOK_DISABLE_TELEMETRY: "true" },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: `${baseURL}/index.json`,
  },
});
