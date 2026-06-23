import { expect, test } from "@playwright/test";

async function startRun(page, seed = "R1-5372-9200-2664") {
  await page.goto("/");
  await page.getByLabel("Seed").fill(seed);
  await page.getByRole("button", { name: "开始一局" }).click();
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function enterNode(page, selector) {
  await page.locator(selector).click();
  await page.locator("[data-confirm-node]").click();
}

async function loadSavedRun(page) {
  await page.reload();
  await expect(page.getByRole("button", { name: "读取存档" })).toBeEnabled();
  await page.getByRole("button", { name: "读取存档" }).click();
}

async function forceFirstNode(page, type, patch = {}) {
  await page.evaluate(([nodeType, extra]) => {
    const data = JSON.parse(localStorage.getItem("dream-poker-prototype-save"));
    data.run.map.cols[0][0].type = nodeType;
    Object.assign(data.run, extra);
    localStorage.setItem("dream-poker-prototype-save", JSON.stringify(data));
  }, [type, patch]);
  await loadSavedRun(page);
}

async function expectSurfaceStable(page, label) {
  await expectNoHorizontalOverflow(page);
  const issues = await page.evaluate(() => {
    const selectors = [
      ".topbar",
      ".layout",
      ".panel",
      ".battle-tacticalbar",
      ".battle-stage",
      ".hero-panel",
      ".enemy",
      ".judgement",
      ".battle-preview",
      ".battle-actions",
      ".hand",
      "button:not(.node)",
      ".pill",
      ".tag",
      ".mini-card",
      ".shop-slot",
      ".pack-card",
      ".event-option",
    ];
    return selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      const overflowX = element.scrollWidth - element.clientWidth;
      const overflowY = element.scrollHeight - element.clientHeight;
      const verticalScrollAllowed = [".panel", ".layout", ".battle-stage", ".hand"].includes(selector);
      const complexButton = element.closest(".mini-card, .card, .node, .shop-slot, .pack-card, .judge-slot");
      const crushedButton = !complexButton && element.tagName === "BUTTON" && (element.textContent || "").trim().length >= 4 && rect.height > 58;
      return overflowX > 3 || (!verticalScrollAllowed && overflowY > 8) || crushedButton
        ? { selector, text: (element.textContent || "").trim().slice(0, 48), overflowX, overflowY }
        : null;
    }).filter(Boolean));
  });
  expect(issues, `${label} UI overflow issues: ${JSON.stringify(issues.slice(0, 8))}`).toEqual([]);
}

test("map and battle HUD fit the desktop viewport without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await startRun(page);

  await expectNoHorizontalOverflow(page);
  await expect(page.locator(".map-grid")).toBeVisible();
  await expect(page.locator(".node.available").first()).toHaveCSS("border-radius", "50%");
  await expect(page.locator(".map-link")).not.toHaveCount(0);
  await expect(page.locator(".node-fog-map")).not.toHaveCount(0);

  await page.locator("[data-node='L1C0R0']").click();
  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();

  await expectNoHorizontalOverflow(page);
  await expect(page.locator(".hero-panel")).toBeVisible();
  await expect(page.locator(".enemy").first()).toBeVisible();
  await expect(page.locator(".judge-slot")).toHaveCount(5);
  await expect(page.locator(".hand [data-card]")).toHaveCount(7);
});

test("core desktop surfaces keep controls readable without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expectSurfaceStable(page, "start");

  await startRun(page, "R1-2026-0526-UI01");
  await expectSurfaceStable(page, "map");

  await page.locator("[data-open-backpack]").first().click();
  await expect(page.getByRole("heading", { name: "大背包" })).toBeVisible();
  await expectSurfaceStable(page, "backpack");

  await page.locator("[data-map]").click();
  await forceFirstNode(page, "shop", { joker: 12 });
  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "商店" })).toBeVisible();
  await expectSurfaceStable(page, "shop");

  await page.locator("[data-continue]").click();
  await startRun(page, "R1-2026-0526-UI02");
  await forceFirstNode(page, "upgrade");
  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem("dream-poker-prototype-save"));
    for (const id of ["2-heart", "2-spade", "3-heart"]) data.run.backpack[id].count = 2;
    localStorage.setItem("dream-poker-prototype-save", JSON.stringify(data));
  });
  await loadSavedRun(page);
  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "制牌室" })).toBeVisible();
  await expectSurfaceStable(page, "upgrade");

  await startRun(page, "R1-5372-9200-2664");
  await enterNode(page, "[data-node='L1C0R0']");
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
  await expectSurfaceStable(page, "battle");
});

