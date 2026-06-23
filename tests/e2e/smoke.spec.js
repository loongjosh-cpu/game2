import { expect, test } from "@playwright/test";

test("start page can create a deterministic run", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Seed").fill("R1-0000-0000-0000");
  await page.getByRole("button", { name: "开始一局" }).click();

  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
  await expect(page.getByText("Seed R1-0000-0000-0000")).toBeVisible();
  await expect(page.getByRole("button", { name: /商店/ })).toBeVisible();
});
