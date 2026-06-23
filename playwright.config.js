import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const localChrome = path.join(
  os.homedir(),
  "Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
);

const executablePath = process.env.PLAYWRIGHT_CHROME_PATH
  || (fs.existsSync(localChrome) ? localChrome : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    ...devices["Desktop Chrome"],
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: "npm run preview -- --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: true,
    timeout: 20_000,
  },
});