test("core game views adapt to common desktop browser widths", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 720, seed: "R1-2026-0601-1280" },
    { width: 1366, height: 768, seed: "R1-2026-0601-1366" },
    { width: 1440, height: 900, seed: "R1-2026-0601-1440" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await startRun(page, viewport.seed);
    await expectSurfaceStable(page, `map-${viewport.width}`);

    await page.locator("[data-open-backpack]").first().click();
    await expect(page.getByRole("heading", { name: "大背包" })).toBeVisible();
    await expectSurfaceStable(page, `backpack-${viewport.width}`);
    await page.locator("[data-map]").click();

    await forceFirstNode(page, "battle");
    await page.locator("[data-node='L1C0R0']").click();
    await page.locator("[data-confirm-node]").click();
    await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
    await expectSurfaceStable(page, `battle-${viewport.width}`);
  }
});

test("wide desktop view uses the available screen area", async ({ page }) => {
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 2048, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "梦境牌国：持牌人原型" })).toBeVisible();
    await expectSurfaceStable(page, `wide-start-${viewport.width}`);
    const metrics = await page.evaluate(() => {
      const app = document.querySelector(".app")?.getBoundingClientRect();
      const start = document.querySelector(".start-panel")?.getBoundingClientRect();
      return {
        appWidthRatio: app ? app.width / window.innerWidth : 0,
        startHeightRatio: start ? start.height / window.innerHeight : 0,
      };
    });
    expect(metrics.appWidthRatio).toBeGreaterThanOrEqual(0.8);
    expect(metrics.startHeightRatio).toBeGreaterThanOrEqual(0.7);

    await startRun(page, `R1-2026-0601-wide-${viewport.width}`);
    await expectSurfaceStable(page, `wide-map-${viewport.width}`);
    await forceFirstNode(page, "battle");
    await page.locator("[data-node='L1C0R0']").click();
    await page.locator("[data-confirm-node]").click();
    await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();
    await expectSurfaceStable(page, `wide-battle-${viewport.width}`);
  }
});

test("official art stays inside fixed UI frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await startRun(page, "R1-5372-9200-2664");

  await page.locator("[data-node='L1C0R0']").click();
  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();

  const battleFrames = await page.evaluate(() => {
    const selectors = [".hero-art-frame", ".enemy-art-frame", ".side-avatar-frame"];
    return selectors.map((selector) => {
      const frame = document.querySelector(selector);
      const image = frame?.querySelector("img");
      const frameBox = frame?.getBoundingClientRect();
      const imageBox = image?.getBoundingClientRect();
      return {
        selector,
        frameWidth: frameBox?.width || 0,
        frameHeight: frameBox?.height || 0,
        imageWidth: imageBox?.width || 0,
        imageHeight: imageBox?.height || 0,
      };
    });
  });

  for (const frame of battleFrames) {
    expect(frame.frameWidth).toBeGreaterThan(0);
    expect(frame.frameHeight).toBeGreaterThan(0);
    expect(frame.imageWidth).toBeGreaterThanOrEqual(frame.frameWidth - 4);
    expect(frame.imageHeight).toBeGreaterThanOrEqual(frame.frameHeight - 4);
    expect(frame.imageWidth).toBeLessThanOrEqual(frame.frameWidth);
    expect(frame.imageHeight).toBeLessThanOrEqual(frame.frameHeight);
  }

  await page.goto("/");
  await startRun(page, "R1-0000-0000-0000");
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();
  await page.locator("[data-node='L1C0R2']").click();
  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "商店" })).toBeVisible();
  await expect(page.locator(".scene-frame")).toHaveCount(1);
  await expect(page.locator(".relic-art-frame").first()).toBeVisible();
});

test("unit portraits do not overlap combat text rails", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await startRun(page, "R1-5343-0427-8042");
  await page.locator("[data-node='L1C0R0']").click();
  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "战斗" })).toBeVisible();

  const overlaps = await page.evaluate(() => {
    function rectOf(selector, root = document) {
      const element = root.querySelector(selector);
      return element?.getBoundingClientRect();
    }
    function intersects(a, b) {
      if (!a || !b) return false;
      const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return x * y > 2;
    }
    const issues = [];
    const heroArt = rectOf(".hero-art-frame");
    const heroContent = rectOf(".hero-content");
    if (intersects(heroArt, heroContent)) issues.push("hero-content");

    for (const enemy of document.querySelectorAll(".enemy")) {
      const art = rectOf(".enemy-art-frame", enemy);
      for (const selector of [".enemy-content", ".enemy-intent", ".enemy-trait"]) {
        if (intersects(art, rectOf(selector, enemy))) {
          issues.push(`${selector}:${enemy.textContent?.trim().slice(0, 20)}`);
        }
      }
    }

    const sideArt = rectOf(".side-avatar-frame");
    for (const element of document.querySelectorAll(".side-summary strong, .side-summary > span:not(.art-frame)")) {
      if (intersects(sideArt, element.getBoundingClientRect())) {
        issues.push(`side:${element.textContent?.trim()}`);
      }
    }
    return issues;
  });

  expect(overlaps).toEqual([]);
});

