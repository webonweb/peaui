import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.STORYBOOK_PORT ?? '6008');
const baseURL = process.env.STORYBOOK_URL ?? `http://127.0.0.1:${port}`;
const configDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  expect: { timeout: 15_000 },
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL,
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: 'npm run storybook',
    cwd: configDirectory,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
});
