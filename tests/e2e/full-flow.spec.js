import { expect, test } from "@playwright/test";

const SAVE_KEY = "dream-poker-prototype-save";

async function startRun(page, seed) {
  await page.goto("/");
  await page.getByLabel("Seed").fill(seed);
  await page.getByRole("button", { name: "开始一局" }).click();
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
}

async function loadSavedRun(page) {
  await page.reload();
  await expect(page.getByRole("button", { name: "读取存档" })).toBeEnabled();
  await page.getByRole("button", { name: "读取存档" }).click();
}

async function enterNode(page, selector) {
  await page.locator(selector).click();
  await page.locator("[data-confirm-node]").click();
}

async function continueIfPresent(page) {
  const button = page.locator("[data-continue]");
  if (await button.isVisible().catch(() => false)) {
    await button.click();
  }
}

test("shop can refresh for free once and then shows the paid refresh cost", async ({ page }) => {
  await startRun(page, "R1-0000-0000-0000");

  await enterNode(page, "[data-node='L1C0R2']");
  await expect(page.getByRole("heading", { name: "商店" })).toBeVisible();
  await expect(page.locator("[data-refresh-shop]")).toHaveCount(1);
  await expect(page.locator("[data-refresh-shop]")).toHaveText("刷新 0 Joker");

  await page.locator("[data-refresh-shop]").click();
  await expect(page.locator("[data-refresh-shop]")).toHaveCount(1);
  await expect(page.locator("[data-refresh-shop]")).toHaveText("刷新 2 Joker");
  await continueIfPresent(page);
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
});

test("backpack card management can remove and restore a card slot", async ({ page }) => {
  await startRun(page, "R1-0000-0000-0000");

  await page.locator("[data-open-backpack]").first().click();
  await expect(page.getByRole("heading", { name: "大背包" })).toBeVisible();
  await expect(page.locator(".page-resources")).toContainText("26/26");

  await page.locator("[data-album-toggle]").first().click();
  await expect(page.locator(".page-resources")).toContainText("25/26");
  await expect(page.locator(".page-resources")).toContainText("需补齐");

  await page.locator("[data-album-toggle]").first().click();
  await expect(page.locator(".page-resources")).toContainText("26/26");
  await expect(page.locator(".page-resources")).toContainText("可战斗");
});

test("combat nodes are blocked when the album is incomplete", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");

  await page.locator("[data-open-backpack]").first().click();
  await expect(page.getByRole("heading", { name: "大背包" })).toBeVisible();
  await page.locator("[data-album-toggle]").first().click();
  await expect(page.locator(".page-resources")).toContainText("25/26");

  await page.locator("[data-map]").click();
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
  await page.locator("[data-node='L1C0R0']").click();

  await expect(page.locator(".modal")).toContainText("卡册必须正好装入26种牌");
  await expect(page.locator("[data-confirm-node]")).toBeDisabled();
});

test("upgrade room surfaces crafting state and enables crafting after three spare cards", async ({ page }) => {
  await startRun(page, "R1-2468-1357-9999");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.map.cols[0][0].type = "upgrade";
    for (const id of ["2-heart", "2-spade", "3-heart"]) {
      data.run.backpack[id].count = 2;
    }
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "制牌室" })).toBeVisible();
  await expect(page.locator(".section-head", { hasText: "本层UP：2 / 3 / 4" })).toBeVisible();
  await expect(page.locator("[data-craft-up-card]")).toBeDisabled();

  await page.locator("[data-craft-card]").nth(0).click();
  await page.locator("[data-craft-card]").nth(1).click();
  await page.locator("[data-craft-card]").nth(2).click();
  await expect(page.locator("[data-craft-up-card]")).toBeEnabled();
});

test("elite node preview shows elite rewards and can enter an elite battle", async ({ page }) => {
  await startRun(page, "R1-0000-1111-2222");

  await page.locator("[data-node='L1C0R1']").click();
  await expect(page.locator(".modal")).toContainText("精英战斗");
  await expect(page.locator(".modal")).toContainText("2个当前层卡包");
  await expect(page.locator(".modal")).toContainText("1个随机藏品");
  await expect(page.locator(".modal")).toContainText("7经验");

  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "精英战斗 · 回合 1" })).toBeVisible();
  await expect(page.locator("[data-detail-intent]").first()).toBeVisible();
});