test("map route dashed lines align with visible node centers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await startRun(page, "R1-0000-0000-0000");
  await page.locator("[data-node='L1C0R2']").click();
  await page.locator("[data-confirm-node]").click();
  await expect(page.getByRole("heading", { name: "商店" })).toBeVisible();
  await page.locator("[data-continue]").click();
  await expect(page.getByRole("heading", { name: "第1层路线" })).toBeVisible();

  const result = await page.evaluate(() => {
    const svg = document.querySelector(".map-connections");
    const lines = [...document.querySelectorAll(".map-link")];
    const nodes = [...document.querySelectorAll(".node")];
    const svgBox = svg.getBoundingClientRect();
    const nodeCenters = new Map(nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return [node.dataset.node || node.dataset.hiddenNode, { x: box.left + box.width / 2, y: box.top + box.height / 2 }];
    }));
    const byColumn = new Map(nodes.map((node) => {
      const id = node.dataset.node || node.dataset.hiddenNode || "";
      return [id, id.match(/C(\d+)/)?.[1]];
    }));
    const samples = lines.map((line) => {
      const x1 = svgBox.left + Number(line.getAttribute("x1")) / 1000 * svgBox.width;
      const y1 = svgBox.top + Number(line.getAttribute("y1")) / 1000 * svgBox.height;
      const x2 = svgBox.left + Number(line.getAttribute("x2")) / 1000 * svgBox.width;
      const y2 = svgBox.top + Number(line.getAttribute("y2")) / 1000 * svgBox.height;
      const startCenter = nodeCenters.get(line.dataset.from);
      const endCenter = nodeCenters.get(line.dataset.to);
      const stroke = getComputedStyle(line).stroke;
      const width = Number.parseFloat(getComputedStyle(line).strokeWidth);
      return {
        startDistance: startCenter ? Math.hypot(startCenter.x - x1, startCenter.y - y1) : Number.POSITIVE_INFINITY,
        endDistance: endCenter ? Math.hypot(endCenter.x - x2, endCenter.y - y2) : Number.POSITIVE_INFINITY,
        stroke,
        width,
      };
    });
    return {
      lineCount: lines.length,
      nodeCount: nodes.length,
      visibleNodeCount: document.querySelectorAll("[data-node]").length,
      hiddenNodeCount: document.querySelectorAll("[data-hidden-node]").length,
      hasColumnBoxes: [...document.querySelectorAll(".map-col")].length,
      hasStepLabels: document.body.innerText.includes("第1步") || document.body.innerText.includes("第2步"),
      worstDistance: Math.max(...samples.map((sample) => Math.max(sample.startDistance, sample.endDistance))),
      allVisibleStroke: samples.every((sample) => sample.width >= 3 && !sample.stroke.includes("0, 0, 0, 0")),
      nodesHaveColumns: [...byColumn.values()].every(Boolean),
      parallelLinksAreYellow: [...document.querySelectorAll(".map-link.parallel")].every((line) => {
        const stroke = getComputedStyle(line).stroke;
        return stroke.includes("231") || stroke.includes("183") || stroke.includes("91");
      }),
      parallelLinksStayInSameColumn: [...document.querySelectorAll(".map-link.parallel")].every((line) => {
        const fromCol = line.dataset.from?.match(/C(\d+)/)?.[1];
        const toCol = line.dataset.to?.match(/C(\d+)/)?.[1];
        return fromCol && fromCol === toCol;
      }),
      parallelLinksAreAdjacentRoutes: [...document.querySelectorAll(".map-link.parallel")].every((line) => {
        const fromRow = Number(line.dataset.from?.match(/R(\d+)/)?.[1]);
        const toRow = Number(line.dataset.to?.match(/R(\d+)/)?.[1]);
        return Number.isFinite(fromRow) && Number.isFinite(toRow) && Math.abs(fromRow - toRow) === 1;
      }),
      activeNonParallelIsGrey: [...document.querySelectorAll(".map-link.active:not(.parallel)")].every((line) => {
        const stroke = getComputedStyle(line).stroke;
        return stroke.includes("212") || stroke.includes("202") || stroke.includes("187");
      }),
    };
  });

  expect(result.lineCount).toBeGreaterThan(0);
  expect(result.nodeCount).toBeGreaterThan(0);
  expect(result.visibleNodeCount).toBeGreaterThan(0);
  expect(result.hiddenNodeCount).toBeGreaterThan(0);
  expect(result.hasColumnBoxes).toBe(0);
  expect(result.hasStepLabels).toBe(false);
  expect(result.worstDistance).toBeLessThan(3);
  expect(result.allVisibleStroke).toBe(true);
  expect(result.nodesHaveColumns).toBe(true);
  expect(result.parallelLinksAreYellow).toBe(true);
  expect(result.parallelLinksStayInSameColumn).toBe(true);
  expect(result.parallelLinksAreAdjacentRoutes).toBe(true);
  expect(result.activeNonParallelIsGrey).toBe(true);
});
