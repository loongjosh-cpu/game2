import { test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const SAVE_KEY = "dream-poker-prototype-save";
const outDir = path.resolve("test-results/ui-audit");

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
}

async function collectLayoutIssues(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const issues = [];
    for (const el of document.querySelectorAll("button, .panel, .card, .mini-card, .shop-slot, .node, .modal")) {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (rect.right > viewportWidth + 1) {
        issues.push({
          selector: String(el.className || el.tagName),
          text: (el.textContent || "").trim().slice(0, 60),
          right: Math.round(rect.right),
          viewportWidth,
        });
      }
      if (el.scrollWidth > el.clientWidth + 2) {
        issues.push({
          selector: String(el.className || el.tagName),
          text: (el.textContent || "").trim().slice(0, 60),
          overflowX: Math.round(el.scrollWidth - el.clientWidth),
        });
      }
    }
    return issues;
  });
}

async function startRun(page, seed) {
  await page.goto("/");
  await page.getByLabel("Seed").fill(seed);
  await page.getByRole("button", { name: "开始一局" }).click();
  await page.getByRole("heading", { name: "第1层路线" }).waitFor();
}

async function enterNode(page, selector) {
  await page.locator(selector).click();
  await page.locator("[data-confirm-node]").click();
}

async function forceFirstNode(page, type, patch = {}) {
  await page.evaluate(([key, nodeType, extra]) => {
    const data = JSON.parse(localStorage.getItem(key));
    data.run.map.cols[0][0].type = nodeType;
    Object.assign(data.run, extra);
    localStorage.setItem(key, JSON.stringify(data));
  }, [SAVE_KEY, type, patch]);
  await page.reload();
  await page.getByRole("button", { name: "读取存档" }).click();
}

test("capture desktop UI audit screenshots", async ({ page }) => {
  test.skip(!process.env.UI_AUDIT, "Run with UI_AUDIT=1 when collecting visual audit screenshots.");
  await fs.mkdir(outDir, { recursive: true });
  const report = [];

  await page.goto("/");
  await screenshot(page, "01-start");
  report.push({ page: "start", issues: await collectLayoutIssues(page) });

  await startRun(page, "R1-2026-0526-0001");
  await screenshot(page, "02-map");
  report.push({ page: "map", issues: await collectLayoutIssues(page) });

  await page.locator("[data-open-backpack]").first().click();
  await screenshot(page, "03-backpack");
  report.push({ page: "backpack", issues: await collectLayoutIssues(page) });

  await page.locator("[data-map]").click();
  await forceFirstNode(page, "shop", { joker: 12 });
  await enterNode(page, "[data-node='L1C0R0']");
  await screenshot(page, "04-shop");
  report.push({ page: "shop", issues: await collectLayoutIssues(page) });

  await page.locator("[data-continue]").click();
  await startRun(page, "R1-2026-0526-0002");
  await forceFirstNode(page, "upgrade");
  await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    for (const id of ["2-heart", "2-spade", "3-heart"]) data.run.backpack[id].count = 2;
    localStorage.setItem(key, JSON.stringify(data));
  }, SAVE_KEY);
  await page.reload();
  await page.getByRole("button", { name: "读取存档" }).click();
  await enterNode(page, "[data-node='L1C0R0']");
  await screenshot(page, "05-upgrade");
  report.push({ page: "upgrade", issues: await collectLayoutIssues(page) });

  await startRun(page, "R1-5372-9200-2664");
  await enterNode(page, "[data-node='L1C0R0']");
  await screenshot(page, "06-battle");
  report.push({ page: "battle", issues: await collectLayoutIssues(page) });

  await fs.writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.map((item) => ({ page: item.page, issueCount: item.issues.length, issues: item.issues.slice(0, 5) })), null, 2));
});