test("battle entry shows enemy intent before any speed-based damage resolves", async ({ page }) => {
  await startRun(page, "R1-0000-1111-2222");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.hero.hp = 20;
    data.run.hero.maxHp = 20;
    data.run.hero.speed = 1;
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R1']");
  await expect(page.getByRole("heading", { name: "精英战斗 · 回合 1" })).toBeVisible();
  await expect(page.locator(".hero-hp")).toContainText("20/20");
  await expect(page.locator(".enemy-intent").first()).toBeVisible();
  await expect(page.locator(".enemy-intent").first()).not.toContainText("等待");
  await page.locator("[data-detail-intent]").first().click();
  await expect(page.locator(".detail-row", { hasText: "准备效果" })).toContainText(/基础伤害|护盾|恢复|提升|降低|使|调度|召唤|封锁|清除|沉默|防御姿态/);
});

test("speed order resolves only after the player confirms a hand", async ({ page }) => {
  await startRun(page, "R1-0000-1111-2222");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.hero.hp = 20;
    data.run.hero.maxHp = 20;
    data.run.hero.speed = 1;
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R1']");
  await expect(page.locator(".hero-hp")).toContainText("20/20");
  await page.locator("[data-pick-suggestion]").click();
  await page.locator("[data-play]").click();
  await expect(page.locator(".combat-summary.enemy-summary, .combat-summary.player-summary, .reward-panel, .ending-panel")).toBeVisible();
});

test("low-health elite encounter can reach the defeat ending", async ({ page }) => {
  await startRun(page, "R1-0000-1111-2222");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.hero.hp = 1;
    data.run.hero.maxHp = 1;
    data.run.hero.attack = 0;
    data.run.hero.defense = 0;
    data.run.hero.speed = 1;
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);

  await loadSavedRun(page);
  await enterNode(page, "[data-node='L1C0R1']");

  for (let turn = 0; turn < 4; turn += 1) {
    if (await page.getByRole("heading", { name: "失败" }).isVisible().catch(() => false)) break;
    if (!(await page.getByRole("heading", { name: /战斗/ }).isVisible().catch(() => false))) break;
    await page.locator("[data-pick-suggestion]").click();
    await page.locator("[data-play]").click();
  }

  await expect(page.getByRole("heading", { name: "失败" })).toBeVisible();
  await expect(page.getByRole("button", { name: "重新开始" })).toBeVisible();
});

test("boss node preview shows boss rewards and can enter a boss battle", async ({ page }) => {
  await startRun(page, "R1-0000-1111-2222");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    const run = data.run;
    run.layer = 3;
    run.nodeCount = 13;
    run.hero.hp = 999;
    run.hero.maxHp = 999;
    run.currentCol = 3;
    run.currentNodeId = "L1C3R0";
    run.map.layer = 3;
    const source = run.map.cols[3][0];
    const boss = run.map.cols[4][0];
    source.done = true;
    source.links = [{ to: boss.id, parallel: false }];
    boss.type = "boss";
    run.completedNodes = [source.id];
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);

  await loadSavedRun(page);
  await expect(page.getByRole("heading", { name: "第3层路线" })).toBeVisible();

  await page.locator("[data-node='L1C4R0']").click();
  await expect(page.locator(".modal")).toContainText("Boss");
  await expect(page.locator(".modal")).toContainText("5个当前层卡包");
  await expect(page.locator(".modal")).toContainText("2个随机藏品");
  await expect(page.locator(".modal")).toContainText("10经验");

  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "Boss · 回合 1" })).toBeVisible();
  await expect(page.locator("[data-detail-intent]").first()).toBeVisible();
});

test("first battle can be completed with the suggested hand and opens its reward pack", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();

  for (let turn = 0; turn < 8; turn += 1) {
    if (await page.getByRole("heading", { name: /普通战斗胜利/ }).isVisible().catch(() => false)) break;
    await page.locator("[data-pick-suggestion]").click();
    await page.locator("[data-play]").click();
  }

  await expect(page.getByRole("heading", { name: /普通战斗胜利/ })).toBeVisible();
  await expect(page.locator(".settlement-card", { hasText: /[1-5]级卡包|奖励卡包/ })).toBeVisible();
  await expect(page.locator(".settlement-card.loot-pack")).toBeVisible();
  await expect(page.locator(".settlement-card.loot-joker")).toBeVisible();
  await continueIfPresent(page);
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();

  await page.locator("[data-open-packs]").first().click();
  await expect(page.getByRole("heading", { name: "卡包管理" })).toBeVisible();
  await page.locator("[data-open-pack]").first().click();
  await expect(page.locator("h2", { hasText: /打开[1-5]级卡包|打开奖励卡包/ })).toBeVisible();
  await expect(page.locator(".settlement-card")).toHaveCount(4);
  await expect(page.locator(".settlement-card").first()).toContainText("加入大背包");
});

test("guide and battle detail panels explain core rules and enemy intent", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-open-guide]").first().click();
  await expect(page.getByRole("heading", { name: "规则速览" })).toBeVisible();
  await expect(page.locator(".guide-card")).toHaveCount(5);
  await expect(page.getByText("战斗出牌")).toBeVisible();
  await page.getByRole("button", { name: "关闭" }).click();

  await startRun(page, "R1-5372-9200-2664");
  await page.locator("[data-open-guide]").first().click();
  await expect(page.getByRole("heading", { name: "规则速览" })).toBeVisible();
  await page.getByRole("button", { name: "关闭" }).click();

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
  await page.locator("[data-detail-intent]").first().click();
  await expect(page.locator(".detail-head")).toContainText("准备行动");
  await expect(page.locator(".detail-row", { hasText: "准备效果" })).toBeVisible();
  await expect(page.locator(".detail-row", { hasText: "沉默说明" })).toHaveCount(0);
});

test("combat summary surfaces action feedback chips after a played hand", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
  await page.locator("[data-pick-suggestion]").click();
  await page.locator("[data-play]").click();

  if (await page.getByRole("heading", { name: /普通战斗胜利/ }).isVisible().catch(() => false)) {
    await expect(page.locator(".settlement-card.loot-pack")).toBeVisible();
    return;
  }

  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
  await expect(page.locator(".combat-summary.player-summary, .combat-summary.enemy-summary")).toBeVisible();
  await expect(page.locator(".feedback-chip").first()).toBeVisible();
});

test("battle locks out backpack and pack management", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");
  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();

  await expect(page.locator(".side-actions [data-open-backpack]")).toBeDisabled();
  await expect(page.locator(".side-actions [data-open-packs]")).toBeDisabled();
  await expect(page.locator(".side-section-head", { hasText: "资源" })).toContainText("战斗中锁定");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
});

test("pack manager closes with close wording instead of returning to map wording", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");
  await page.locator(".map-resourcebar [data-open-packs]").click();
  await expect(page.getByRole("heading", { name: "卡包管理" })).toBeVisible();
  await expect(page.getByRole("button", { name: "关闭卡包" })).toBeVisible();
  await expect(page.getByRole("button", { name: "返回地图" })).toHaveCount(0);
});

test("temporary consume card action appears after selecting four cards", async ({ page }) => {
  await startRun(page, "R1-5372-9200-2664");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    const firstAlbumCard = data.run.album[0];
    data.run.backpack[firstAlbumCard].count = 2;
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
  await expect(page.locator("[data-open-temp-consume]")).toBeDisabled();
  await expect(page.locator(".battle-action-hint")).toContainText("先选择4张牌");

  const handCards = page.locator(".hand [data-card]");
  for (let i = 0; i < 4; i += 1) {
    await handCards.nth(i).click();
  }
  await expect(page.locator("[data-open-temp-consume]")).toBeEnabled();
  await page.locator("[data-open-temp-consume]").click();
  await expect(page.getByRole("heading", { name: "一次性消耗补牌" })).toBeVisible();
  await page.locator("[data-temp-card]").first().click();
  await expect(page.locator("[data-play]")).toBeEnabled();
  await expect(page.locator(".battle-hand-title")).toContainText("已选 5/5");
});

test("save and load can restore a deterministic run from local storage", async ({ page }) => {
  await startRun(page, "R1-2468-1357-9999");
  await page.locator("[data-save]").click();
  await expect(page.locator(".log")).toContainText("已保存到本地浏览器");

  await loadSavedRun(page);
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
  await expect(page.getByText("Seed R1-2468-1357-9999")).toBeVisible();
});

test("lab view exposes reproducibility data and can run the fixed strategy smoke", async ({ page }) => {
  await startRun(page, "R1-1357-2468-0001");

  await page.locator("[data-open-lab]").first().click();
  await expect(page.getByRole("heading", { name: "实验室" })).toBeVisible();
  await expect(page.locator(".lab-card", { hasText: "随机与复现" })).toContainText("R1-1357-2468-0001");
  await expect(page.locator(".save-export")).toHaveCount(2);

  await page.locator("[data-run-smoke]").click();
  await expect(page.locator(".reward-card", { hasText: "试跑结果" })).toBeVisible();
  await expect(page.locator(".reward-card", { hasText: "胜利" })).toBeVisible();
});

test("event choices surface gain cost and special tags", async ({ page }) => {
  await startRun(page, "R1-4245-8425-2293");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.layer = 2;
    data.run.map.cols[0][0].type = "event";
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: /事件/ })).toBeVisible();
  await expect(page.locator(".event-option")).not.toHaveCount(0);
  await expect(page.locator(".event-tags")).not.toHaveCount(0);
  await expect(page.locator(".event-tags b").first()).toBeVisible();
});

test("main route links are not charged as parallel traversal after row collapse", async ({ page }) => {
  await startRun(page, "R1-4245-8425-2293");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    data.run.layer = 2;
    data.run.map.cols[0][0].type = "event";
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: /事件/ })).toBeVisible();
  await page.locator("[data-event-option]:not([disabled])").first().click();
  await continueIfPresent(page);

  const nextMainRouteNode = page.locator("[data-node='L1C1R0']");
  await expect(nextMainRouteNode).toBeVisible();
  await expect(nextMainRouteNode).not.toContainText("并行-2包");
  await nextMainRouteNode.click();
  await expect(page.locator("[data-confirm-node]")).toBeEnabled();
});

test("parallel traversal is a same-column extra node and costs packs", async ({ page }) => {
  await startRun(page, "R1-0000-0000-0000");
  await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    const firstCol = data.run.map.cols[0];
    firstCol[0].type = "shop";
    firstCol[1].type = "shop";
    firstCol[1].links = firstCol[1].links.filter((link) => link.to !== firstCol[0].id);
    firstCol[1].links.push({ to: firstCol[0].id, parallel: true });
    data.run.unopenedPacks = [
      { id: "test-pack-1", quality: 1 },
      { id: "test-pack-2", quality: 1 },
    ];
    localStorage.setItem(saveKey, JSON.stringify(data));
  }, SAVE_KEY);
  await loadSavedRun(page);

  await enterNode(page, "[data-node='L1C0R1']");
  await expect(page.getByRole("heading", { name: "商店" })).toBeVisible();
  await continueIfPresent(page);
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();

  const parallelNode = page.locator("[data-node='L1C0R0']");
  await expect(parallelNode).toBeVisible();
  await expect(parallelNode).toContainText("并行-2包");
  await parallelNode.click();
  await expect(page.locator(".modal")).toContainText("并行-2包");
  await expect(page.locator("[data-confirm-node]")).toBeDisabled();
  await page.locator("[data-parallel-pack='1'][data-parallel-pack-delta='1']").click();
  await page.locator("[data-parallel-pack='1'][data-parallel-pack-delta='1']").click();
  await expect(page.locator(".modal")).toContainText("已选 2/2");
  await expect(page.locator("[data-confirm-node]")).toBeEnabled();
  await page.locator("[data-confirm-node]").click();
  await page.locator("[data-save]").click();

  const runState = await page.evaluate((saveKey) => {
    const data = JSON.parse(localStorage.getItem(saveKey));
    return {
      currentCol: data.run.currentCol,
      currentNodeId: data.run.currentNodeId,
      packs: data.run.unopenedPacks.length,
      nodeCount: data.run.nodeCount,
    };
  }, SAVE_KEY);
  expect(runState.currentCol).toBe(0);
  expect(runState.currentNodeId).toBe("L1C0R0");
  expect(runState.packs).toBe(0);
  expect(runState.nodeCount).toBe(3);
});
