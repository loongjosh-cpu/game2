import "./styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  BOSSES,
  ELITES,
  EVENTS,
  HAND_ORDER,
  MONSTERS,
  RANK_ORDER,
  RANK_VALUE,
  RANKS,
  RELICS,
  SUITS,
} from "./data.js";
import { BackpackView } from "./ui/backpack";
import { BattleView } from "./ui/battle";
import { CardChoiceView, RelicChoiceView } from "./ui/choices";
import { EventView } from "./ui/event";
import { MapView } from "./ui/map";
import { PackManagerView } from "./ui/packs";
import { RewardView } from "./ui/reward";
import { ShopView } from "./ui/shop";
import { SideView, TopbarView } from "./ui/shell";
import { UpgradeView } from "./ui/upgrade";

function createRng(seed) {
  let value = seed >>> 0;
  return {
    next() {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(list) {
      return list[this.int(0, list.length - 1)];
    },
    shuffle(list) {
      const copy = [...list];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = this.int(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    getState() {
      return value >>> 0;
    },
  };
}

function makeCard(rank, suit) {
  return {
    id: `${rank}-${suit.id}`,
    rank,
    suit: suit.id,
    suitLabel: suit.label,
    symbol: suit.symbol,
    color: suit.color,
  };
}

const ALL_CARDS = RANKS.flatMap((rank) => SUITS.map((suit) => makeCard(rank, suit)));
const cardById = Object.fromEntries(ALL_CARDS.map((card) => [card.id, card]));
const ASSET_BASE = import.meta.env.BASE_URL || "./";
const CORE_RELIC_ART = new Set([
  "gold-gourd", "silver-gourd", "heart-crown", "spade-crown", "diamond-crown", "club-crown",
  "heart-scepter", "spade-scepter", "diamond-scepter", "club-scepter", "ladder", "echo-shield",
  "five-color-stone", "side-route-map", "royal-coin", "red-knight-contract", "black-knight-contract",
  "dealer-chip", "cursed-contract", "throne-shard",
]);
const UNIT_ASSET_SLUGS = {
  "纸牌哨兵": "card-sentry",
  "三连剪影": "triple-shadow",
  "战鼓旗手": "war-drum-banner",
  "涂色守卫": "painted-guard",
  "红墨医师": "red-ink-medic",
  "重铠牌兵": "armored-card-soldier",
  "滞速纸偶": "slow-paper-doll",
  "护牌侍从": "card-guard-squire",
  "镜面甲虫": "mirror-beetle",
  "催牌小丑": "card-haste-jester",
  "吸墨影": "ink-draining-shadow",
  "清场管家": "sweeping-butler",
  "封套术士": "envelope-warlock",
  "纸牌幼体": "card-hatchling",
  "双面审查官": "two-faced-auditor",
  "生命档案员": "life-archivist",
  "迟滞档案员": "delay-archivist",
  "加冕骑士": "coronation-knight",
  "裂段主教": "split-section-bishop",
  "回声铁箱": "echo-iron-chest",
  "快手庄家": "fast-dealer",
  "召牌主教": "card-summon-bishop",
  "印章吞食者": "seal-devourer",
  "铁壁守卫": "iron-wall-warden",
  "迅捷术士": "swift-caster",
  "召唤母体": "summoning-matron",
  "赌局审判者": "wager-judge",
  "王冠吞噬者": "crown-devourer",
  "终局庄家": "final-dealer",
};

const OFFICIAL_UNIT_ART = new Set([
  "card-sentry",
  "triple-shadow",
  "war-drum-banner",
  "painted-guard",
  "red-ink-medic",
  "armored-card-soldier",
  "slow-paper-doll",
  "card-guard-squire",
  "mirror-beetle",
  "card-haste-jester",
  "ink-draining-shadow",
  "sweeping-butler",
  "envelope-warlock",
  "card-hatchling",
  "fast-dealer",
  "echo-iron-chest",
  "two-faced-auditor",
  "life-archivist",
  "seal-devourer",
  "card-summon-bishop",
  "delay-archivist",
  "coronation-knight",
  "split-section-bishop",
  "iron-wall-warden",
  "swift-caster",
  "summoning-matron",
  "wager-judge",
  "crown-devourer",
  "final-dealer",
]);
const OFFICIAL_RELIC_ART = new Set([
  "gold-gourd",
  "silver-gourd",
  "heart-crown",
  "spade-crown",
  "diamond-crown",
  "club-crown",
  "heart-scepter",
  "spade-scepter",
  "diamond-scepter",
  "club-scepter",
  "a-power",
  "armor-piercer",
  "throne-shard",
  "wild-card",
  "blank-contract",
  "side-card-holder",
  "pack-knife",
  "joker-ledger",
  "rattan-armor",
  "shield-spring",
  "black-shield",
  "compass",
  "old-deal-box",
  "shuffle-gloves",
  "double-blades",
  "sword-in-stone",
  "sage-heart",
  "spartan-boots",
  "angel-kiss",
  "bloodthirsty-saber",
  "broken-beast-bone",
  "knight-lance",
  "clearance-doc",
  "legendary-banknote",
  "curse-doll",
  "cloud-ladder",
  "yin-yang-charm",
  "knight-sword",
  "twins-photo",
  "burning-candle",
  "balloon",
  "knight-dagger",
  "angel-wings",
  "paper-money",
  "umbrella",
  "knight-medal",
  "phonograph",
  "flashlight",
  "scissors",
  "small-mirror",
  "crayon",
  "paper-cup",
  "clock",
  "broken-red-thread",
  "obsidian-seal",
  "diamond-gear",
  "club-seal",
  "worn-backpack",
  "tactical-hourglass",
  "silencing-dagger",
  "judgement-frame",
  "table-trapdoor",
  "tail-rope",
  "ladder",
  "red-knight-contract",
  "black-knight-contract",
  "five-color-stone",
  "royal-coin",
  "dealer-chip",
  "side-route-map",
  "echo-shield",
  "cursed-contract",
]);
const OFFICIAL_SCENE_ART = new Set(["event-table", "shop-counter", "upgrade-room"]);
const OFFICIAL_PACK_ART = new Set(["pack-tier-1", "pack-tier-2", "pack-tier-3", "pack-tier-4", "pack-tier-5", "pack-reward"]);
const OFFICIAL_BACKGROUND_ART = new Set([
  "battle-common",
  "battle-boss",
  "layer-1-rabbit-hole",
  "layer-2-tea-table",
  "layer-3-heart-garden",
  "layer-4-mirror-board",
  "layer-5-trial-court",
]);

function assetPath(path) {
  const base = ASSET_BASE.endsWith("/") ? ASSET_BASE : `${ASSET_BASE}/`;
  return `${base}${path}`;
}

function unitAsset(unit) {
  const slug = UNIT_ASSET_SLUGS[unit?.name];
  if (!slug) return assetPath("assets/enemies/card-sentry.svg");
  const ext = OFFICIAL_UNIT_ART.has(slug) ? "png" : "svg";
  return assetPath(`${unit.boss ? "assets/bosses" : "assets/enemies"}/${slug}.${ext}`);
}

function sceneAsset(slug) {
  return assetPath(`assets/scenes/${slug}.${OFFICIAL_SCENE_ART.has(slug) ? "png" : "svg"}`);
}

function backgroundAsset(slug) {
  return assetPath(`assets/backgrounds/${slug}.${OFFICIAL_BACKGROUND_ART.has(slug) ? "png" : "svg"}`);
}

const state = {
  screen: "map",
  seed: makeSeedString(),
  rng: null,
  log: [],
  selected: [],
  run: null,
  battle: null,
  reward: null,
  event: null,
  pendingRelicChoice: null,
  labResult: null,
  modal: null,
};

let legacyMountTarget = null;
let backpackViewRoot = null;
let battleViewRoot = null;
let cardChoiceViewRoot = null;
let eventViewRoot = null;
let mapViewRoot = null;
let packManagerViewRoot = null;
let rewardViewRoot = null;
let relicChoiceViewRoot = null;
let sideViewRoot = null;
let shopViewRoot = null;
let topbarViewRoot = null;
let upgradeViewRoot = null;

const SAVE_KEY = "dream-poker-prototype-save";

function log(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 80);
}

function openGuide() {
  state.modal = { type: "guide" };
  render();
}

function saveAndRender() {
  saveRun();
  log("已保存到本地浏览器。");
  render();
}

function ceil(value) {
  return Math.ceil(Number(value.toFixed(1)));
}

function makeSeedString() {
  const bytes = new Uint16Array(3);
  crypto.getRandomValues(bytes);
  const parts = Array.from(bytes, (value) => String(value % 10000).padStart(4, "0"));
  return `R1-${parts.join("-")}`;
}

function normalizeSeed(seed) {
  const text = String(seed || "").trim().toUpperCase();
  return text || makeSeedString();
}

function hashSeed(seedText) {
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function newRun(seed = state.seed) {
  const seedText = normalizeSeed(seed);
  const seedValue = hashSeed(seedText);
  const rng = createRng(seedValue);
  state.seed = seedText;
  state.rng = rng;
  const backpack = {};
  for (const card of ALL_CARDS) backpack[card.id] = { count: 1, level: 1 };
  const album = chooseDefaultAlbum();
  state.run = {
    seed: seedText,
    seedValue,
    rngState: seedValue,
    nextId: 1,
    layer: 1,
    nodeCount: 1,
    map: generateLayerMap(rng, 1),
    currentCol: -1,
    currentNodeId: null,
    completedNodes: new Set(),
    backpack,
    album,
    unopenedPacks: [],
    relics: [],
    joker: 0,
    freeTraverse: 0,
    scoutSteps: 0,
    upgradeCount: 0,
    hero: {
      maxHp: 20,
      hp: 20,
      attack: 1,
      defense: 5,
      speed: 3,
      level: 1,
      exp: 0,
      baseFocus: 2,
      tempShieldNextBattle: 0,
    },
  };
  state.run.rngState = rng.getState();
  state.screen = "map";
  state.battle = null;
  state.reward = null;
  state.event = null;
  state.pendingChoice = null;
  state.pendingRelicChoice = null;
  state.selected = [];
  state.log = [];
  log(`梦境牌局开始，seed=${seedText}`);
  saveRun();
  render();
}

function serializeRun() {
  if (!state.run) return null;
  return {
    ...state.run,
    rngState: state.rng?.getState?.() ?? state.run.rngState,
    completedNodes: Array.from(state.run.completedNodes),
  };
}

function saveRun() {
  if (!state.run) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ run: serializeRun(), log: state.log }));
}

function loadRun() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    restoreRunSnapshot(data, "已读取本地存档。");
    return true;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

function restoreRunSnapshot(data, message = "已导入存档。") {
  if (!data?.run) throw new Error("missing run");
  state.run = {
    ...data.run,
    completedNodes: new Set(data.run.completedNodes || []),
  };
  state.seed = state.run.seed;
  state.rng = createRng(state.run.rngState ?? state.run.seedValue);
  state.log = data.log || [];
  state.selected = [];
  state.battle = null;
    state.reward = null;
    state.event = null;
    state.pendingChoice = null;
    state.pendingRelicChoice = null;
    state.screen = "map";
  log(message);
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  state.run = null;
  state.battle = null;
  state.reward = null;
  state.event = null;
  state.pendingRelicChoice = null;
  state.selected = [];
  state.screen = "map";
  render();
}

function chooseDefaultAlbum() {
  const ranks = ["A", "K", "Q", "J", "10", "9", "8"];
  const picked = [];
  for (const rank of ranks) {
    for (const suit of SUITS) {
      if (picked.length < 26) picked.push(`${rank}-${suit.id}`);
    }
  }
  return picked.slice(0, 26);
}

function generateLayerMap(rng, layer) {
  const cols = Array.from({ length: 5 }, (_, col) => {
    const count = col === 4 ? (layer === 3 || layer === 5 ? 1 : 2) : rng.int(2, 3);
    return Array.from({ length: count }, (_, row) => ({
      id: `L${layer}C${col}R${row}`,
      layer,
      col,
      row,
      type: pickNodeType(rng, layer, col),
      done: false,
      links: [],
    }));
  });
  if (layer === 3 || layer === 5) cols[4][0].type = "boss";
  ensureCombatMajority(cols, rng);
  ensureType(cols, "upgrade", rng);
  if (layer === 2 || layer === 5) ensureType(cols, "shop", rng);
  generateMapLinks(cols, rng);
  return { layer, cols };
}

function generateMapLinks(cols, rng) {
  const parallelCandidates = [];
  for (const col of cols) {
    for (let row = 0; row < col.length - 1; row++) {
      const from = col[row];
      const to = col[row + 1];
      parallelCandidates.push([from, to]);
      if (rng.next() < 0.3) addParallelLinkPair(from, to);
    }
  }
  if (!cols.flat().some((node) => node.links.some((link) => link.parallel)) && parallelCandidates.length) {
    addParallelLinkPair(...rng.pick(parallelCandidates));
  }
  for (let col = 0; col < cols.length - 1; col++) {
    const current = cols[col];
    const next = cols[col + 1];
    for (const node of current) {
      const sameRow = next[Math.min(node.row, next.length - 1)];
      addNodeLink(node, sameRow, false);
    }
    for (const nextNode of next) {
      const hasInbound = current.some((node) => node.links.some((link) => link.to === nextNode.id && !link.parallel));
      if (!hasInbound) {
        const source = current.reduce((best, node) => Math.abs(node.row - nextNode.row) < Math.abs(best.row - nextNode.row) ? node : best, current[0]);
        addNodeLink(source, nextNode, false);
      }
    }
  }
}

function addParallelLinkPair(a, b) {
  addNodeLink(a, b, true);
  addNodeLink(b, a, true);
}

function addNodeLink(from, to, parallel = from.col === to.col) {
  if (!from || !to || from.links.some((link) => link.to === to.id)) return;
  from.links.push({ to: to.id, parallel });
}

function pickNodeType(rng, layer, col) {
  if (col === 4 && (layer === 3 || layer === 5)) return "boss";
  const roll = rng.int(1, 100);
  if (roll <= 45) return "battle";
  if (roll <= 60) return "elite";
  if (roll <= 70) return "relic";
  if (roll <= 80) return "shop";
  if (roll <= 90) return "upgrade";
  if (layer === 1) return "battle";
  return "event";
}

function ensureType(cols, type, rng) {
  const candidates = cols.slice(1, 4).flat();
  rng.pick(candidates).type = type;
}

function ensureCombatMajority(cols, rng) {
  const nodes = cols.flat();
  while (nodes.filter(isCombatNode).length <= nodes.length / 2) {
    const candidates = nodes.filter((n) => !isCombatNode(n));
    if (!candidates.length) break;
    rng.pick(candidates).type = "battle";
  }
}

function isCombatNode(node) {
  return ["battle", "elite", "boss"].includes(node.type);
}

function availableNodes() {
  const { map, currentCol } = state.run;
  const nextCol = currentCol + 1;
  if (nextCol >= map.cols.length) return [];
  if (currentCol < 0) return map.cols[nextCol];
  const current = currentMapNode();
  if (!current?.links?.length) return map.cols[nextCol];
  const linked = new Set(current.links.map((link) => link.to));
  return map.cols.flat().filter((node) => linked.has(node.id) && !node.done);
}

function currentMapNode() {
  const run = state.run;
  if (!run || run.currentCol < 0) return null;
  const nodes = run.map.cols[run.currentCol] || [];
  return nodes.find((node) => node.id === run.currentNodeId) || [...nodes].reverse().find((node) => node.done) || null;
}

function enterNode(nodeId, parallelPacks = null) {
  state.modal = null;
  const node = state.run.map.cols.flat().find((n) => n.id === nodeId);
  if (!node) return;
  if (!availableNodes().some((n) => n.id === node.id)) return;
  if ((node.type === "battle" || node.type === "elite" || node.type === "boss") && state.run.album.length !== 26) {
    log("卡册必须正好装入26种牌才能进入战斗。");
    render();
    return;
  }
  if ((node.type === "battle" || node.type === "elite" || node.type === "boss") && !isAlbumPlayable()) {
    log("卡册中存在已耗尽的牌，请先调整卡册。");
    render();
    return;
  }
  if (!payTraverseCost(node, parallelPacks)) {
    render();
    return;
  }
  state.run.currentCol = node.col;
  state.run.currentNodeId = node.id;
  node.done = true;
  state.run.completedNodes.add(node.id);
  state.run.nodeCount += 1;
  if (node.type === "battle" || node.type === "elite" || node.type === "boss") startBattle(node.type);
  if (node.type === "relic") gainRelic();
  if (node.type === "shop") openShop();
  if (node.type === "upgrade") openUpgrade();
  if (node.type === "event") openEvent();
  render();
}

function openNodeModal(nodeId) {
  const node = state.run.map.cols.flat().find((n) => n.id === nodeId);
  if (!node || !availableNodes().some((item) => item.id === node.id)) return;
  state.modal = { type: "node", nodeId, parallelPacks: {} };
  render();
}

function confirmNodeModal() {
  const nodeId = state.modal?.nodeId;
  if (!nodeId) return;
  enterNode(nodeId, state.modal?.parallelPacks);
}

function isAlbumPlayable() {
  return state.run.album.every((id) => (state.run.backpack[id]?.count || 0) > 0);
}

function payTraverseCost(node, parallelPacks = null) {
  const run = state.run;
  const isFirstColumn = run.currentCol < 0;
  if (isFirstColumn) return true;
  const currentNode = currentMapNode();
  const link = currentNode?.links?.find((item) => item.to === node.id);
  if (!link?.parallel) return true;
  run.sideRouteUsedLayers ||= [];
  if (hasRelic("side-route-map") && !run.sideRouteUsedLayers.includes(run.layer)) {
    run.sideRouteUsedLayers.push(run.layer);
    log("侧路地图：本层首次并行穿行不消耗卡包。");
    return true;
  }
  if (run.freeTraverse > 0) {
    run.freeTraverse -= 1;
    log("使用免费并行穿行。");
    return true;
  }
  if (run.unopenedPacks.length < 2) {
    log("并行穿行需要消耗2个未开卡包，当前不足。");
    return false;
  }
  const selection = normalizeParallelPackSelection(parallelPacks);
  if (parallelPackSelectionTotal(selection) !== 2) {
    log("请选择要消耗的2个未开卡包。");
    return false;
  }
  const spent = spendSelectedParallelPacks(selection);
  if (spent.length !== 2) {
    log("选择的卡包数量不足，请重新选择。");
    return false;
  }
  log(`并行穿行消耗 ${spent.map((pack) => packLabel(pack.quality)).join("、")}。`);
  return true;
}

function normalizeParallelPackSelection(selection = {}) {
  return Object.fromEntries(
    Object.entries(selection || {})
      .map(([quality, count]) => [String(quality), Math.max(0, Number(count) || 0)])
      .filter(([, count]) => count > 0)
  );
}

function parallelPackSelectionTotal(selection = {}) {
  return Object.values(selection || {}).reduce((sum, count) => sum + (Number(count) || 0), 0);
}

function groupedUnopenedPacks() {
  const groups = new Map();
  for (const pack of state.run.unopenedPacks) {
    const key = String(pack.quality);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(pack);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([quality, packs]) => ({ quality, packs }));
}

function spendSelectedParallelPacks(selection = {}) {
  const spent = [];
  for (const [quality, count] of Object.entries(selection)) {
    let remaining = count;
    for (let i = state.run.unopenedPacks.length - 1; i >= 0 && remaining > 0; i--) {
      if (String(state.run.unopenedPacks[i].quality) !== String(quality)) continue;
      spent.push(state.run.unopenedPacks.splice(i, 1)[0]);
      remaining -= 1;
    }
  }
  return spent;
}

function finishNonCombat() {
  const node = currentMapNode();
  if (node && !isCombatNode(node) && hasRelic("sage-heart")) gainPack("reward");
  if (hasRelic("angel-kiss")) state.run.hero.hp = Math.min(state.run.hero.maxHp, state.run.hero.hp + 2);
  if (state.run.currentCol >= 4) advanceLayer();
  else state.screen = "map";
  state.event = null;
  render();
}

function advanceLayer() {
  if (state.run.layer >= 5) {
    state.screen = "victory";
    log("你击败了第5层Boss，通关。");
    return;
  }
  state.run.layer += 1;
  if (hasRelic("clock")) state.run.joker += 3;
  state.run.map = generateLayerMap(state.rng, state.run.layer);
  state.run.currentCol = -1;
  state.run.currentNodeId = null;
  state.screen = "map";
  log(`进入第 ${state.run.layer} 层。`);
}

function startBattle(type, options = {}) {
  const run = state.run;
  const enemies = makeEnemies(type, options);
  const draw = state.rng.shuffle(run.album.map((id, index) => ({ ...cardById[id], uid: `${id}-${index}` })));
  const hand = draw.splice(0, 7);
  state.battle = {
    type,
    turn: 1,
    draw,
    hand,
    discard: [],
    enemies,
    targetId: enemies[0]?.id || null,
    shield: run.hero.tempShieldNextBattle || 0,
    focus: getBattleFocus(),
    extraConsume: 1 + (hasRelic("blank-contract") ? 1 : 0),
    aPower: 0,
    charge: 0,
    freeRerolls: 0,
    freeRerollThisTurn: false,
    freeRerollNextTurnPending: false,
    freeTempConsume: 0,
    diamondCrownTriggers: 0,
    royalCoinStraightCount: 0,
    royalCoinTriggers: 0,
    firstShieldCharge: run.hero.tempFirstShieldChargeNextBattle || 0,
    firstShieldChargeUsed: false,
    heroStatuses: [],
    specialRewards: options.specialRewards || [],
    ended: false,
  };
  run.hero.tempFirstShieldChargeNextBattle = 0;
  if (type === "elite" || type === "boss") {
    state.battle.shield += run.hero.tempEliteBossShield || 0;
    run.hero.tempEliteBossShield = 0;
  }
  if (type === "boss") {
    state.battle.shield += run.hero.tempBossShield || 0;
    run.hero.tempBossShield = 0;
  }
  state.battle.focus += run.hero.tempFocusNextBattle || 0;
  state.battle.extraConsume += run.hero.tempExtraConsumeNextBattle || 0;
  if (type === "boss") state.battle.extraConsume += run.hero.tempBossExtraConsume || 0;
  run.hero.tempFocusNextBattle = 0;
  run.hero.tempExtraConsumeNextBattle = 0;
  if (type === "boss") run.hero.tempBossExtraConsume = 0;
  applySpecialBattleRules(options.rules || []);
  applyQueuedBattleEffects(type);
  if (hasRelic("knight-sword")) addStatus("hero", { id: "knight-sword-speed", name: "骑士长剑", kind: "buff", stat: "speed", value: 10, remaining: 1, clearable: true });
  applyRelicHooks("battleStart");
  run.hero.tempShieldNextBattle = 0;
  state.selected = [];
  state.screen = "battle";
  log(`遭遇${nodeTypeLabel(type)}。`);
  beginPlayerTurn();
  if (state.run.hero.hp <= 0) {
    state.screen = "defeat";
    log("生命归零，本局结束。");
  }
}

function applyQueuedBattleEffects(type) {
  const run = state.run;
  if (run.nextBattleDebuff) {
    run.nextBattleDebuff = false;
    const debuffs = [
      { id: "event-weaken", name: "事件虚弱", kind: "debuff", stat: "damageDealt", value: -0.1, remaining: 1, clearable: true },
      { id: "event-vulnerable", name: "事件易伤", kind: "debuff", stat: "damageTaken", value: 0.1, remaining: 1, clearable: true },
      { id: "event-slow", name: "事件缓速", kind: "debuff", stat: "speed", value: -1, remaining: 1, clearable: true },
    ];
    addStatus("hero", state.rng.pick(debuffs));
  }
  if (run.nextBattleRandomDebuffs) {
    const debuffs = [
      { id: "fate-weaken", name: "命运虚弱", kind: "debuff", stat: "damageDealt", value: -0.1, remaining: 1, clearable: true },
      { id: "fate-vulnerable", name: "命运易伤", kind: "debuff", stat: "damageTaken", value: 0.1, remaining: 1, clearable: true },
      { id: "fate-slow", name: "命运缓速", kind: "debuff", stat: "speed", value: -1, remaining: 1, clearable: true },
    ];
    for (let i = 0; i < run.nextBattleRandomDebuffs; i++) addStatus("hero", state.rng.pick(debuffs));
    run.nextBattleRandomDebuffs = 0;
  }
  if (run.nextBattleVulnerable) {
    const effect = typeof run.nextBattleVulnerable === "number" ? { amount: run.nextBattleVulnerable, duration: Infinity } : run.nextBattleVulnerable;
    addStatus("hero", { id: "event-evidence", name: "篡改证物", kind: "debuff", stat: "damageTaken", value: effect.amount, remaining: effect.duration, clearable: true });
    run.nextBattleVulnerable = null;
  }
  if (run.nextBattleEnemySpeed) {
    for (const enemy of state.battle.enemies) enemy.speed += run.nextBattleEnemySpeed;
    run.nextBattleEnemySpeed = 0;
  }
  if (run.nextBattleEnemyShield) {
    for (const enemy of state.battle.enemies) enemy.shield += run.nextBattleEnemyShield;
    run.nextBattleEnemyShield = 0;
  }
  if (run.nextBattleEnemyAttackMultiplier) {
    for (const enemy of state.battle.enemies) addStatus(enemy, { id: "fate-enemy-attack", name: "命运牌局", kind: "buff", stat: "attackMultiplier", value: run.nextBattleEnemyAttackMultiplier, remaining: Infinity, clearable: true });
    run.nextBattleEnemyAttackMultiplier = 0;
  }
  if (type === "boss" && run.nextBossEnemySpeed) {
    for (const enemy of state.battle.enemies) enemy.speed += run.nextBossEnemySpeed;
    run.nextBossEnemySpeed = 0;
  }
  if (type === "boss" && run.nextBossEnemySpeedStatus) {
    for (const enemy of state.battle.enemies) addStatus(enemy, { id: "last-tea-slow", name: "最后一杯茶", kind: "debuff", stat: "speed", value: run.nextBossEnemySpeedStatus.amount, remaining: run.nextBossEnemySpeedStatus.duration, clearable: true });
    run.nextBossEnemySpeedStatus = null;
  }
  if (type === "boss" && run.nextBossEnemyDefenseMultiplier) {
    for (const enemy of state.battle.enemies) addStatus(enemy, { id: "evidence-defense", name: "提交证物", kind: "debuff", stat: "defenseMultiplier", value: run.nextBossEnemyDefenseMultiplier.amount, remaining: run.nextBossEnemyDefenseMultiplier.duration, clearable: true, stackable: true });
    run.nextBossEnemyDefenseMultiplier = null;
  }
  if (type === "boss" && run.nextBossDamageDealt) {
    addStatus("hero", { id: "pardon-order-damage", name: "牌国赦令", kind: "buff", stat: "damageDealt", value: run.nextBossDamageDealt.amount, remaining: run.nextBossDamageDealt.duration, clearable: true });
    run.nextBossDamageDealt = null;
  }
}

function getBattleFocus() {
  let focus = state.run.hero.baseFocus;
  if (hasRelic("compass")) focus += 1;
  return focus;
}

function makeEnemies(type, options = {}) {
  const rng = state.rng;
  if (options.enemies?.length) {
    return options.enemies.map((name) => spawnEnemy(findEnemyTemplate(name), layerScale(), true));
  }
  if (type === "boss") {
    const template = rng.pick(BOSSES[state.run.layer]);
    return [spawnEnemy(template, 1, true, true)];
  }
  if (type === "elite") return [spawnEnemy(rng.pick(ELITES), layerScale(), true)];
  const count = rng.int(1, 2);
  return Array.from({ length: count }, () => spawnEnemy(rng.pick(MONSTERS), layerScale(), false));
}

function findEnemyTemplate(name) {
  const templates = [...MONSTERS, ...ELITES, ...Object.values(BOSSES).flat()];
  return templates.find((template) => template.name === name) || MONSTERS[0];
}

function applySpecialBattleRules(rules) {
  for (const rule of rules) {
    if (rule.type === "enemySpeed") {
      for (const enemy of state.battle.enemies) enemy.speed += rule.amount;
    }
    if (rule.type === "enemyAttackMultiplier") {
      for (const enemy of state.battle.enemies) {
        const gain = ceil(enemy.attack * rule.amount);
        enemy.attack += gain;
        enemy.baseAttack += gain;
      }
    }
    if (rule.type === "enemyDefenseMultiplier") {
      for (const enemy of state.battle.enemies) {
        const gain = ceil(enemy.defense * rule.amount);
        enemy.defense += gain;
        enemy.baseDefense += gain;
      }
    }
    if (rule.type === "enemyMaxHpMultiplier") {
      for (const enemy of state.battle.enemies) {
        const gain = ceil(enemy.maxHp * rule.amount);
        enemy.maxHp += gain;
        enemy.hp += gain;
      }
    }
    if (rule.type === "heroVulnerable") {
      addStatus("hero", { id: `special-${rule.name || "vulnerable"}`, name: rule.name || "特殊战斗", kind: "debuff", stat: "damageTaken", value: rule.amount, remaining: rule.duration || 2, clearable: true });
    }
  }
}

function layerScale() {
  return state.run.layer + state.run.nodeCount / 10;
}

function makeRunId(prefix) {
  const id = `${prefix}-${String(state.run.nextId).padStart(5, "0")}`;
  state.run.nextId += 1;
  return id;
}

function spawnEnemy(template, scale = 1, elite = false, boss = false) {
  const hp = ceil(state.rng.int(template.hp[0], template.hp[1]) * scale);
  const atk = ceil(state.rng.int(template.atk[0], template.atk[1]) * scale);
  const def = ceil(state.rng.int(template.def[0], template.def[1]) * scale);
  return {
    ...template,
    id: makeRunId("enemy"),
    elite,
    boss,
    baseAttack: atk,
    baseDefense: def,
    maxHp: hp,
    hp,
    attack: atk,
    defense: def,
    speed: template.speed,
    baseSpeed: template.speed,
    shield: 0,
    silenced: false,
    statuses: [],
    acted: false,
    defenseDown: 0,
    attackUp: 0,
    intent: null,
  };
}

function rollEnemyIntents() {
  for (const enemy of liveEnemies()) {
    if (isSilenced(enemy)) enemy.intent = { type: "skip", text: "沉默，无法行动" };
    else enemy.intent = chooseEnemyIntent(enemy);
  }
}

function liveEnemies() {
  return state.battle.enemies.filter((e) => e.hp > 0);
}

function beginPlayerTurn() {
  const battle = state.battle;
  battle.diamondCrownUsedThisTurn = false;
  battle.freeRerollThisTurn = Boolean(battle.freeRerollNextTurnPending);
  battle.freeRerollNextTurnPending = false;
  if (battle.umbrellaShieldNext) {
    addHeroShield(battle.umbrellaShieldNext);
    battle.umbrellaShieldNext = 0;
  }
  if (battle.smallMirrorShieldRemove) {
    battle.shield = Math.max(0, battle.shield - battle.smallMirrorShieldRemove);
    battle.smallMirrorShieldRemove = 0;
  }
  activatePendingStatuses("hero");
  for (const enemy of liveEnemies()) {
    tickEnemyCooldowns(enemy);
    enemy.acted = false;
    activatePendingStatuses(enemy);
  }
  applyEnemyRoundStartTraits();
  rollEnemyIntents();
}

function endRoundStatuses() {
  applyEnemyRoundEndTraits();
  tickStatuses("hero");
  for (const enemy of liveEnemies()) tickStatuses(enemy);
}

function activatePendingStatuses(target) {
  const list = getStatusList(target);
  for (const status of list) {
    if (status.pending) status.pending = false;
  }
}

function tickStatuses(target) {
  const list = getStatusList(target);
  for (const status of list) {
    if (!status.pending && Number.isFinite(status.remaining)) status.remaining -= 1;
  }
  setStatusList(target, list.filter((status) => status.pending || !Number.isFinite(status.remaining) || status.remaining > 0));
}

function getStatusList(target) {
  if (target === "hero") return state.battle?.heroStatuses || [];
  return target.statuses || [];
}

function setStatusList(target, list) {
  if (target === "hero") state.battle.heroStatuses = list;
  else target.statuses = list;
}

function addStatus(target, status) {
  if (target !== "hero" && target.boss && state.run.layer === 5 && status.id === "silence" && hasStatus(target, "silence-immune")) return;
  if (target !== "hero" && status.id === "silence" && target.acted && hasRelic("silencing-dagger")) {
    addStatus(target, { id: "silencing-dagger-attack", name: "消音匕首", kind: "debuff", stat: "attackMultiplier", value: -0.2, remaining: 1, pending: true, clearable: true });
    return;
  }
  const list = getStatusList(target);
  const existing = list.find((item) => item.id === status.id && item.stackable !== true);
  const next = {
    kind: "debuff",
    stacks: 1,
    remaining: 1,
    pending: false,
    clearable: true,
    ...status,
  };
  if (existing) {
    existing.stacks = Math.max(existing.stacks || 1, next.stacks || 1);
    existing.remaining = Math.max(existing.remaining ?? 1, next.remaining ?? 1);
    existing.pending = existing.pending && next.pending;
    applyEnemyDebuffTraits(target, next);
    return;
  }
  list.push(next);
  applyEnemyDebuffTraits(target, next);
}

function tickEnemyCooldowns(enemy) {
  if (!enemy.cooldowns) return;
  for (const key of Object.keys(enemy.cooldowns)) {
    enemy.cooldowns[key] = Math.max(0, enemy.cooldowns[key] - 1);
  }
}

function enemyTraits(enemy, type) {
  return (enemy.traits || []).filter((trait) => trait.type === type);
}

function firstEnemyTrait(enemy, type) {
  return enemyTraits(enemy, type)[0] || null;
}

function applyEnemyRoundStartTraits() {
  for (const enemy of liveEnemies()) {
    for (const trait of enemy.traits || []) {
      if (trait.type === "roundStartShieldByDefense") enemy.shield += ceil(enemy.defense * (trait.ratio || 0));
      if (trait.type === "roundStartHeroAttackDown") {
        addStatus("hero", { id: `${enemy.id}-attack-down`, name: enemy.name, kind: "debuff", stat: "attack", value: -trait.amount, remaining: 1, clearable: true });
      }
      if (trait.type === "roundStartShieldIfDebuffed" && getStatusList(enemy).some((status) => status.kind === "debuff" && status.clearable !== false)) {
        enemy.shield += ceil(enemy.attack * (trait.ratio || 0.5));
      }
      if (trait.type === "devourHeroBuffStart" && clearRandomStatus("hero", "buff")) {
        addStatus(enemy, { id: `${enemy.id}-devour`, name: "吞噬增益", kind: "buff", stat: "attackMultiplier", value: 0.2, remaining: 1, clearable: true });
      }
      if (trait.type === "shuffleRound" && state.battle.turn % 3 === 0) {
        state.battle.rerollTaxNext = (state.battle.rerollTaxNext || 0) + 1;
        log(`${enemy.name}：本回合首次调度费用+1。`);
      }
    }
  }
}

function applyEnemyRoundEndTraits() {
  for (const enemy of liveEnemies()) {
    for (const trait of enemy.traits || []) {
      if (trait.type === "roundEndAttack") enemy.attack += trait.amount || 1;
      if (trait.type === "roundEndHeal") enemy.hp = Math.min(enemy.maxHp, enemy.hp + ceil(enemy.maxHp * (trait.ratio || 0)));
      if (trait.type === "roundEndTeamDefenseByAttack") {
        for (const ally of liveEnemies()) ally.defense += enemy.attack;
      }
    }
  }
}

function applyEnemyDebuffTraits(target, status) {
  if (target === "hero" || !target || status.kind !== "debuff" || status.pending) return;
  for (const trait of enemyTraits(target, "shieldOnDebuff")) {
    target.shield += ceil(target.defense * (trait.ratio || 0.2));
  }
}

function clearRandomStatus(target, kind = "debuff") {
  const list = getStatusList(target);
  const candidates = list.filter((status) => status.kind === kind && status.clearable !== false);
  if (!candidates.length) return false;
  const picked = state.rng.pick(candidates);
  if ((picked.stacks || 1) > 1) picked.stacks -= 1;
  else setStatusList(target, list.filter((status) => status !== picked));
  return true;
}

function hasStatus(target, id) {
  return getStatusList(target).some((status) => status.id === id && !status.pending);
}

function removeStatusById(target, id) {
  setStatusList(target, getStatusList(target).filter((status) => status.id !== id));
}

function isSilenced(enemy) {
  return enemy.silenced || hasStatus(enemy, "silence");
}

function effectiveSpeed(unit) {
  const base = unit === "hero" ? state.run.hero.speed : unit.speed;
  const delta = getStatusList(unit).reduce((sum, status) => {
    if (status.pending || status.stat !== "speed") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
  return Math.max(1, base + delta);
}

function chooseEnemyIntent(enemy) {
  const skills = enemy.skills || [{ type: "attack" }];
  const scored = skills
    .map((skill) => ({ skill, score: scoreEnemySkill(skill, enemy), tie: state.rng.next() }))
    .filter((item) => item.score > -Infinity)
    .sort((a, b) => b.score - a.score || b.tie - a.tie);
  return describeIntent(scored[0]?.skill || skills[0], enemy);
}

function scoreEnemySkill(skill, enemy) {
  if (skill.cooldown && (enemy.cooldowns?.[skill.type] || 0) > 0) return -Infinity;
  const allies = liveEnemies();
  const anyAllyBelow50 = allies.some((ally) => ally.hp / ally.maxHp < 0.5);
  const anyAllyBelow25 = allies.some((ally) => ally.hp / ally.maxHp < 0.25);
  const selfBelow50 = enemy.hp / enemy.maxHp < 0.5;
  const selfBelow30 = enemy.hp / enemy.maxHp < 0.3;
  const enemyHasDebuff = getStatusList(enemy).some((status) => status.kind === "debuff" && status.clearable !== false);
  const heroHasBuff = getStatusList("hero").some((status) => status.kind === "buff" && status.clearable !== false);
  const heroShield = state.battle.shield;
  switch (skill.type) {
    case "multiAttack": return 55 + (heroShield <= 0 ? 5 : 0);
    case "attackSlow":
    case "attackWeakenDefenseByAttack":
    case "attackCleanseHeroBuff": return 55;
    case "chargedAttack":
    case "defenseAttack":
    case "hpScaledAttack":
    case "speedHeavyAttack": return 60;
    case "executeDebuff": return getStatusList("hero").some((status) => status.kind === "debuff" && status.clearable !== false) ? 75 : 45;
    case "pierceAttack":
    case "drain": return 60 + (selfBelow50 ? 10 : 0);
    case "healAlly": return 20 + (anyAllyBelow50 ? 60 : 0) + (anyAllyBelow25 ? 40 : 0);
    case "healAllyByAttack":
    case "healAllByDefense": return 20 + (anyAllyBelow50 ? 55 : 0);
    case "healSelfMax": return selfBelow50 ? 75 : 20;
    case "guard":
    case "guardAttack":
    case "guardAttackBuff":
    case "defenseStance":
    case "guardLowest":
    case "cleanseSelfShield":
    case "cleanseSelfAllDefenseStance": return 25 + (selfBelow50 ? 40 : 0) + (skill.type === "guardAttack" ? 20 : 0);
    case "guardAll": return 25 + (allies.some((ally) => ally.shield <= ally.defense * 0.2) ? 45 : 0);
    case "cleanseAlly": return enemyHasDebuff ? 90 : -Infinity;
    case "weakenAttack": return 45 + (state.run.hero.attack > 1 ? 20 : 0);
    case "weakenDefense": return 45 + (state.run.hero.defense > 0 ? 25 : 0);
    case "slowHero":
    case "vulnerableHero": return 45;
    case "growDefense": return 35 + (state.battle.turn <= 3 ? 20 : 0);
    case "growDefenseByAttack":
    case "growMaxHpAndDefense": return 35 + (state.battle.turn <= 3 ? 25 : 0);
    case "selfShieldMax": return 25 + (selfBelow50 ? 45 : 0);
    case "attackBuff":
    case "attackBuffByDefense":
    case "allyAttackBuffHalf":
    case "teamAttackBuffFlat":
    case "growAttack": return 35 + (state.battle.turn <= 3 ? 20 : 0) - (selfBelow30 ? 20 : 0);
    case "speedBuff": return 35 + (effectiveSpeed(enemy) <= effectiveSpeed("hero") ? 25 : 0);
    case "clearHeroBuff": return heroHasBuff ? 90 : -Infinity;
    case "focusTax": return 45 + (state.battle.focus > 0 ? 20 : 0);
    case "sealLastHand": return state.battle.lastHandName ? 65 : -Infinity;
    case "rerollTaxNext": return 35 + (state.battle.focus > 0 ? 20 : 0);
    case "summon": return countSummons(enemy) < (skill.limit || 3) ? 80 : -Infinity;
    case "buffSummons": return liveEnemies().some((unit) => unit.summonedBy === enemy.id) ? 65 : -Infinity;
    case "heavyAttack": return 60;
    default: return 50;
  }
}

function countSummons(enemy) {
  return liveEnemies().filter((unit) => unit.summonedBy === enemy.id).length;
}

function describeIntent(skill, enemy) {
  switch (skill.type) {
    case "guard": return { ...skill, text: `获得${intentShield(skill, enemy)}护盾` };
    case "guardAll": return { ...skill, text: `全体获得${intentShield(skill, enemy)}护盾` };
    case "guardAttack": return { ...skill, text: `获得${intentShield(skill, enemy)}护盾并攻击 ${enemy.attack}` };
    case "guardAttackBuff": return { ...skill, text: `防御姿态并攻击+${ceil(enemy.attack * (skill.attackRatio || 0.5))}` };
    case "defenseStance": return { ...skill, text: `本回合受伤-${Math.round((skill.reduction || 0.5) * 100)}%` };
    case "multiAttack": return { ...skill, text: `攻击 ${skill.hits}段 ${ceil(enemy.attack * (skill.multiplier || 1))}` };
    case "healAlly": return { ...skill, text: `治疗 ${skill.flatByAttack ? enemy.attack : ceil(enemy.maxHp * skill.ratio)}` };
    case "healAllyByAttack": return { ...skill, text: `全体治疗 ${enemy.attack}` };
    case "healSelfMax": return { ...skill, text: `回复${Math.round((skill.ratio || 0) * 100)}%最大生命` };
    case "attackBuff": return { ...skill, text: `提升攻击 ${ceil(enemy.baseAttack * skill.amountRatio)}` };
    case "attackBuffByDefense": return { ...skill, text: `攻击提升 ${ceil(enemy.defense * (skill.ratio || 0.2))}` };
    case "allyAttackBuffHalf": return { ...skill, text: `友方攻击+${ceil(enemy.attack * 0.5)}` };
    case "teamAttackBuffFlat": return { ...skill, text: `全体攻击+${enemy.attack}` };
    case "growAttack": return { ...skill, text: `蓄力，攻击+${skill.amount}` };
    case "weakenAttack": return { ...skill, text: `角色攻击-${skill.amount}` };
    case "weakenDefense": return { ...skill, text: `攻击并降低防御 ${skill.amount}` };
    case "attackWeakenDefenseByAttack": return { ...skill, text: `攻击并降低防御 ${ceil(enemy.attack * (skill.ratio || 1))}` };
    case "attackCleanseHeroBuff": return { ...skill, text: "攻击并清除角色1个增益" };
    case "attackSlow": return { ...skill, text: `攻击${skill.multiplier ? ` ${Math.round(skill.multiplier * 100)}%` : ""}并速度${skill.amount}` };
    case "pierceAttack": return { ...skill, text: `穿甲攻击 ${enemy.attack}` };
    case "chargedAttack": return { ...skill, text: `蓄力攻击 ${ceil(enemy.attack * (skill.multiplier || 1))}` };
    case "hpScaledAttack": return { ...skill, text: `生命压制 ${ceil(enemy.attack * enemy.hp * (skill.ratio || 0.1))}` };
    case "defenseAttack": return { ...skill, text: `防御攻击 ${ceil(enemy.defense * (skill.ratio || 1))}` };
    case "drain": return { ...skill, text: `攻击并吸取 ${ceil(enemy.attack * skill.ratio)}` };
    case "speedBuff": return { ...skill, text: `速度+${skill.amount}` };
    case "cleanseAlly": return { ...skill, text: "清除友方1个可清除负面状态" };
    case "cleanseSelfShield": return { ...skill, text: `清除自身负面并获得${ceil(enemy.defense * (skill.shieldByDef || 0.3))}护盾` };
    case "cleanseSelfAllDefenseStance": return { ...skill, text: "清除自身全部负面并防御姿态" };
    case "slowHero": return { ...skill, text: `角色速度${skill.amount}` };
    case "vulnerableHero": return { ...skill, text: `角色受伤+${Math.round((skill.bonus || 0) * 100)}%` };
    case "growDefense": return { ...skill, text: `防御+${skill.amount || Math.round((skill.ratio || 0) * 100) + "%"}` };
    case "growDefenseByAttack": return { ...skill, text: `防御+${ceil(enemy.attack * (skill.ratio || 1))}` };
    case "growMaxHpAndDefense": return { ...skill, text: "提升生命上限与防御" };
    case "guardLowest": return { ...skill, text: `护盾最低友方 ${ceil(enemy.defense * (skill.shieldByDef || 0.5))}` };
    case "healAllByDefense": return { ...skill, text: `全体治疗 ${ceil(enemy.defense * (skill.ratio || 0.5))}` };
    case "speedHeavyAttack": return { ...skill, text: `提速并攻击 ${ceil(enemy.attack * (skill.multiplier || 1))}` };
    case "selfShieldMax": return { ...skill, text: `获得${skill.ratioByDefense ? ceil(enemy.defense * skill.ratioByDefense) : Math.round((skill.ratio || 0) * 100) + "%最大生命"}护盾` };
    case "clearHeroBuff": return { ...skill, text: "清除角色1个增益" };
    case "focusTax": return { ...skill, text: "抽税：减少调度点" };
    case "sealLastHand": return { ...skill, text: "封锁上回合牌型" };
    case "executeDebuff": return { ...skill, text: getStatusList("hero").some((status) => status.kind === "debuff" && status.clearable !== false) ? `清算 ${ceil(enemy.attack * (skill.multiplier || 2))}` : `攻击 ${enemy.attack}` };
    case "rerollTaxNext": return { ...skill, text: "干扰：首次调度费用+1" };
    case "summon": return { ...skill, text: "召唤单位" };
    case "buffSummons": return { ...skill, text: "强化召唤物" };
    case "heavyAttack": return { ...skill, text: `强力攻击 ${Math.round((skill.multiplier || 1) * enemy.attack)}` };
    default: return { ...skill, type: "attack", text: `攻击 ${enemy.attack}` };
  }
}

function intentShield(skill, enemy) {
  if (skill.shieldFlat) return skill.shieldFlat;
  return ceil(enemy.defense * (skill.shieldByDef || 0.35));
}

function selectTarget(enemyId) {
  if (!state.battle?.enemies.some((enemy) => enemy.id === enemyId && enemy.hp > 0)) return;
  state.battle.targetId = enemyId;
  render();
}

function getTargetEnemy() {
  const battle = state.battle;
  return battle.enemies.find((enemy) => enemy.id === battle.targetId && enemy.hp > 0) || liveEnemies()[0] || null;
}

function toggleCard(uid) {
  if (state.battle?.swapChoice) return;
  const selected = state.selected;
  if (selected.includes(uid)) state.selected = selected.filter((id) => id !== uid);
  else if (selected.length < 5) state.selected.push(uid);
  render();
}

function reroll() {
  const battle = state.battle;
  if (!battle || battle.swapChoice || state.selected.length !== 3) return;
  const free = battle.freeRerolls > 0 || battle.freeRerollThisTurn || (hasRelic("old-deal-box") && !battle.freeRerollUsed);
  const cost = free ? 0 : 1 + (battle.rerollTaxNext || 0);
  if (battle.focus < cost) return;
  const selected = new Set(state.selected);
  const moving = battle.hand.filter((c) => selected.has(c.uid));
  battle.hand = battle.hand.filter((c) => !selected.has(c.uid));
  battle.discard.push(...moving);
  drawCards(3);
  if (battle.freeRerolls > 0) battle.freeRerolls -= 1;
  else if (battle.freeRerollThisTurn) battle.freeRerollThisTurn = false;
  else if (hasRelic("old-deal-box") && !battle.freeRerollUsed) battle.freeRerollUsed = true;
  else {
    battle.focus -= cost;
    battle.rerollTaxNext = 0;
  }
  if (hasRelic("shuffle-gloves")) addStatus("hero", { id: "shuffle-gloves", name: "洗牌手套", kind: "buff", stat: "damageDealt", value: 0.1, remaining: 1, clearable: true });
  state.selected = [];
  log(`重抽3张${cost > 1 ? `，消耗${cost}调度点` : ""}。`);
  render();
}

function selectedCards() {
  if (!state.battle) return [];
  return state.selected.map((uid) => state.battle.hand.find((card) => card.uid === uid)).filter(Boolean);
}

function drawCards(count) {
  const battle = state.battle;
  while (battle.hand.length < 7 && count > 0) {
    if (battle.draw.length === 0 && battle.discard.length > 0) {
      battle.draw = state.rng.shuffle(battle.discard);
      battle.discard = [];
    }
    if (battle.draw.length === 0) break;
    battle.hand.push(battle.draw.shift());
    count--;
  }
}

function tempConsumeCard(cardId) {
  const battle = state.battle;
  const item = state.run.backpack[cardId];
  if (!battle || battle.swapChoice || battle.extraConsume <= 0 || state.selected.length !== 4 || !item) return;
  const refundedByHolder = hasRelic("side-card-holder") && !battle.sideCardHolderUsed;
  const refundedByGear = battle.freeTempConsume > 0;
  const refunded = refundedByHolder || refundedByGear;
  if (!refunded && item.count <= 1) return;
  if (refundedByHolder) battle.sideCardHolderUsed = true;
  if (refundedByGear) battle.freeTempConsume -= 1;
  if (!refunded) item.count -= 1;
  battle.extraConsume -= 1;
  const card = { ...cardById[cardId], uid: makeRunId(`temp-${cardId}`), tempConsumed: true };
  battle.hand.push(card);
  state.selected.push(card.uid);
  state.modal = null;
  log(`临时补牌：${refunded ? "副牌夹保留" : "消耗"} ${cardLabel(card)} 加入本次出牌。`);
  render();
}

function playSelected() {
  const battle = state.battle;
  if (!battle || battle.swapChoice || state.selected.length !== 5) return;
  const cards = state.selected.map((uid) => battle.hand.find((c) => c.uid === uid));
  const result = evaluateHand(cards);
  resolveRoundActions(cards, result);
}

function resolveRoundActions(cards, result) {
  const battle = state.battle;
  battle.enemyActionReports = [];
  battle.lastEnemySummary = null;
  battle.heroAfterEnemy = false;
  const units = [
    { type: "hero", speed: effectiveSpeed("hero"), tie: state.rng.next() },
    ...liveEnemies().map((enemy) => ({ type: "enemy", enemy, speed: effectiveSpeed(enemy), tie: state.rng.next() })),
  ].sort((a, b) => b.speed - a.speed || b.tie - a.tie);
  let heroActed = false;
  for (const unit of units) {
    if (unit.type === "enemy") {
      if (!unit.enemy.acted) {
        if (!heroActed) battle.heroAfterEnemy = true;
        resolveEnemyAction(unit.enemy);
      }
      if (state.run.hero.hp <= 0) {
        state.screen = "defeat";
        log("生命归零，本局结束。");
        state.selected = [];
        return render();
      }
      continue;
    }
    heroActed = true;
    executePlayerAction(cards, result);
    if (liveEnemies().length === 0) return winBattle();
    if (startPostPlaySwap(result, cards)) return render();
  }
  finishRoundAfterActions();
}

function executePlayerAction(cards, result) {
  const battle = state.battle;
  resolveHand(cards, result);
  const keep = cards[0].tempConsumed ? null : cards[0].uid;
  const selected = new Set(state.selected);
  battle.discard.push(...battle.hand.filter((c) => selected.has(c.uid) && c.uid !== keep && !c.tempConsumed));
  battle.hand = battle.hand.filter((c) => (!selected.has(c.uid) || c.uid === keep) && !c.tempConsumed);
  drawCards(4);
  state.selected = [];
}

function continueAfterPlayerAction() {
  enemyTurn();
  if (state.run.hero.hp <= 0) {
    state.screen = "defeat";
    log("生命归零，本局结束。");
    return render();
  }
  finishRoundAfterActions();
}

function finishRoundAfterActions() {
  const battle = state.battle;
  endRoundStatuses();
  battle.turn += 1;
  if (hasRelic("shield-spring")) addHeroShield(5);
  applyRelicHooks("turnStart");
  beginPlayerTurn();
  if (state.run.hero.hp <= 0) {
    state.screen = "defeat";
    log("生命归零，本局结束。");
    return render();
  }
  render();
}

function startPostPlaySwap(hand, playedCards) {
  const battle = state.battle;
  const cloudCandidates = [...battle.discard, ...battle.draw].filter((card) => ["2", "3", "4"].includes(card.rank));
  if (hasRelic("cloud-ladder") && hand.name === "顺子" && battle.hand.length > 0 && cloudCandidates.length > 0) {
    battle.swapChoice = {
      id: "cloud-ladder",
      title: "云梯",
      text: "选择最多2张手牌，与弃牌堆或抽牌堆中的2/3/4点数牌交换。可跳过。",
      max: 2,
      exact: false,
      zones: ["discard", "draw"],
      selectedHand: [],
      selectedPool: [],
    };
    return true;
  }
  return false;
}

function swapPoolCards(choice) {
  const battle = state.battle;
  const cards = [];
  if (choice.zones.includes("discard")) cards.push(...battle.discard.map((card) => ({ ...card, zone: "discard", key: `discard:${card.uid}` })));
  if (choice.zones.includes("draw")) cards.push(...battle.draw.map((card) => ({ ...card, zone: "draw", key: `draw:${card.uid}` })));
  if (choice.id === "cloud-ladder") return cards.filter((card) => ["2", "3", "4"].includes(card.rank));
  return cards;
}

function toggleSwapHand(uid) {
  const choice = state.battle?.swapChoice;
  if (!choice) return;
  if (choice.selectedHand.includes(uid)) choice.selectedHand = choice.selectedHand.filter((id) => id !== uid);
  else if (choice.selectedHand.length < choice.max) choice.selectedHand.push(uid);
  render();
}

function toggleSwapPool(key) {
  const choice = state.battle?.swapChoice;
  if (!choice) return;
  if (choice.selectedPool.includes(key)) choice.selectedPool = choice.selectedPool.filter((id) => id !== key);
  else if (choice.selectedPool.length < choice.max) choice.selectedPool.push(key);
  render();
}

function confirmSwapChoice() {
  const battle = state.battle;
  const choice = battle?.swapChoice;
  if (!choice) return;
  if (choice.selectedHand.length !== choice.selectedPool.length || (choice.exact && choice.selectedHand.length !== choice.max)) return;
  const handCards = choice.selectedHand.map((uid) => battle.hand.find((card) => card.uid === uid)).filter(Boolean);
  const poolCards = choice.selectedPool.map((key) => {
    const [zone, uid] = key.split(":");
    return { zone, card: battle[zone].find((item) => item.uid === uid) };
  }).filter((item) => item.card);
  if (handCards.length !== poolCards.length) return;
  battle.hand = battle.hand.filter((card) => !choice.selectedHand.includes(card.uid));
  for (const { zone, card } of poolCards) battle[zone] = battle[zone].filter((item) => item.uid !== card.uid);
  battle.hand.push(...poolCards.map((item) => item.card));
  for (let i = 0; i < handCards.length; i++) battle[poolCards[i].zone].push(handCards[i]);
  log(`${choice.title}：交换 ${handCards.length} 张牌。`);
  battle.swapChoice = null;
  continueAfterPlayerAction();
}

function skipSwapChoice() {
  const battle = state.battle;
  if (!battle?.swapChoice) return;
  log(`${battle.swapChoice.title}：跳过换牌。`);
  battle.swapChoice = null;
  continueAfterPlayerAction();
}

function canOpenTempConsume() {
  const battle = state.battle;
  if (!battle || battle.swapChoice || battle.extraConsume <= 0 || state.selected.length !== 4) return false;
  const minCount = battle.freeTempConsume > 0 ? 1 : 2;
  return Object.values(state.run.backpack).some((item) => item.count >= minCount);
}

function tempConsumeHint() {
  const battle = state.battle;
  if (!battle) return "仅战斗中可用";
  if (battle.swapChoice) return "先处理当前换牌";
  if (battle.extraConsume <= 0) return "本场次数已用完";
  if (state.selected.length < 4) return `先选择4张牌，还差${4 - state.selected.length}张`;
  if (state.selected.length > 4) return "已选满5张，取消1张后可补牌";
  const minCount = battle.freeTempConsume > 0 ? 1 : 2;
  if (!Object.values(state.run.backpack).some((item) => item.count >= minCount)) return battle.freeTempConsume > 0 ? "大背包没有可选择的牌" : "大背包没有可消耗重复牌";
  return battle.freeTempConsume > 0 ? "方片齿轮：本次补牌不消耗大背包卡牌" : "从大背包消耗1张重复牌补成第5张";
}

function openTempConsumeModal() {
  if (!canOpenTempConsume()) return;
  state.modal = { type: "temp-consume" };
  render();
}

function openDetailModal(kind, id) {
  state.modal = { type: "detail", kind, id };
  render();
}

function closeModal() {
  state.modal = null;
  render();
}

function closePackManager() {
  const target = state.previousScreen && state.previousScreen !== "packs" ? state.previousScreen : "map";
  state.previousScreen = null;
  state.screen = target;
  render();
}

function chooseBestHand(cards) {
  if (cards.length < 5) return cards;
  let best = null;
  for (let a = 0; a < cards.length - 4; a++) {
    for (let b = a + 1; b < cards.length - 3; b++) {
      for (let c = b + 1; c < cards.length - 2; c++) {
        for (let d = c + 1; d < cards.length - 1; d++) {
          for (let e = d + 1; e < cards.length; e++) {
            const handCards = [cards[a], cards[b], cards[c], cards[d], cards[e]];
            const hand = evaluateHand(handCards);
            const score = handScore(hand, handCards);
            if (!best || score > best.score) best = { cards: handCards, hand, score };
          }
        }
      }
    }
  }
  return best?.cards || cards.slice(0, 5);
}

function handScore(hand, cards) {
  const order = HAND_ORDER.indexOf(hand.name);
  const damage = getDamageEvents(hand).reduce((sum, event) => sum + event.power * (event.aoe ? 1.5 : 1), 0);
  const utility = ["三条", "同花", "同花顺", "皇家同花顺"].includes(hand.name) ? 8 : 0;
  const suitCounts = Object.values(countBy(cards, "suit"));
  const weakSuit = suitCounts.some((count) => count >= 3) ? 3 : 0;
  return order * 1000 + damage * 10 + utility + weakSuit + hand.sum;
}

function resolveHand(cards, hand) {
  const battle = state.battle;
  const target = getTargetEnemy();
  const before = playerActionSnapshot();
  const rankPower = cards.reduce((sum, card) => sum + getPlayedCardPower(card), 0);
  let pierce = Math.min(rankPower * 0.025, 0.5);
  if (hasRelic("knight-medal") && state.battle.turn === 1) pierce = 1 - (1 - 0.5) * (1 - pierce);
  const damageEvents = getDamageEvents(hand).map((event) => hasRelic("curse-doll") && hand.name !== "高牌" ? { ...event, power: event.power + 1 } : event);
  let bonus = getDamageBonus(hand, cards);
  const judgementBoss = liveEnemies().find((enemy) => enemy.name === "赌局审判者");
  const repeatedJudgementHand = judgementBoss && battle.lastHandName === hand.name;
  const sealedHandNameAtStart = battle.sealedHandName;
  applyAceBreak(cards);
  if (hasRelic("a-power")) {
    const aCount = cards.filter((c) => c.rank === "A").length;
    const gain = Math.min(10 - battle.aPower, aCount);
    if (gain > 0) {
      battle.aPower += gain;
      log(`A之力：本场攻击 +${battle.aPower}`);
    }
  }
  applyPreDamageHandEffects(hand, cards);
  if (hasRelic("gold-gourd") && hand.name === "葫芦") bonus += 0.5;
  if (hasRelic("knight-lance") && battle.turn === 1) bonus += 0.2;
  if (hasRelic("tactical-hourglass") && battle.heroAfterEnemy) bonus += 0.25;
  if (hasRelic("dealer-chip") && hand.name === "同花" && !battle.dealerChipFlushUsed) {
    battle.dealerChipFlushUsed = true;
    state.run.joker += 1;
    log("庄家筹码：同花获得 1 Joker。");
  }
  if (hasRelic("dealer-chip") && ["同花顺", "皇家同花顺"].includes(hand.name) && !battle.dealerChipStraightFlushUsed) {
    battle.dealerChipStraightFlushUsed = true;
    state.run.joker += 3;
    log("庄家筹码：同花顺获得 3 Joker。");
  }
  bonus += getHeroDamageDealtBonus();
  if (repeatedJudgementHand) bonus -= 0.5;
  if (sealedHandNameAtStart === hand.name) {
    bonus -= 0.5;
    log(`封牌：${hand.name} 点数倍率降低。`);
  }
  const heroAtk = state.run.hero.attack + battle.aPower + getHeroAttackBonus();
  const chargeFixedDamage = battle.charge > 0 ? battle.charge : 0;
  let clubCrownConsumed = false;
  let twoPairMainHpDamage = 0;
  let totalHpDamage = 0;
  let totalSegments = 0;
  damageEvents.forEach((event, segmentIndex) => {
    const targets = event.aoe ? liveEnemies() : [target].filter(Boolean);
    for (const enemy of targets) {
      const raw = heroAtk + event.power;
      const dmg = computeDamage(raw, effectiveDefense(enemy), pierce, bonus + enemyDamageTakenBonus(enemy));
      const result = applyEnemyDamage(enemy, dmg, { segmentIndex, isSingleSegment: damageEvents.length === 1, hand, isHandAttack: true });
      totalHpDamage += result.hpDamage;
      totalSegments += 1;
      if (event.twoPairShield && enemy.id === target?.id) twoPairMainHpDamage += result.hpDamage;
      if (hasRelic("small-mirror") && !battle.smallMirrorUsed && result.hpDamage > 0) {
        battle.smallMirrorUsed = true;
        addHeroShield(result.hpDamage);
        battle.smallMirrorShieldRemove = (battle.smallMirrorShieldRemove || 0) + result.hpDamage;
      }
      if (hasRelic("sword-in-stone") && result.overflow > 0) {
        const spillTarget = state.rng.pick(liveEnemies().filter((item) => item.id !== enemy.id));
        if (spillTarget) applyEnemyDamage(spillTarget, ceil(result.overflow * 0.5));
      }
      if (chargeFixedDamage > 0 && enemy.hp > 0) {
        const chargeResult = applyEnemyDamage(enemy, chargeFixedDamage, { hand, fixed: true, isHandAttack: true });
        totalHpDamage += chargeResult.hpDamage;
        totalSegments += 1;
      }
      if (!clubCrownConsumed && enemy.id === target?.id && result.hpDamage > 0 && hasStatus("hero", "club-crown-next")) {
        const fixed = ceil(enemy.maxHp * 0.1);
        const crownResult = applyEnemyDamage(enemy, fixed, { hand, fixed: true });
        totalHpDamage += crownResult.hpDamage;
        totalSegments += 1;
        removeStatusById("hero", "club-crown-next");
        clubCrownConsumed = true;
        log(`梅花皇冠追加 ${fixed} 固定伤害。`);
      }
    }
  });
  if (chargeFixedDamage > 0) {
    battle.charge = 0;
    log(`蓄势：每段牌型攻击追加 ${chargeFixedDamage} 固定伤害。`);
  }
  if (hand.name === "一对") addHeroShield(heroAtk * state.run.layer);
  if (hand.name === "两对" && twoPairMainHpDamage > 0) addHeroShield(twoPairMainHpDamage);
  if (hand.name === "四条" && target?.hp > 0 && target.hp < target.maxHp * 0.1) {
    target.hp = 0;
    applyEnemyDeathTraits(target);
    log(`四条斩杀：${target.name} 生命低于10%。`);
  }
  applyEnemyHandObservedTraits(hand);
  if (repeatedJudgementHand && judgementBoss.hp > 0) {
    const dmg = computeDamage(judgementBoss.attack * 1.5, state.run.hero.defense, 0, heroDamageTakenBonus());
    applyHeroDamage(dmg);
    log(`赌局审判：重复打出${hand.name}，伤害降低并受到反击。`);
  }
  if (hasRelic("scissors") && target?.hp > 0) {
    const fixed = Math.max(...cards.map((card) => RANK_VALUE[card.rank]));
    const result = applyEnemyDamage(target, fixed);
    totalHpDamage += result.hpDamage;
    totalSegments += 1;
    log(`剪刀追加 ${fixed} 固定伤害。`);
  }
  if (hasRelic("curse-doll") && hand.name === "高牌") applyHeroDamage(1);
  applyHandUtility(hand, cards);
  applyRelicHooks("handPlayed", { hand, cards, target });
  const after = playerActionSnapshot();
  const relicTriggers = previewRelicTriggers(hand, cards);
  if (sealedHandNameAtStart) battle.sealedHandName = null;
  battle.lastHandName = hand.name;
  battle.lastActionSummary = {
    handName: hand.name,
    detail: hand.detail,
    description: playerActionNarrative(before, after, { hand, cards, target, hpDamage: totalHpDamage, segments: totalSegments }),
    targetName: target?.name || "无主目标",
    hpDamage: totalHpDamage,
    segments: totalSegments,
    effects: playerActionEffects(before, after, { hand, cards, target, hpDamage: totalHpDamage, segments: totalSegments, pierce, relicTriggers }),
  };
  log(`打出 ${hand.name}：${hand.detail}`);
}

function playerActionSnapshot() {
  const enemies = liveEnemies();
  return {
    heroHp: state.run.hero.hp,
    heroShield: state.battle.shield,
    focus: state.battle.focus,
    heroBuffs: getStatusList("hero").filter((status) => status.kind === "buff").length,
    heroDebuffs: getStatusList("hero").filter((status) => status.kind === "debuff").length,
    enemyHp: enemies.reduce((sum, enemy) => sum + enemy.hp, 0),
    enemyCount: enemies.length,
    enemyDebuffs: enemies.reduce((sum, enemy) => sum + getStatusList(enemy).filter((status) => status.kind === "debuff").length, 0),
    enemyBuffs: enemies.reduce((sum, enemy) => sum + getStatusList(enemy).filter((status) => status.kind === "buff").length, 0),
  };
}

function playerActionEffects(before, after, context) {
  const effects = [];
  if (context.hpDamage > 0) effects.push({ type: "damage", label: `总伤 ${context.hpDamage}` });
  if (context.segments > 0) effects.push({ type: "segment", label: `${context.segments} 段` });
  if (context.pierce > 0) effects.push({ type: "pierce", label: `穿甲 ${Math.round(context.pierce * 100)}%` });
  const suitText = suitPreviewText(context.cards, context.hand);
  if (!suitText.includes("未触发")) effects.push({ type: "suit", label: suitText.includes("完整") ? "完整花色" : "弱花色" });
  if (after.heroHp > before.heroHp) effects.push({ type: "heal", label: `回血 +${after.heroHp - before.heroHp}` });
  if (after.heroShield > before.heroShield) effects.push({ type: "shield", label: `护盾 +${after.heroShield - before.heroShield}` });
  if (after.focus > before.focus) effects.push({ type: "focus-gain", label: `调度 +${after.focus - before.focus}` });
  if (after.heroBuffs > before.heroBuffs) effects.push({ type: "buff", label: `增益 +${after.heroBuffs - before.heroBuffs}` });
  if (after.heroDebuffs < before.heroDebuffs) effects.push({ type: "cleanse", label: `净化 ${before.heroDebuffs - after.heroDebuffs}` });
  if (after.enemyDebuffs > before.enemyDebuffs) effects.push({ type: "debuff", label: `敌负面 +${after.enemyDebuffs - before.enemyDebuffs}` });
  if (after.enemyBuffs < before.enemyBuffs) effects.push({ type: "cleanse", label: `清敌益 ${before.enemyBuffs - after.enemyBuffs}` });
  if (after.enemyCount < before.enemyCount) effects.push({ type: "kill", label: `击杀 ${before.enemyCount - after.enemyCount}` });
  if (context.relicTriggers.length) effects.push({ type: "relic", label: `藏品 ${context.relicTriggers.length}` });
  return effects.slice(0, 10);
}

function playerActionNarrative(before, after, context) {
  const lines = [];
  if (context.hpDamage > 0) lines.push(`造成 ${context.hpDamage} 点实际生命伤害，共 ${context.segments} 段。`);
  else lines.push(`${context.hand.name} 没有造成实际生命伤害。`);
  if (context.hand.name === "两对") lines.push("两对会把对主目标造成的实际生命伤害转化为护盾。");
  if (context.hand.name === "一对") lines.push("一对会在双段伤害后获得当前攻击力×当前层数的护盾。");
  if (context.hand.name === "三条") lines.push("三条不造成伤害，改为获得护盾，并准备下回合减伤。");
  const shieldGain = after.heroShield - before.heroShield;
  const hpGain = after.heroHp - before.heroHp;
  const focusGain = after.focus - before.focus;
  if (shieldGain > 0) lines.push(`获得护盾 +${shieldGain}。`);
  if (hpGain > 0) lines.push(`回复生命 +${hpGain}。`);
  if (focusGain > 0) lines.push(`恢复调度点 +${focusGain}。`);
  if (after.heroBuffs > before.heroBuffs) lines.push(`获得增益 ${after.heroBuffs - before.heroBuffs} 个。`);
  if (after.enemyDebuffs > before.enemyDebuffs) lines.push(`施加敌方负面 ${after.enemyDebuffs - before.enemyDebuffs} 个。`);
  return lines.join(" ");
}

function applyEnemyHandObservedTraits(hand) {
  if (!["同花顺", "皇家同花顺"].includes(hand.name)) return;
  for (const enemy of liveEnemies()) {
    for (const trait of enemyTraits(enemy, "shieldOnStraightFlush")) {
      enemy.shield += ceil(enemy.maxHp * (trait.ratio || 0.15));
      log(`${enemy.name} 因同花顺获得护盾。`);
    }
  }
}

function fibonacciChargeDamage(stacks) {
  const sequence = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  if (stacks < sequence.length) return sequence[stacks];
  let prev = sequence[sequence.length - 2];
  let current = sequence[sequence.length - 1];
  for (let i = sequence.length; i <= stacks; i++) {
    [prev, current] = [current, prev + current];
  }
  return current;
}

function getCardPower(id) {
  const level = state.run.backpack[id]?.level || 1;
  let power = level <= 1 ? 0 : Math.min(level - 1, 5);
  return power;
}

function getPlayedCardPower(card) {
  if (card.tempConsumed) return 0;
  return getCardPower(card.id);
}

function computeDamage(base, defense, pierce = 0, bonus = 0) {
  const effectiveDefense = defense * (1 - pierce);
  return ceil(base * (1 + bonus) * (100 / (effectiveDefense + 100)));
}

function effectiveDefense(enemy) {
  return getStatusList(enemy).reduce((value, status) => {
    if (status.pending || status.stat !== "defenseMultiplier") return value;
    return Math.max(0, value * (1 + (status.value || 0) * (status.stacks || 1)));
  }, enemy.defense);
}

function enemyDamageTakenBonus(enemy) {
  return getStatusList(enemy).reduce((sum, status) => {
    if (status.pending || !["damageTaken", "nextHandDamageTaken"].includes(status.stat)) return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function applyEnemyDamage(enemy, amount, context = {}) {
  let incoming = amount;
  const multiHitTrait = firstEnemyTrait(enemy, "multiHitReduction");
  if (multiHitTrait && (context.segmentIndex || 0) > 0) incoming = ceil(incoming * (1 - (multiHitTrait.reduction || 0.3)));
  let remaining = incoming;
  const hpBefore = enemy.hp;
  if (enemy.shield > 0) {
    const block = Math.min(enemy.shield, remaining);
    enemy.shield -= block;
    remaining -= block;
  }
  enemy.hp = Math.max(0, enemy.hp - remaining);
  const hpDamage = hpBefore - enemy.hp;
  if (hpDamage > 0) {
    for (const trait of enemyTraits(enemy, "gainAttackOnHit")) enemy.attack += trait.amount || 1;
  }
  const dullArmor = firstEnemyTrait(enemy, "dullArmor");
  if (dullArmor && context.isSingleSegment && incoming <= enemy.defense * (dullArmor.thresholdRatio || 0.5)) {
    addStatus(enemy, { id: `${enemy.id}-dull-armor`, name: "钝甲", kind: "buff", stat: "damageTaken", value: -(dullArmor.reduction || 0.2), remaining: 1, clearable: true });
  }
  if (hpBefore > 0 && enemy.hp <= 0) applyEnemyDeathTraits(enemy);
  if (context.isHandAttack) {
    setStatusList(enemy, getStatusList(enemy).filter((status) => status.stat !== "nextHandDamageTaken"));
  }
  return { hpDamage, overflow: Math.max(0, remaining - hpBefore) };
}

function applyEnemyDeathTraits(deadEnemy) {
  for (const ally of liveEnemies()) {
    for (const trait of enemyTraits(ally, "allyDeathHealBuff")) {
      ally.hp = Math.min(ally.maxHp, ally.hp + ceil(ally.maxHp * (trait.healRatio || 0.2)));
      ally.attack += ceil(ally.attack * (trait.attackRatio || 0.5));
    }
    for (const trait of enemyTraits(ally, "summonDeathHeal")) {
      if (deadEnemy.summonedBy === ally.id) ally.hp = Math.min(ally.maxHp, ally.hp + ceil(ally.maxHp * (trait.ratio || 0.1)));
    }
  }
}

function getDamageBonus(hand, cards) {
  return 0;
}

function getDamageEvents(hand) {
  const p = hand.primary;
  switch (hand.name) {
    case "高牌": return [{ power: p, aoe: false }];
    case "一对": {
      const power = p;
      return [{ power, aoe: false }, { power, aoe: false }];
    }
    case "两对": return [{ power: ceil(hand.pairValues[0] * hand.pairValues[1] * 0.35), aoe: true, twoPairShield: true }];
    case "三条": return [];
    case "顺子": return hand.sequence.map((power) => ({ power, aoe: false }));
    case "同花": return [{ power: p * 3, aoe: false }];
    case "葫芦": return [{ power: hand.tripsValue * 3 + hand.pairValue * 2, aoe: true }, { power: hand.tripsValue * 2, aoe: false }];
    case "四条": {
      const events = [{ power: p * 5, aoe: true }, { power: p * 5, aoe: false }];
      return events;
    }
    case "同花顺":
    case "皇家同花顺": return hand.sequence.map((power) => ({ power, aoe: true }));
    default: return [{ power: p, aoe: false }];
  }
}

function healHero(amount) {
  const heal = ceil(amount);
  if (heal <= 0) return;
  state.run.hero.hp = Math.min(state.run.hero.maxHp, state.run.hero.hp + heal);
}

function gainCharge(amount) {
  const battle = state.battle;
  if (!battle || amount <= 0) return;
  battle.charge += amount;
}

function naturalCompleteSuit(hand, cards) {
  if (!["同花", "同花顺", "皇家同花顺"].includes(hand.name)) return null;
  return cards[0]?.suit || null;
}

function scepterCompleteSuit(hand, cards) {
  if (naturalCompleteSuit(hand, cards)) return null;
  const suitCounts = countBy(cards, "suit");
  return SUITS.find((suit) => (suitCounts[suit.id] || 0) >= 4 && hasRelic(`${suit.id}-scepter`))?.id || null;
}

function weakSuit(cards, hand) {
  if (naturalCompleteSuit(hand, cards) || scepterCompleteSuit(hand, cards)) return null;
  const suitCounts = countBy(cards, "suit");
  const entry = Object.entries(suitCounts).filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1])[0];
  return entry?.[0] || null;
}

function applyCompleteSuitEffect(suit) {
  const battle = state.battle;
  const layer = state.run.layer;
  if (suit === "heart") {
    healHero(8 + 2 * layer);
    addHeroShield(8 * layer);
  }
  if (suit === "spade") {
    for (const enemy of liveEnemies()) addStatus(enemy, { id: "silence", name: "沉默", kind: "debuff", remaining: 1 });
  }
  if (suit === "diamond") battle.freeRerolls += 1;
  if (suit === "club") {
    addStatus("hero", { id: "club-complete-damage", name: "梅花完整", kind: "buff", stat: "damageDealt", value: 0.15, remaining: Infinity, clearable: true, stackable: true });
  }
}

function applyWeakSuitEffect(suit) {
  const battle = state.battle;
  const layer = state.run.layer;
  if (suit === "heart") {
    healHero(6 + layer);
    addHeroShield(5 * layer);
    if (hasRelic("broken-red-thread")) addHeroShield(8);
  }
  if (suit === "spade") {
    for (const enemy of liveEnemies()) {
      addStatus(enemy, { id: "spade-weak-slow", name: "黑桃弱花色", kind: "debuff", stat: "speed", value: -2, remaining: 1, pending: true, clearable: true });
      if (hasRelic("obsidian-seal")) addStatus(enemy, { id: "obsidian-seal-weaken", name: "黑曜印章", kind: "debuff", stat: "attackMultiplier", value: -0.1, remaining: 1, pending: true, clearable: true });
    }
  }
  if (suit === "diamond") {
    battle.freeRerollNextTurnPending = true;
    if (hasRelic("diamond-gear")) battle.freeTempConsume += 1;
  }
  if (suit === "club") {
    addStatus("hero", { id: "club-weak-attack", name: "梅花弱花色", kind: "buff", stat: "attack", value: 1, remaining: Infinity, clearable: true, stackable: true });
    if (hasRelic("club-seal")) {
      for (const enemy of liveEnemies()) addStatus(enemy, { id: "club-seal-vulnerable", name: "梅花火漆", kind: "debuff", stat: "nextHandDamageTaken", value: 0.1, remaining: 1, pending: true, clearable: true });
    }
  }
}

function applySuitAndCrownEffects(hand, cards) {
  const suitCounts = countBy(cards, "suit");
  const completeSuit = naturalCompleteSuit(hand, cards) || scepterCompleteSuit(hand, cards);
  const partialSuit = weakSuit(cards, hand);
  if (completeSuit) applyCompleteSuitEffect(completeSuit);
  else if (partialSuit) applyWeakSuitEffect(partialSuit);

  if (hasRelic("heart-crown") && (suitCounts.heart || 0) >= 3) addHeroShield(3 * state.run.layer);
  if (hasRelic("spade-crown") && (suitCounts.spade || 0) >= 3) {
    addStatus("hero", { id: "spade-crown-speed", name: "黑桃皇冠", kind: "buff", stat: "speed", value: 1, remaining: Infinity, clearable: true, stackable: true });
  }
  if (hasRelic("diamond-crown") && (suitCounts.diamond || 0) >= 3 && (state.battle.diamondCrownTriggers || 0) < 2) {
    state.battle.diamondCrownTriggers += 1;
    state.battle.focus += 1;
  }
  if (hasRelic("club-crown") && (suitCounts.club || 0) >= 3) {
    addStatus("hero", { id: "club-crown-next", name: "梅花皇冠", kind: "buff", stat: "clubCrown", value: 1, remaining: 1, pending: true, clearable: true });
  }
}

function applyPreDamageHandEffects(hand, cards) {
  applySuitAndCrownEffects(hand, cards);
  if (hasRelic("double-blades") && hand.name === "一对") {
    addStatus("hero", { id: "double-blades-attack", name: "双刀", kind: "buff", stat: "attack", value: 10, remaining: 1, clearable: true });
  }
}

function applyHandUtility(hand, cards) {
  const battle = state.battle;
  if (hand.name === "三条") {
    addHeroShield(hand.primary * 3);
    addStatus("hero", { id: "trips-reduce", name: "三条防御", kind: "buff", stat: "damageTaken", value: -0.5, remaining: 1, pending: true, clearable: true });
  }
  if (hasRelic("ladder") && hand.name === "顺子") gainCharge(2);
  if (hasRelic("red-knight-contract")) {
    battle.redKnightStreak = hand.name === "顺子" ? (battle.redKnightStreak || 0) + 1 : 0;
    if (battle.redKnightStreak >= 2) {
      battle.redKnightStreak = 0;
      for (const enemy of liveEnemies()) {
        const stacks = getStatusList(enemy).filter((status) => status.id === "red-knight-defense" && !status.pending).length;
        if (stacks < 2) addStatus(enemy, { id: "red-knight-defense", name: "红骑士的契约", kind: "debuff", stat: "defenseMultiplier", value: -0.3, remaining: 2, clearable: true, stackable: true });
      }
    }
  }
  if (hasRelic("royal-coin") && hand.name === "顺子") {
    battle.royalCoinStraightCount += 1;
    if (battle.royalCoinStraightCount >= 2 && battle.royalCoinTriggers < 2) {
      battle.royalCoinStraightCount = 0;
      battle.royalCoinTriggers += 1;
      state.run.joker += 1;
      log("皇室金币：获得 1 Joker。");
    }
  }
  if (hasRelic("black-knight-contract")) {
    battle.blackKnightCount = HAND_ORDER.indexOf(hand.name) < HAND_ORDER.indexOf("顺子") ? (battle.blackKnightCount || 0) + 1 : 0;
    if (battle.blackKnightCount >= 2) {
      battle.blackKnightCount = 0;
      addStatus("hero", { id: "black-knight-defense", name: "黑骑士的契约", kind: "buff", stat: "defense", value: 20, remaining: 2, clearable: true });
    }
  }
  if (hasRelic("silver-gourd") && hand.name === "葫芦") {
    for (const enemy of liveEnemies().filter((enemy) => !enemy.acted)) addStatus(enemy, { id: "silence", name: "沉默", kind: "debuff", remaining: 1 });
  }
  if (hasRelic("gold-gourd") && hasRelic("silver-gourd") && hand.name === "葫芦") {
    for (let i = 0; i < 6; i++) {
      const target = state.rng.pick(liveEnemies());
      if (target) applyEnemyDamage(target, 3);
    }
  }
  if (hasRelic("yin-yang-charm") && hand.name === "一对") addStatus("hero", { id: "yin-yang-speed", name: "阴阳符咒", kind: "buff", stat: "speed", value: 1, remaining: Infinity, pending: true });
  if (hasRelic("twins-photo") && hand.name === "两对") addStatus("hero", { id: "twins-photo-reduce", name: "双胞胎的照片", kind: "buff", stat: "damageTaken", value: -0.5, remaining: 1, pending: true, clearable: true });
  if (hasRelic("angel-wings") && hand.name === "一对") {
    const enemy = state.rng.pick(liveEnemies());
    if (enemy) addStatus(enemy, { id: "angel-wings-slow", name: "天使的翅膀", kind: "debuff", stat: "speed", value: -5, remaining: 2, pending: true, clearable: true });
  }
  if (hasRelic("five-color-stone") && new Set(cards.map((card) => card.suit)).size === 4) {
    setStatusList("hero", getStatusList("hero").filter((status) => !(status.kind === "debuff" && status.clearable !== false)));
  }
  if (hasRelic("paper-cup")) {
    if (hand.name === "一对") {
      const pool = liveEnemies();
      let damage = battle.paperCupDamage || 0;
      while (damage > 0 && pool.length) {
        const enemy = state.rng.pick(pool);
        applyEnemyDamage(enemy, 1);
        damage -= 1;
      }
      battle.paperCupDamage = 0;
    } else {
      battle.paperCupDamage = Math.min(50, (battle.paperCupDamage || 0) + 10);
    }
  }
  if (hasRelic("crayon") && hand.name === "同花") {
    for (const enemy of liveEnemies()) clearRandomStatus(enemy, "buff");
  }
  if (hasRelic("armor-piercer") && cards.some((card) => card.rank === "A")) {
    const target = getTargetEnemy();
    if (target) addStatus(target, { id: "armor-piercer-defense", name: "破甲锥", kind: "debuff", stat: "defenseMultiplier", value: -0.05, remaining: 2, clearable: true, maxStacks: 3 });
  }
  if (hasRelic("judgement-frame") && hand.name === "四条" && !battle.judgementFrameUsed) {
    battle.judgementFrameUsed = true;
    for (const enemy of liveEnemies()) addStatus(enemy, { id: "judgement-frame-defense", name: "断罪牌框", kind: "debuff", stat: "defenseMultiplier", value: -0.2, remaining: 2, clearable: true });
  }
  if (hasRelic("phonograph") && hand.name === "四条" && !battle.phonographRank) {
    const rank = Object.entries(countBy(cards, "rank")).find(([, count]) => count >= 4)?.[0];
    if (rank) battle.phonographRank = rank;
  }
  if (hasRelic("cursed-contract") && (hand.name === "葫芦" || hand.name === "四条")) {
    battle.cursedContractTriggers = battle.cursedContractTriggers || 0;
    if (battle.cursedContractTriggers >= 2) return;
    battle.cursedContractTriggers += 1;
    battle.extraConsume += 1;
    addStatus("hero", { id: "blood-contract", name: "血契", kind: "debuff", stat: "damageTaken", value: 0.1, remaining: Infinity, clearable: true });
  }
}

function applyAceBreak(cards) {
  const levelSixAces = cards.filter((card) => card.rank === "A" && (state.run.backpack[card.id]?.level || 1) >= 6).length;
  if (!levelSixAces) return;
  const target = getTargetEnemy();
  if (!target) return;
  const extraBreak = hasRelic("throne-shard") ? 1 : 0;
  const reduced = Math.max(0, target.defense - (levelSixAces + extraBreak) * 8);
  log(`Lv.6 A 破防：${target.name} 防御 ${target.defense}→${reduced}`);
  target.defense = reduced;
  if (hasRelic("throne-shard")) addStatus(target, { id: "throne-shard-vulnerable", name: "王座碎片", kind: "debuff", stat: "damageTaken", value: 0.25, remaining: 1, clearable: true });
}

function enemyTurn() {
  state.battle.enemyActionReports = [];
  state.battle.lastEnemySummary = null;
  const ordered = liveEnemies()
    .map((enemy) => ({ enemy, tie: state.rng.next() }))
    .sort((a, b) => effectiveSpeed(b.enemy) - effectiveSpeed(a.enemy) || b.tie - a.tie)
    .map((item) => item.enemy);
  for (const enemy of ordered) {
    if (!enemy.acted) resolveEnemyAction(enemy);
  }
}

function resolveEnemyAction(enemy) {
  if (enemy.acted || enemy.hp <= 0) return;
  enemy.acted = true;
  const before = enemyActionSnapshot();
  if (isSilenced(enemy)) {
    enemy.silenced = false;
    recordEnemyAction(enemy, { type: "skip", text: "沉默，无法行动" }, before, [`${enemy.name} 被沉默，跳过行动`]);
    if (enemy.boss && state.run.layer === 5) {
      addStatus(enemy, { id: "silence-immune", name: "沉默抗性", kind: "buff", remaining: 1, clearable: false });
    }
    return;
  }
  const intent = enemy.intent || { type: "attack", text: `攻击 ${enemy.attack}` };
  resolveEnemyIntent(enemy);
  recordEnemyAction(enemy, intent, before);
}

function enemyActionSnapshot() {
  const enemies = liveEnemies();
  return {
    heroHp: state.run.hero.hp,
    heroShield: state.battle.shield,
    focus: state.battle.focus,
    heroBuffs: getStatusList("hero").filter((status) => status.kind === "buff").length,
    heroDebuffs: getStatusList("hero").filter((status) => status.kind === "debuff").length,
    enemyHp: enemies.reduce((sum, enemy) => sum + enemy.hp, 0),
    enemyShield: enemies.reduce((sum, enemy) => sum + enemy.shield, 0),
    enemyAttack: enemies.reduce((sum, enemy) => sum + enemy.attack + getEnemyAttackFlat(enemy), 0),
    enemyDefense: enemies.reduce((sum, enemy) => sum + enemy.defense, 0),
    enemySpeed: enemies.reduce((sum, enemy) => sum + enemy.speed, 0),
    enemyCount: enemies.length,
    enemyDebuffs: enemies.reduce((sum, enemy) => sum + getStatusList(enemy).filter((status) => status.kind === "debuff").length, 0),
  };
}

function getEnemyAttackFlat(enemy) {
  return getStatusList(enemy).reduce((sum, status) => {
    if (status.pending || status.stat !== "attackFlat") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function recordEnemyAction(enemy, intent, before, forcedLines = null) {
  const after = enemyActionSnapshot();
  const lines = forcedLines || enemyActionDeltaLines(before, after);
  const effects = enemyActionEffects(before, after);
  const text = lines.length ? lines.join("；") : "没有产生明显效果";
  const report = {
    enemyName: enemy.name,
    intentName: intentTypeLabel(intent.type),
    intentText: intent.text || describeIntent(intent, enemy).text || "行动",
    text,
    effects,
  };
  state.battle.enemyActionReports = [...(state.battle.enemyActionReports || []), report].slice(-6);
  state.battle.lastEnemySummary = {
    title: "敌方行动",
    reports: state.battle.enemyActionReports,
  };
  log(`${enemy.name}：${report.intentName}，${text}。`);
}

function enemyActionEffects(before, after) {
  const shieldBlocked = Math.max(0, before.heroShield - after.heroShield);
  const hpLost = Math.max(0, before.heroHp - after.heroHp);
  const effects = [];
  if (shieldBlocked || hpLost) effects.push({ type: "damage", label: `伤害 ${shieldBlocked + hpLost}`, value: shieldBlocked + hpLost });
  if (shieldBlocked) effects.push({ type: "shield-damage", label: `护盾-${shieldBlocked}`, value: shieldBlocked });
  if (hpLost) effects.push({ type: "hp-damage", label: `生命-${hpLost}`, value: hpLost });
  if (after.enemyHp > before.enemyHp) effects.push({ type: "heal", label: `治疗 +${after.enemyHp - before.enemyHp}`, value: after.enemyHp - before.enemyHp });
  if (after.enemyShield > before.enemyShield) effects.push({ type: "shield", label: `敌盾 +${after.enemyShield - before.enemyShield}`, value: after.enemyShield - before.enemyShield });
  if (after.heroDebuffs > before.heroDebuffs) effects.push({ type: "debuff", label: `负面 +${after.heroDebuffs - before.heroDebuffs}`, value: after.heroDebuffs - before.heroDebuffs });
  if (after.heroBuffs < before.heroBuffs) effects.push({ type: "cleanse", label: `清益 ${before.heroBuffs - after.heroBuffs}`, value: before.heroBuffs - after.heroBuffs });
  if (after.focus < before.focus) effects.push({ type: "focus", label: `调度-${before.focus - after.focus}`, value: before.focus - after.focus });
  if (after.enemyAttack > before.enemyAttack) effects.push({ type: "buff", label: `攻 +${after.enemyAttack - before.enemyAttack}`, value: after.enemyAttack - before.enemyAttack });
  if (after.enemyDefense > before.enemyDefense) effects.push({ type: "buff", label: `防 +${after.enemyDefense - before.enemyDefense}`, value: after.enemyDefense - before.enemyDefense });
  if (after.enemySpeed > before.enemySpeed) effects.push({ type: "buff", label: `速 +${after.enemySpeed - before.enemySpeed}`, value: after.enemySpeed - before.enemySpeed });
  if (after.enemyCount > before.enemyCount) effects.push({ type: "summon", label: `召唤 +${after.enemyCount - before.enemyCount}`, value: after.enemyCount - before.enemyCount });
  return effects;
}

function enemyActionDeltaLines(before, after) {
  const lines = [];
  const shieldBlocked = Math.max(0, before.heroShield - after.heroShield);
  const hpLost = Math.max(0, before.heroHp - after.heroHp);
  if (shieldBlocked || hpLost) lines.push(`造成 ${shieldBlocked + hpLost} 伤害${shieldBlocked ? `（护盾吸收 ${shieldBlocked}` : ""}${shieldBlocked && hpLost ? "，" : ""}${hpLost ? `生命-${hpLost}` : ""}${shieldBlocked ? "）" : ""}`);
  if (after.heroShield > before.heroShield) lines.push(`角色护盾 +${after.heroShield - before.heroShield}`);
  if (after.focus < before.focus) lines.push(`调度点 -${before.focus - after.focus}`);
  if (after.heroDebuffs > before.heroDebuffs) lines.push(`施加 ${after.heroDebuffs - before.heroDebuffs} 个负面状态`);
  if (after.heroBuffs < before.heroBuffs) lines.push(`清除角色 ${before.heroBuffs - after.heroBuffs} 个增益`);
  if (after.enemyHp > before.enemyHp) lines.push(`敌方治疗 ${after.enemyHp - before.enemyHp}`);
  if (after.enemyShield > before.enemyShield) lines.push(`敌方护盾 +${after.enemyShield - before.enemyShield}`);
  if (after.enemyAttack > before.enemyAttack) lines.push(`敌方攻击 +${after.enemyAttack - before.enemyAttack}`);
  if (after.enemyDefense > before.enemyDefense) lines.push(`敌方防御 +${after.enemyDefense - before.enemyDefense}`);
  if (after.enemySpeed > before.enemySpeed) lines.push(`敌方速度 +${after.enemySpeed - before.enemySpeed}`);
  if (after.enemyDebuffs < before.enemyDebuffs) lines.push(`清除敌方 ${before.enemyDebuffs - after.enemyDebuffs} 个负面状态`);
  if (after.enemyCount > before.enemyCount) lines.push(`召唤 ${after.enemyCount - before.enemyCount} 个单位`);
  return lines;
}

function resolveEnemyIntent(enemy) {
  const intent = enemy.intent || { type: "attack" };
  if (intent.type === "guard" || intent.type === "guardAttack") enemy.shield += intentShield(intent, enemy);
  if (intent.type === "guardAttackBuff") {
    addStatus(enemy, { id: `${enemy.id}-guard-buff`, name: "防御姿态", kind: "buff", stat: "damageTaken", value: -(intent.reduction || 0.5), remaining: 1, clearable: true });
    enemy.attack += ceil(enemy.attack * (intent.attackRatio || 0.5));
    return;
  }
  if (intent.type === "defenseStance") {
    addStatus(enemy, { id: `${enemy.id}-defense-stance`, name: "防御姿态", kind: "buff", stat: "damageTaken", value: -(intent.reduction || 0.5), remaining: 1, clearable: true });
    return;
  }
  if (intent.type === "guardAll") {
    for (const ally of liveEnemies()) ally.shield += intentShield(intent, enemy);
    return;
  }
  if (intent.type === "healAlly") {
    const target = [...liveEnemies()].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (target) target.hp = Math.min(target.maxHp, target.hp + (intent.flatByAttack ? enemy.attack * intent.flatByAttack : ceil(enemy.maxHp * intent.ratio)));
    return;
  }
  if (intent.type === "healAllyByAttack") {
    for (const ally of liveEnemies()) ally.hp = Math.min(ally.maxHp, ally.hp + enemy.attack);
    return;
  }
  if (intent.type === "healSelfMax") {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + ceil(enemy.maxHp * (intent.ratio || 0.2)));
    return;
  }
  if (intent.type === "cleanseAlly") {
    const target = liveEnemies().find((ally) => ally.silenced || getStatusList(ally).some((status) => status.kind === "debuff" && status.clearable !== false)) || enemy;
    target.silenced = false;
    clearRandomStatus(target, "debuff");
    return;
  }
  if (intent.type === "attackBuff") {
    const amount = ceil(enemy.baseAttack * intent.amountRatio);
    if (intent.duration) addStatus(enemy, { id: `${enemy.id}-attack-buff`, name: "攻击提升", kind: "buff", stat: "attackFlat", value: amount, remaining: intent.duration, clearable: true });
    else {
      enemy.attack += amount;
      enemy.attackUp += 1;
    }
    return;
  }
  if (intent.type === "attackBuffByDefense") {
    addStatus(enemy, { id: `${enemy.id}-def-attack`, name: "防御转攻", kind: "buff", stat: "attackFlat", value: ceil(enemy.defense * (intent.ratio || 0.2)), remaining: intent.duration || 2, clearable: true });
    return;
  }
  if (intent.type === "allyAttackBuffHalf") {
    const target = state.rng.pick(liveEnemies());
    if (target) target.attack += ceil(enemy.attack * 0.5);
    return;
  }
  if (intent.type === "teamAttackBuffFlat") {
    for (const ally of liveEnemies()) ally.attack += enemy.attack;
    return;
  }
  if (intent.type === "growDefense") {
    enemy.defense += intent.amount ?? ceil(enemy.defense * (intent.ratio || 0));
    return;
  }
  if (intent.type === "growDefenseByAttack") {
    enemy.defense += ceil(enemy.attack * (intent.ratio || 1));
    return;
  }
  if (intent.type === "growMaxHpAndDefense") {
    const hpGain = ceil(enemy.attack * (intent.hpByAtk || 2.5));
    enemy.maxHp += hpGain;
    enemy.hp += hpGain;
    enemy.defense += ceil(enemy.attack * (intent.defByAtk || 5));
    return;
  }
  if (intent.type === "growAttack") {
    enemy.attack += intent.amount;
    enemy.attackUp += 1;
    return;
  }
  if (intent.type === "speedBuff") {
    enemy.speed += intent.amount;
    return;
  }
  if (intent.type === "weakenDefense") {
    applyEnemyAttack(enemy, 1);
    state.run.hero.defense = Math.max(0, state.run.hero.defense - intent.amount);
    return;
  }
  if (intent.type === "weakenAttack") {
    addStatus("hero", { id: `${enemy.id}-attack-weaken`, name: enemy.name, kind: "debuff", stat: "attack", value: -intent.amount, remaining: 1, clearable: true });
    return;
  }
  if (intent.type === "attackWeakenDefenseByAttack") {
    applyEnemyAttack(enemy, 1);
    addStatus("hero", { id: `${enemy.id}-defense-weaken`, name: enemy.name, kind: "debuff", stat: "defense", value: -ceil(enemy.attack * (intent.ratio || 1)), remaining: intent.duration || 2, pending: true, clearable: true });
    return;
  }
  if (intent.type === "attackCleanseHeroBuff") {
    applyEnemyAttack(enemy, 1);
    clearRandomStatus("hero", "buff");
    return;
  }
  if (intent.type === "attackSlow") {
    applyEnemyAttack(enemy, 1, 0, intent.multiplier || 1);
    addStatus("hero", { id: `${enemy.id}-slow`, name: enemy.name, kind: "debuff", stat: "speed", value: intent.amount, remaining: enemyDebuffDuration(enemy, intent.duration || 1, true), pending: true, clearable: true });
    return;
  }
  if (intent.type === "slowHero") {
    addStatus("hero", { id: "slow", name: "缓速", kind: "debuff", stat: "speed", value: intent.amount, remaining: enemyDebuffDuration(enemy, intent.duration || 1), pending: true, clearable: true });
    return;
  }
  if (intent.type === "vulnerableHero") {
    addStatus("hero", { id: "vulnerable", name: "易伤", kind: "debuff", stat: "damageTaken", value: intent.bonus || 0.3, remaining: enemyDebuffDuration(enemy, intent.duration || 1) });
    return;
  }
  if (intent.type === "selfShieldMax") {
    if (intent.cleanseAll) setStatusList(enemy, getStatusList(enemy).filter((status) => status.kind !== "debuff" || status.clearable === false));
    else if (intent.cleanse) clearRandomStatus(enemy, "debuff");
    enemy.shield += intent.ratioByDefense ? ceil(enemy.defense * intent.ratioByDefense) : ceil(enemy.maxHp * (intent.ratio || 0.2));
    return;
  }
  if (intent.type === "guardLowest") {
    const target = [...liveEnemies()].sort((a, b) => a.shield - b.shield || a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (target) target.shield += ceil(enemy.defense * (intent.shieldByDef || 0.5));
    return;
  }
  if (intent.type === "cleanseSelfShield") {
    clearRandomStatus(enemy, "debuff");
    enemy.shield += ceil(enemy.defense * (intent.shieldByDef || 0.3));
    return;
  }
  if (intent.type === "cleanseSelfAllDefenseStance") {
    setStatusList(enemy, getStatusList(enemy).filter((status) => status.kind !== "debuff" || status.clearable === false));
    addStatus(enemy, { id: `${enemy.id}-cleanse-stance`, name: "防御姿态", kind: "buff", stat: "damageTaken", value: -(intent.reduction || 0.5), remaining: 1, clearable: true });
    return;
  }
  if (intent.type === "drain") {
    applyEnemyAttack(enemy, 1);
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + ceil(enemy.attack * intent.ratio));
    return;
  }
  if (intent.type === "hpScaledAttack") {
    applyHeroRawDamage(enemy, enemy.attack * enemy.hp * (intent.ratio || 0.1));
    return;
  }
  if (intent.type === "defenseAttack") {
    applyHeroRawDamage(enemy, enemy.defense * (intent.ratio || 1));
    return;
  }
  if (intent.type === "healAllByDefense") {
    for (const ally of liveEnemies()) ally.hp = Math.min(ally.maxHp, ally.hp + ceil(enemy.defense * (intent.ratio || 0.5)));
    return;
  }
  if (intent.type === "clearHeroBuff") {
    const cleared = clearRandomStatus("hero", "buff");
    if (cleared && intent.healRatio) enemy.hp = Math.min(enemy.maxHp, enemy.hp + ceil(enemy.maxHp * intent.healRatio));
    return;
  }
  if (intent.type === "focusTax") {
    if (state.battle.focus > 0) state.battle.focus -= 1;
    else applyEnemyAttack(enemy, 1, 0, 1.5);
    return;
  }
  if (intent.type === "sealLastHand") {
    if (state.battle.lastHandName) state.battle.sealedHandName = state.battle.lastHandName;
    return;
  }
  if (intent.type === "executeDebuff") {
    const heroDebuffed = getStatusList("hero").some((status) => status.kind === "debuff" && status.clearable !== false);
    applyEnemyAttack(enemy, 1, 0, heroDebuffed ? intent.multiplier || 2 : 1);
    return;
  }
  if (intent.type === "rerollTaxNext") {
    state.battle.rerollTaxNext = (state.battle.rerollTaxNext || 0) + 1;
    return;
  }
  if (intent.type === "summon") {
    summonEnemy(enemy, intent);
    return;
  }
  if (intent.type === "buffSummons") {
    for (const unit of liveEnemies().filter((ally) => ally.summonedBy === enemy.id)) unit.attack += ceil(enemy.attack * (intent.attackRatio || 0.5));
    return;
  }
  if (intent.type === "guardAttack") applyEnemyAttack(enemy, 1);
  else if (intent.type === "multiAttack") applyEnemyAttack(enemy, intent.hits, 0, intent.multiplier || 1);
  else if (intent.type === "pierceAttack") applyEnemyAttack(enemy, 1, intent.pierce);
  else if (intent.type === "chargedAttack") applyEnemyAttack(enemy, 1, 0, intent.multiplier || 1);
  else if (intent.type === "speedHeavyAttack") {
    enemy.speed += intent.speed || 0;
    applyEnemyAttack(enemy, 1, 0, intent.multiplier || 1);
  }
  else if (intent.type === "heavyAttack") applyEnemyAttack(enemy, 1, 0, intent.multiplier || 1);
  else applyEnemyAttack(enemy, 1);
  if (intent.cooldown) {
    enemy.cooldowns = enemy.cooldowns || {};
    enemy.cooldowns[intent.type] = intent.cooldown;
  }
}

function enemyDebuffDuration(enemy, duration, fromAttack = false) {
  if (fromAttack) return duration;
  if (firstEnemyTrait(enemy, "swiftCaster") && state.battle.heroAfterEnemy) return duration + 1;
  return duration;
}

function summonEnemy(source, intent) {
  if (countSummons(source) >= (intent.limit || 3)) {
    source.hp = Math.min(source.maxHp, source.hp + ceil(source.maxHp * 0.15));
    return;
  }
  const hp = ceil(source.maxHp * (intent.hpRatio || 0.15));
  const atk = ceil(source.attack * (intent.attackRatio || 0.5));
  state.battle.enemies.push({
    name: intent.name || "召唤物",
    id: makeRunId("summon"),
    summonedBy: source.id,
    elite: false,
    boss: false,
    baseAttack: atk,
    baseDefense: 0,
    maxHp: hp,
    hp,
    attack: atk,
    defense: 0,
    speed: intent.speed || 4,
    baseSpeed: intent.speed || 4,
    shield: 0,
    silenced: false,
    statuses: [],
    acted: true,
    skills: [{ type: "attack" }],
    intent: { type: "attack", text: `攻击 ${atk}` },
  });
}

function applyEnemyAttack(enemy, hits, pierce = 0, multiplier = 1) {
  const attackMultiplier = getStatusList(enemy).reduce((sum, status) => {
    if (status.pending || status.stat !== "attackMultiplier") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
  const attackFlat = getStatusList(enemy).reduce((sum, status) => {
    if (status.pending || status.stat !== "attackFlat") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
  const fastBonus = firstEnemyTrait(enemy, "fastPressure") && state.battle.heroAfterEnemy ? firstEnemyTrait(enemy, "fastPressure").bonus || 0.3 : 0;
  for (let i = 0; i < hits; i++) {
    const dmg = computeDamage((enemy.attack + attackFlat) * multiplier, state.run.hero.defense + getHeroDefenseBonus(), pierce, heroDamageTakenBonus() + attackMultiplier + fastBonus);
    applyHeroDamage(dmg);
  }
}

function applyHeroRawDamage(enemy, raw, pierce = 0) {
  const attackMultiplier = getStatusList(enemy).reduce((sum, status) => {
    if (status.pending || status.stat !== "attackMultiplier") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
  const dmg = computeDamage(raw, state.run.hero.defense + getHeroDefenseBonus(), pierce, heroDamageTakenBonus() + attackMultiplier);
  applyHeroDamage(dmg);
}

function heroDamageTakenBonus() {
  return getStatusList("hero").reduce((sum, status) => {
    if (status.pending || status.stat !== "damageTaken") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function getHeroDamageDealtBonus() {
  return getStatusList("hero").reduce((sum, status) => {
    if (status.pending || status.stat !== "damageDealt") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function getHeroAttackBonus() {
  return getStatusList("hero").reduce((sum, status) => {
    if (status.pending || status.stat !== "attack") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function getHeroDefenseBonus() {
  return getStatusList("hero").reduce((sum, status) => {
    if (status.pending || status.stat !== "defense") return sum;
    return sum + (status.value || 0) * (status.stacks || 1);
  }, 0);
}

function addHeroShield(amount, options = {}) {
  const battle = state.battle;
  if (!battle || amount <= 0) return;
  const gain = ceil(amount);
  battle.shield += gain;
  if (battle.firstShieldCharge && !battle.firstShieldChargeUsed && !options.fromBlackShield) {
    battle.firstShieldChargeUsed = true;
    gainCharge(battle.firstShieldCharge);
  }
  if (hasRelic("echo-shield")) gainCharge(1);
  if (hasRelic("black-shield") && !options.fromBlackShield) addHeroShield(2, { fromBlackShield: true });
}

function applyHeroDamage(amount) {
  const battle = state.battle;
  if (hasRelic("balloon") && battle && !battle.balloonUsed) {
    battle.balloonUsed = true;
    amount = ceil(amount * 0.8);
  }
  let remaining = amount;
  if (battle.shield > 0) {
    const block = Math.min(battle.shield, remaining);
    battle.shield -= block;
    remaining -= block;
  }
  const hpAfter = state.run.hero.hp - remaining;
  if (hpAfter <= 0 && hasRelic("paper-money") && !state.run.paperMoneyUsed) {
    state.run.paperMoneyUsed = true;
    state.run.hero.hp = 1;
    log("纸钱：抵挡致命伤害，保留1点生命。");
  } else {
    state.run.hero.hp = Math.max(0, hpAfter);
  }
  if (battle && hasRelic("umbrella") && remaining > 0) battle.umbrellaShieldNext = (battle.umbrellaShieldNext || 0) + 2;
  if (battle && hasRelic("tail-rope") && !battle.tailRopeUsed && state.run.hero.hp > 0 && state.run.hero.hp / state.run.hero.maxHp < 0.3) {
    battle.tailRopeUsed = true;
    addHeroShield(15);
    clearRandomStatus("hero", "debuff");
    log("断尾绳：获得15护盾并清除1层负面状态。");
  }
}

function winBattle() {
  const { type } = state.battle;
  if (type === "boss" && state.run.layer >= 5) {
    state.screen = "victory";
    state.battle = null;
    state.selected = [];
    log("你击败了第5层Boss，通关。");
    render();
    return;
  }
  const packs = type === "boss" ? 5 : type === "elite" ? 2 : 1;
  const joker = type === "boss" ? 5 : type === "elite" ? 3 : 2;
  const exp = type === "boss" ? 10 : type === "elite" ? 7 : 5;
  const loot = [];
  for (let i = 0; i < packs; i++) loot.push({ icon: "📦", title: packLabel(gainPack("reward").quality), text: "战斗奖励卡包" });
  state.run.joker += joker;
  loot.push({ icon: "💰", title: `${joker} Joker`, text: "战斗奖励" });
  if (hasRelic("burning-candle") && state.battle.turn <= 5) {
    state.run.joker += 1;
    loot.push({ icon: "💰", title: "1 Joker", text: "燃烧的蜡烛" });
  }
  if (hasRelic("bloodthirsty-saber") && type === "elite") {
    state.run.bloodthirstySaberStacks = Math.min(10, (state.run.bloodthirstySaberStacks || 0) + 2);
    state.run.hero.attack += 2;
    loot.push({ icon: "⚔", title: "攻击力 +2", text: "渴血弯刀" });
  }
  const upgrades = gainExp(exp);
  if (type === "elite") {
    const relic = gainRelic(false);
    if (relic) loot.push({ icon: "💎", title: relic.name, text: relic.text });
  }
  if (type === "elite" && hasRelic("broken-beast-bone")) loot.push({ icon: "📦", title: packLabel(gainPack("reward").quality), text: "破损的兽骨" });
  if (state.battle.phonographRank) {
    const card = cardById[`${state.battle.phonographRank}-${state.rng.pick(SUITS).id}`];
    state.run.backpack[card.id].count += 1;
    loot.push({ icon: card.symbol, title: cardLabel(card), text: "留声机" });
    log(`留声机：获得 ${cardLabel(card)}。`);
  }
  if (type === "boss") {
    const relics = [gainRelic(false), gainRelic(false)].filter(Boolean);
    for (const relic of relics) loot.push({ icon: "💎", title: relic.name, text: relic.text });
  }
  for (const effect of state.battle.specialRewards || []) applyBattleRewardEffect(effect, loot);
  state.reward = {
    title: `${nodeTypeLabel(type)}胜利`,
    loot,
    upgrades,
    lines: [`获得 ${exp} 经验`],
  };
  state.screen = "reward";
  state.battle = null;
  state.selected = [];
  log("战斗胜利。");
  render();
}

function applyBattleRewardEffect(effect, loot) {
  if (effect.type === "joker") {
    state.run.joker += effect.amount;
    loot.push({ icon: "💰", title: `${effect.amount} Joker`, text: "特殊战斗奖励" });
  }
  if (effect.type === "gainPack") {
    const pack = gainPack(effect.quality || "reward");
    loot.push({ icon: "📦", title: packLabel(pack.quality), text: "特殊战斗奖励" });
  }
  if (effect.type === "relic") {
    const relic = gainRelic(false);
    if (relic) loot.push({ icon: "💎", title: relic.name, text: "特殊战斗奖励" });
  }
  if (effect.type === "relicRarity") {
    const relic = gainRelicByRarity(effect.rarity, false);
    if (relic) loot.push({ icon: "💎", title: relic.name, text: "特殊战斗奖励" });
  }
  if (effect.type === "fixedRelic") {
    const alreadyOwned = state.run.relics.includes(effect.id);
    if (alreadyOwned && effect.fallback === "twoRelics") {
      [gainRelic(false), gainRelic(false)].filter(Boolean).forEach((relic) => loot.push({ icon: "💎", title: relic.name, text: "特殊战斗奖励" }));
      return;
    }
    addRelic(effect.id);
    const relic = RELICS.find((item) => item.id === effect.id);
    if (relic) loot.push({ icon: "💎", title: relic.name, text: "特殊战斗奖励" });
  }
}

function gainExp(amount) {
  const hero = state.run.hero;
  const upgrades = [];
  hero.exp += amount;
  while (hero.level < 8 && hero.exp >= expRequiredForLevel(hero.level)) {
    hero.exp -= expRequiredForLevel(hero.level);
    hero.level += 1;
    hero.attack += 1;
    hero.defense += 5;
    hero.maxHp += 5;
    hero.hp += 5;
    const rewards = ["攻击力 +1", "防御力 +5", "最大生命 +5", `获得 ${packLabel(gainPack("reward").quality)}`];
    if ([2, 4, 6].includes(hero.level)) hero.baseFocus += 1;
    if ([2, 4, 6].includes(hero.level)) rewards.push("调度点上限 +1");
    if (hero.level === 3 || hero.level === 5) {
      const relic = gainRelic(false);
      if (relic) rewards.push(`随机藏品：${relic.name}`);
    }
    if (hero.level === 8) {
      for (let i = 0; i < 3; i++) {
        const relic = gainRelic(false);
        if (relic) rewards.push(`随机藏品：${relic.name}`);
      }
    }
    upgrades.push({ level: hero.level, rewards });
    log(`升级到 Lv.${hero.level}`);
  }
  return upgrades;
}

function expRequiredForLevel(level) {
  return [0, 10, 12, 14, 16, 18, 20, 22][level] || Infinity;
}

function heroExpText(hero = state.run.hero) {
  return hero.level >= 8 ? "MAX" : `${hero.exp}/${expRequiredForLevel(hero.level)}`;
}

function gainPack(quality = state.run.layer) {
  const finalQuality = quality === "reward" ? rollRewardPackQuality() : quality;
  const pack = { id: makeRunId("pack"), quality: finalQuality };
  state.run.unopenedPacks.push(pack);
  return pack;
}

function rollRewardPackQuality() {
  if (state.rng.next() < 0.84) return state.run.layer;
  return state.rng.pick([1, 2, 3, 4, 5].filter((quality) => quality !== state.run.layer));
}

function openPack(packId) {
  const run = state.run;
  const pack = run.unopenedPacks.find((p) => p.id === packId);
  if (!pack || state.screen === "battle" || state.screen === "reward") return;
  run.unopenedPacks = run.unopenedPacks.filter((p) => p.id !== packId);
  const gained = [];
  const cardCount = hasRelic("pack-knife") ? 5 : 4;
  for (let i = 0; i < cardCount; i++) {
    const card = rollPackCard(pack.quality);
    run.backpack[card.id].count += 1;
    gained.push(cardLabel(card));
  }
  const joker = state.rng.next() < 0.1;
  if (joker) run.joker += 1;
  state.reward = {
    title: `打开${packLabel(pack.quality)}`,
    loot: [
      ...gained.map((label) => ({ icon: "🃏", title: label, text: "加入大背包" })),
      ...(joker ? [{ icon: "💰", title: "1 Joker", text: "额外奖励" }] : []),
    ],
    lines: [`获得：${gained.join("、")}`, joker ? "额外获得 1 Joker" : "未触发额外 Joker"],
    returnScreen: state.screen,
  };
  state.screen = "reward";
  log(`打开 ${packLabel(pack.quality)}：${gained.join("、")}${joker ? "，额外1 Joker" : ""}。`);
  render();
}

function rollPackCard(quality) {
  const pool = packUpRanks(quality);
  const rank = state.rng.next() < 0.84 ? state.rng.pick(pool) : state.rng.pick(RANKS.filter((r) => !pool.includes(r)));
  return cardById[`${rank}-${state.rng.pick(SUITS).id}`];
}

function gainRelic(renderNow = true) {
  const relic = pickRelic();
  if (!relic) return null;
  addRelic(relic.id);
  log(`获得藏品：${relic.name}`);
  if (renderNow) {
    state.reward = {
      title: "获得藏品",
      loot: [{ icon: "💎", title: relic.name, text: relic.text }],
      lines: [`${relic.name}：${relic.text}`],
    };
    state.screen = "reward";
  }
  return relic;
}

function gainRelicByRarity(rarity, renderNow = false) {
  const relic = pickRelic((item) => item.rarity === rarity) || pickRelic();
  if (!relic) return null;
  addRelic(relic.id);
  log(`获得藏品：${relic.name}`);
  if (renderNow) {
    state.reward = {
      title: "获得藏品",
      loot: [{ icon: "💎", title: relic.name, text: relic.text }],
      lines: [`${relic.name}：${relic.text}`],
    };
    state.screen = "reward";
  }
  return relic;
}

function pickRelic(filter = () => true) {
  const candidates = RELICS.filter((r) => !state.run.relics.includes(r.id) && filter(r));
  if (!candidates.length) return null;
  return state.rng.pick(candidates);
}

function makeRelicChoice(count = 2, title = "选择藏品", filter = () => true) {
  const pool = state.rng.shuffle(RELICS.filter((r) => !state.run.relics.includes(r.id) && filter(r)));
  const choices = pool.slice(0, count);
  if (!choices.length) return false;
  state.pendingRelicChoice = { title, choices: choices.map((relic) => relic.id) };
  state.screen = "relic-choice";
  return true;
}

function makeFixedRelicChoice(ids, title = "选择藏品") {
  const choices = ids.filter((id) => RELICS.some((relic) => relic.id === id) && !state.run.relics.includes(id));
  if (!choices.length) return false;
  state.pendingRelicChoice = { title, choices };
  state.screen = "relic-choice";
  return true;
}

function addRelic(id) {
  if (state.run.relics.includes(id)) return;
  state.run.relics.push(id);
  applyRelicHooks("gain", { relicId: id });
}

function hasRelic(id) {
  return state.run.relics.includes(id);
}

function applyRelicHooks(trigger, context = {}) {
  if (!state.run) return;
  const hooks = state.run.relics
    .map((id) => RELICS.find((relic) => relic.id === id))
    .flatMap((relic) => (relic?.effects || [])
      .filter((effect) => effect.trigger === trigger)
      .map((effect) => ({ relic, effect })));
  for (const { relic, effect } of hooks) {
    if (trigger === "gain" && context.relicId && relic.id !== context.relicId) continue;
    if (!matchesRelicCondition(effect, context)) continue;
    applyRelicHook(effect, context);
  }
}

function matchesRelicCondition(effect, context) {
  const { hand, cards = [] } = context;
  if (effect.hand && hand?.name !== effect.hand) return false;
  if (effect.notHand && hand?.name === effect.notHand) return false;
  if (effect.minSuit) {
    const suitCounts = countBy(cards, "suit");
    if ((suitCounts[effect.minSuit.suit] || 0) < effect.minSuit.count) return false;
  }
  if (effect.maxRankValue && cards.some((card) => RANK_VALUE[card.rank] > effect.maxRankValue)) return false;
  if (effect.minRankCount) {
    const count = cards.filter((card) => card.rank === effect.minRankCount.rank).length;
    if (count < effect.minRankCount.count) return false;
  }
  return true;
}

function applyRelicHook(effect, context) {
  const battle = state.battle;
  if (effect.type === "shield" && battle) addHeroShield(effect.amount);
  if (effect.type === "focus" && battle) battle.focus += effect.amount;
  if (effect.type === "extraConsume" && battle) battle.extraConsume += effect.amount;
  if (effect.type === "charge" && battle) gainCharge(effect.amount);
  if (effect.type === "joker") state.run.joker += effect.amount;
  if (effect.type === "freeTraverse") state.run.freeTraverse += effect.amount;
  if (effect.type === "stat") applyPermanentStat(effect.stat, effect.amount);
  if (effect.type === "gainPack") gainPack(effect.quality || "reward");
  if (effect.type === "heal") state.run.hero.hp = Math.min(state.run.hero.maxHp, state.run.hero.hp + ceil(state.run.hero.maxHp * (effect.ratio || 0) + (effect.flat || 0)));
  if (effect.type === "fixedDamage") {
    const target = context.target?.hp > 0 ? context.target : liveEnemies()[0];
    if (target) applyEnemyDamage(target, effect.amount);
  }
}

function openShop() {
  if (hasRelic("clearance-doc")) state.run.joker += 3;
  state.run.shop = createShop();
  state.screen = "shop";
}

function createShop(previousRelicIds = []) {
  return {
    refreshCount: 0,
    previousRelicIds,
    relics: rollShopRelics(previousRelicIds),
    packs: rollShopPacks(),
  };
}

function rollShopRelics(previousRelicIds = []) {
  const owned = new Set(state.run.relics);
  const previous = new Set(previousRelicIds);
  const candidates = RELICS.filter((relic) => !owned.has(relic.id) && !previous.has(relic.id));
  return state.rng.shuffle(candidates).slice(0, 5).map((relic) => ({ id: relic.id, sold: false }));
}

function rollShopPacks() {
  return Array.from({ length: 2 }, () => {
    if (state.rng.next() < 0.3) return { quality: state.rng.int(1, 5), fixed: true, sold: false };
    return { quality: "random", fixed: false, sold: false };
  });
}

function refreshShop() {
  const shop = state.run.shop;
  const cost = shopRefreshCost(shop);
  if (state.run.joker < cost) return;
  state.run.joker -= cost;
  shop.refreshCount += 1;
  const previousRelicIds = shop.relics.filter((slot) => !slot.sold).map((slot) => slot.id);
  state.run.shop = createShop(previousRelicIds);
  state.run.shop.refreshCount = shop.refreshCount;
  log(`商店刷新，消耗 ${cost} Joker。`);
  render();
}

function shopRefreshCost(shop) {
  let cost = shop.refreshCount === 0 ? 0 : shop.refreshCount * 2;
  return cost;
}

function buyShopRelic(index) {
  const slot = state.run.shop?.relics[index];
  if (!slot || slot.sold) return;
  const relic = RELICS.find((item) => item.id === slot.id);
  const price = relicPrice(relic);
  if (state.run.joker < price) return;
  state.run.joker -= price;
  addRelic(relic.id);
  slot.sold = true;
  log(`购买藏品：${relic.name}`);
  render();
}

function buyShopPack(index) {
  const slot = state.run.shop?.packs[index];
  if (!slot || slot.sold) return;
  const price = slot.fixed ? 2 : 1;
  if (state.run.joker < price) return;
  state.run.joker -= price;
  gainPack(slot.fixed ? slot.quality : rollRewardPackQuality());
  slot.sold = true;
  log(`购买${slot.fixed ? packLabel(slot.quality) : "随机卡包"}。`);
  render();
}

function sellShopPack(packId) {
  const run = state.run;
  const index = run.unopenedPacks.findIndex((pack) => pack.id === packId);
  if (index < 0) return;
  const [pack] = run.unopenedPacks.splice(index, 1);
  run.joker += 1;
  run.wornBackpackSoldLayers ||= [];
  if (hasRelic("worn-backpack") && !run.wornBackpackSoldLayers.includes(run.layer)) {
    run.wornBackpackSoldLayers.push(run.layer);
    run.joker += 1;
    log("破旧背包：本层第一次出售卡包额外获得 1 Joker。");
  }
  log(`出售${packLabel(pack.quality)}，获得 1 Joker。`);
  render();
}

function relicPrice(relic) {
  const base = ({ common: 2, rare: 3, epic: 5, legendary: 7 })[relic?.rarity] || 2;
  return hasRelic("legendary-banknote") ? ceil(base / 2) : base;
}

function openUpgrade() {
  if (hasRelic("table-trapdoor")) gainPack("reward");
  state.craftSelection = [];
  state.screen = "upgrade";
}

function openBackpack() {
  if (state.screen === "battle" || state.screen === "reward") {
    log("战斗中不能打开背包或调整卡册。");
    render();
    return;
  }
  state.screen = "backpack";
  render();
}

function openPackManager() {
  if (state.screen === "battle" || state.screen === "reward") {
    log("战斗中不能打开卡包。");
    render();
    return;
  }
  state.previousScreen = state.screen;
  state.screen = "packs";
  render();
}

function toggleAlbumCard(cardId) {
  const run = state.run;
  const owned = run.backpack[cardId]?.count > 0;
  if (!owned) return;
  if (run.album.includes(cardId)) {
    run.album = run.album.filter((id) => id !== cardId);
    log(`从卡册移除 ${cardLabel(cardById[cardId])}。`);
  } else if (run.album.length < 26) {
    run.album.push(cardId);
    log(`装入卡册 ${cardLabel(cardById[cardId])}。`);
  } else {
    log("卡册已满，需要先移除一张牌。");
  }
  render();
}

function upgradeCard(cardId) {
  const item = state.run.backpack[cardId];
  const max = maxCardLevel(cardId);
  if (!item || item.level >= max) return;
  const beforeLevel = item.level;
  const cost = Math.max(0, (item.level === 5 ? 6 : item.level) - (hasRelic("wild-card") ? 1 : 0));
  const spare = item.count - 1;
  if (spare < cost) return;
  item.count -= cost;
  item.level += 1;
  state.run.upgradeCount = (state.run.upgradeCount || 0) + 1;
  if (hasRelic("joker-ledger") && state.run.upgradeCount % 3 === 0) {
    state.run.joker += 1;
    log("小丑账本：获得 1 Joker。");
  }
  log(`${cardLabel(cardById[cardId])} 升到 Lv.${item.level}`);
  state.reward = {
    title: "升级完成",
    loot: [{ icon: cardById[cardId].symbol, title: cardLabel(cardById[cardId]), text: `Lv.${beforeLevel} → Lv.${item.level}，消耗 ${cost} 张` }],
    lines: [`${cardLabel(cardById[cardId])} 升到 Lv.${item.level}`],
    returnScreen: "upgrade",
  };
  state.screen = "reward";
  render();
}

function packUpRanks(quality) {
  return {
    1: ["2", "3", "4"],
    2: ["5", "6", "7"],
    3: ["8", "9", "10"],
    4: ["J", "Q", "K"],
    5: ["A"],
  }[quality] || ["2", "3", "4"];
}

function selectedCraftCount(cardId) {
  return (state.craftSelection || []).filter((id) => id === cardId).length;
}

function craftableCopies(cardId) {
  const item = state.run.backpack[cardId];
  if (!item) return 0;
  return Math.max(0, item.count - 1 - selectedCraftCount(cardId));
}

function toggleCraftCard(cardId) {
  state.craftSelection ||= [];
  const index = state.craftSelection.indexOf(cardId);
  if (index >= 0) {
    state.craftSelection.splice(index, 1);
  } else if (state.craftSelection.length < 3 && craftableCopies(cardId) > 0) {
    state.craftSelection.push(cardId);
  }
  render();
}

function craftLayerUpCard() {
  const selected = state.craftSelection || [];
  if (selected.length !== 3) return;
  const counts = countBy(selected.map((id) => ({ id })), "id");
  for (const [id, count] of Object.entries(counts)) {
    const item = state.run.backpack[id];
    if (!item || item.count - 1 < count) return;
  }
  for (const [id, count] of Object.entries(counts)) state.run.backpack[id].count -= count;
  const rank = state.rng.pick(packUpRanks(state.run.layer));
  const suit = state.rng.pick(SUITS).id;
  const gained = cardById[`${rank}-${suit}`];
  state.run.backpack[gained.id].count += 1;
  state.craftSelection = [];
  log(`制牌室：消耗3张多余牌，获得 ${cardLabel(gained)}。`);
  state.reward = {
    title: "制牌完成",
    loot: [{ icon: gained.symbol, title: cardLabel(gained), text: `${state.run.layer}层UP牌` }],
    lines: [`获得 ${cardLabel(gained)}`],
    returnScreen: "upgrade",
  };
  state.screen = "reward";
  render();
}

function maxCardLevel(cardId) {
  return cardById[cardId]?.rank === "A" ? 6 : 5;
}

function upgradeCardFree(cardId) {
  const item = state.run.backpack[cardId];
  if (!item || item.level >= maxCardLevel(cardId)) return false;
  item.level += 1;
  log(`${cardLabel(cardById[cardId])} 免费升级到 Lv.${item.level}。`);
  return true;
}

function duplicateBackpackCard(cardId) {
  const item = state.run.backpack[cardId];
  if (!item) return false;
  item.count += 1;
  log(`复制 ${cardLabel(cardById[cardId])}，当前 ${item.count} 张。`);
  return true;
}

function openEvent() {
  const candidates = EVENTS.filter((event) => event.minLayer <= state.run.layer && (event.maxLayer ?? event.minLayer) >= state.run.layer);
  state.event = state.rng.pick(candidates);
  state.screen = "event";
}

function chooseEventOption(index) {
  const event = state.event;
  const option = event?.options[index];
  if (!event || !option || !eventOptionAvailable(option)) return;
  const effectResult = applyEventEffects(option.effects || [], option.result);
  log(`事件：${event.title}，选择「${option.label}」。`);
  state.event = null;
  if (effectResult.pending) {
    render();
    return;
  }
  if (state.screen === "battle") {
    render();
    return;
  }
  if (state.screen === "shop") {
    render();
    return;
  }
  state.reward = { title: event.title, lines: [option.result], upgrades: effectResult.upgrades };
  state.screen = "reward";
  render();
}

function eventOptionAvailable(option) {
  return !eventOptionDisabledReason(option);
}

function eventOptionDisabledReason(option) {
  for (const requirement of option.requires || []) {
    if (requirement.type === "hpGreaterThan" && state.run.hero.hp <= requirement.amount) {
      return `生命值需要大于 ${requirement.amount}`;
    }
    if (requirement.type === "jokerAtLeast" && state.run.joker < requirement.amount) {
      return `需要 ${requirement.amount} Joker`;
    }
    if (requirement.type === "packAtLeast" && state.run.unopenedPacks.length < requirement.amount) {
      return `需要 ${requirement.amount} 个未开卡包`;
    }
    if (requirement.type === "duplicateCard" && !Object.values(state.run.backpack).some((item) => item.count > 1)) {
      return "需要至少 1 张重复牌";
    }
    if (requirement.type === "noRelic" && state.run.relics.includes(requirement.id)) {
      const relic = RELICS.find((item) => item.id === requirement.id);
      return `已拥有${relic ? `「${relic.name}」` : "该藏品"}`;
    }
    if (requirement.type === "relicAtLeast" && state.run.relics.length < requirement.amount) {
      return `需要 ${requirement.amount} 个藏品`;
    }
  }
  return "";
}

function applyEventEffects(effects, resultText = "") {
  const result = { pending: false, upgrades: [] };
  for (const effect of effects) {
    if (effect.type === "gainPack") gainPack(effect.quality === "currentLayer" ? state.run.layer : effect.quality);
    if (effect.type === "nextBattleShield") state.run.hero.tempShieldNextBattle += effect.amount;
    if (effect.type === "joker") state.run.joker += effect.amount;
    if (effect.type === "exp") result.upgrades.push(...gainExp(effect.amount));
    if (effect.type === "freeTraverse") state.run.freeTraverse += effect.amount;
    if (effect.type === "spendPacks") state.run.unopenedPacks.splice(0, effect.amount);
    if (effect.type === "spendDuplicateCard") spendFirstDuplicateCard();
    if (effect.type === "spendRelic") state.run.relics.shift();
    if (effect.type === "hp") state.run.hero.hp = Math.max(1, Math.min(state.run.hero.maxHp, state.run.hero.hp + effect.amount));
    if (effect.type === "heal") state.run.hero.hp = Math.min(state.run.hero.maxHp, state.run.hero.hp + ceil(state.run.hero.maxHp * effect.ratio + effect.flat));
    if (effect.type === "stat") applyPermanentStat(effect.stat, effect.amount);
    if (effect.type === "relic") gainRelic(false);
    if (effect.type === "relicRarity") gainRelicByRarity(effect.rarity, false);
    if (effect.type === "relicChoice") {
      result.pending = makeRelicChoice(effect.count || 2, effect.title || "选择藏品");
      return result;
    }
    if (effect.type === "relicChoiceFixed") {
      result.pending = makeFixedRelicChoice(effect.ids || [], effect.title || "选择藏品");
      if (result.pending) return result;
    }
    if (effect.type === "fixedRelic") addRelic(effect.id);
    if (effect.type === "fixedRelicOrRarity") {
      if (state.run.relics.includes(effect.id)) gainRelicByRarity(effect.rarity, false);
      else addRelic(effect.id);
    }
    if (effect.type === "fixedOrRandomRelic") {
      if (state.run.relics.includes(effect.id)) gainRelic(false);
      else addRelic(effect.id);
    }
    if (effect.type === "clearHeroDebuffs" && state.battle) setStatusList("hero", getStatusList("hero").filter((status) => status.kind !== "debuff" || status.clearable === false));
    if (effect.type === "clearHeroBuff" && state.battle) clearRandomStatus("hero", "buff");
    if (effect.type === "nextBattleDebuff") state.run.nextBattleDebuff = true;
    if (effect.type === "nextBattleEnemySpeed") state.run.nextBattleEnemySpeed = (state.run.nextBattleEnemySpeed || 0) + effect.amount;
    if (effect.type === "nextBattleEnemyShield") state.run.nextBattleEnemyShield = (state.run.nextBattleEnemyShield || 0) + effect.amount;
    if (effect.type === "nextBattleVulnerable") state.run.nextBattleVulnerable = { amount: ((state.run.nextBattleVulnerable?.amount || state.run.nextBattleVulnerable || 0) + effect.amount), duration: effect.duration || Infinity };
    if (effect.type === "nextBattleRandomDebuffs") state.run.nextBattleRandomDebuffs = (state.run.nextBattleRandomDebuffs || 0) + effect.amount;
    if (effect.type === "nextBattleEnemyAttackMultiplier") state.run.nextBattleEnemyAttackMultiplier = (state.run.nextBattleEnemyAttackMultiplier || 0) + effect.amount;
    if (effect.type === "nextBattleFirstShieldCharge") state.run.hero.tempFirstShieldChargeNextBattle = (state.run.hero.tempFirstShieldChargeNextBattle || 0) + effect.amount;
    if (effect.type === "nextBattleFocus") state.run.hero.tempFocusNextBattle = (state.run.hero.tempFocusNextBattle || 0) + effect.amount;
    if (effect.type === "nextBattleExtraConsume") state.run.hero.tempExtraConsumeNextBattle = (state.run.hero.tempExtraConsumeNextBattle || 0) + effect.amount;
    if (effect.type === "nextEliteBossShield") state.run.hero.tempEliteBossShield = (state.run.hero.tempEliteBossShield || 0) + effect.amount;
    if (effect.type === "nextBossShield") state.run.hero.tempBossShield = (state.run.hero.tempBossShield || 0) + effect.amount;
    if (effect.type === "nextBossEnemySpeed") state.run.nextBossEnemySpeed = (state.run.nextBossEnemySpeed || 0) + effect.amount;
    if (effect.type === "nextBossEnemySpeedStatus") state.run.nextBossEnemySpeedStatus = { amount: effect.amount, duration: effect.duration || 1 };
    if (effect.type === "nextBossEnemyDefenseMultiplier") state.run.nextBossEnemyDefenseMultiplier = { amount: effect.amount, duration: effect.duration || 2 };
    if (effect.type === "nextBossExtraConsume") state.run.hero.tempBossExtraConsume = (state.run.hero.tempBossExtraConsume || 0) + effect.amount;
    if (effect.type === "nextBossDamageDealt") state.run.nextBossDamageDealt = { amount: effect.amount, duration: effect.duration || 2 };
    if (effect.type === "scout") state.run.scoutSteps = Math.max(state.run.scoutSteps || 0, effect.steps || 1);
    if (effect.type === "openShop") openShop();
    if (effect.type === "fateCard") applyFateCard(effect.stake);
  if (effect.type === "specialBattle") {
      startBattle(effect.battleType || "elite", { specialRewards: effect.rewards || [], enemies: effect.enemies || [], rules: effect.rules || [] });
      result.pending = true;
      return result;
    }
    if (effect.type === "chooseCard") {
      state.pendingChoice = {
        action: effect.action,
        title: effect.title || "选择一张牌",
        text: effect.text || resultText,
        result: resultText,
        picks: effect.picks || 1,
        copies: effect.copies || 1,
        selected: [],
      };
      state.screen = "card-choice";
      result.pending = true;
      return result;
    }
  }
  return result;
}

function applyFateCard(stake) {
  const card = state.rng.pick(["A", "K", "Q", "J"]);
  log(`命运牌局翻出 ${card}。`);
  if (stake === "small") {
    if (card === "A") {
      gainRelic(false);
      gainRelic(false);
    }
    if (card === "K") gainRelic(false);
    if (card === "Q") gainPack(3);
    return;
  }
  if (card === "A") gainRelicByRarity("legendary", false);
  if (card === "K") {
    gainRelic(false);
    gainRelic(false);
    gainRelic(false);
  }
  if (card === "Q") gainRelic(false);
}

function spendFirstDuplicateCard() {
  const id = Object.keys(state.run.backpack).find((cardId) => state.run.backpack[cardId].count > 1);
  if (!id) return false;
  state.run.backpack[id].count -= 1;
  log(`消耗重复牌 ${cardLabel(cardById[id])}。`);
  return true;
}

function applyPermanentStat(stat, amount) {
  if (stat === "attack") state.run.hero.attack += amount;
  if (stat === "defense") state.run.hero.defense = Math.max(0, state.run.hero.defense + amount);
  if (stat === "speed") state.run.hero.speed += amount;
  if (stat === "maxHp") {
    state.run.hero.maxHp += amount;
    state.run.hero.hp += amount;
  }
  log(`基础${statLabel(stat)} ${amount > 0 ? "+" : ""}${amount}。`);
}

function statLabel(stat) {
  if (stat === "attack") return "攻击";
  if (stat === "defense") return "防御";
  if (stat === "speed") return "速度";
  if (stat === "maxHp") return "生命上限";
  return stat;
}

function evaluateHand(cards) {
  const ranks = countBy(cards, "rank");
  const counts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || RANK_ORDER[b[0]] - RANK_ORDER[a[0]]);
  const values = cards.map((c) => RANK_VALUE[c.rank]);
  const sum = values.reduce((a, b) => a + b, 0);
  const flush = new Set(cards.map((c) => c.suit)).size === 1;
  const straightInfo = getStraight(cards);
  const straight = !!straightInfo;
  const isRoyal = flush && straight && cards.some((c) => c.rank === "A") && cards.some((c) => c.rank === "10") && straightInfo.high === 14;
  if (isRoyal) return { name: "皇家同花顺", primary: 10, sequence: [10, 10, 10, 10, 10], sum, detail: "最高牌型" };
  if (flush && straight) return { name: "同花顺", primary: straightInfo.highValue, sequence: straightInfo.sequence, sum, detail: "群体五段+花色" };
  if (counts[0][1] === 4) return { name: "四条", primary: RANK_VALUE[counts[0][0]], sum, detail: `${counts[0][0]} 四条` };
  if (counts[0][1] === 3 && counts[1]?.[1] === 2) return { name: "葫芦", primary: RANK_VALUE[counts[0][0]], tripsValue: RANK_VALUE[counts[0][0]], pairValue: RANK_VALUE[counts[1][0]], sum, detail: "群体+主目标追加" };
  if (flush) return { name: "同花", primary: Math.max(...values), sum, detail: `${cards[0].suitLabel}同花，最高点数×3单体伤害` };
  if (straight) return { name: "顺子", primary: straightInfo.highValue, sequence: straightInfo.sequence, sum, detail: "单体五段" };
  if (counts[0][1] === 3) return { name: "三条", primary: RANK_VALUE[counts[0][0]], sum, detail: `${counts[0][0]} 三条，获得护盾并准备下回合减伤` };
  if (counts[0][1] === 2 && counts[1]?.[1] === 2) return { name: "两对", primary: Math.max(RANK_VALUE[counts[0][0]], RANK_VALUE[counts[1][0]]), pairValues: [RANK_VALUE[counts[0][0]], RANK_VALUE[counts[1][0]]], sum, detail: "群体伤害，并按主目标实际生命伤害获得护盾" };
  if (counts[0][1] === 2) return { name: "一对", primary: RANK_VALUE[counts[0][0]], sum, detail: `${counts[0][0]} 对子，双段单体伤害并获得护盾` };
  return { name: "高牌", primary: Math.max(...values), sum, detail: `高牌 ${Math.max(...values)}` };
}

function getStraight(cards) {
  const orders = [...new Set(cards.map((c) => RANK_ORDER[c.rank]))].sort((a, b) => a - b);
  if (orders.length !== 5) return null;
  const wheel = orders.join(",") === "2,3,4,5,14";
  if (wheel) return { high: 5, highValue: 5, sequence: [10, 2, 3, 4, 5] };
  for (let i = 1; i < orders.length; i++) if (orders[i] !== orders[0] + i) return null;
  return { high: orders[4], highValue: RANK_VALUE[cards.find((c) => RANK_ORDER[c.rank] === orders[4]).rank], sequence: orders.map((order) => RANK_VALUE[cards.find((c) => RANK_ORDER[c.rank] === order).rank]) };
}

function countBy(list, key) {
  return list.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function cardLabel(card) {
  return `${card.rank}${card.symbol}`;
}

function packLabel(q) {
  return q === "reward" ? "随机品质卡包" : `${q}级卡包`;
}

function packAsset(q) {
  const slug = q === "reward" ? "pack-reward" : `pack-tier-${q}`;
  return assetPath(`assets/packs/${slug}.${OFFICIAL_PACK_ART.has(slug) ? "png" : "svg"}`);
}

function relicAsset(relic) {
  if (relic?.id && OFFICIAL_RELIC_ART.has(relic.id)) return assetPath(`assets/relics/${relic.id}.png`);
  if (relic?.id && CORE_RELIC_ART.has(relic.id)) return assetPath(`assets/relics/${relic.id}.svg`);
  return assetPath(`assets/relics/category-${relicCategory(relic)}.svg`);
}

function relicCategory(relic) {
  const text = `${relic?.id || ""} ${relic?.name || ""} ${relic?.text || ""}`;
  if (/皇冠|权杖|红桃|黑桃|方片|梅花|花色/.test(text)) return "suit";
  if (/剑|刀|枪|匕首|破甲|攻击|伤害/.test(text)) return "weapon";
  if (/盾|甲|防御|护盾|减伤/.test(text)) return "defense";
  if (/Joker|金币|银票|账本|筹码|商店/.test(text)) return "economy";
  if (/地图|穿行|手电|路线/.test(text)) return "map";
  if (/诅咒|血契|娃娃|红线/.test(text)) return "curse";
  if (/升级|制牌|A之力|万能牌/.test(text)) return "upgrade";
  if (/调度|重抽|沙漏|罗盘/.test(text)) return "focus";
  if (/补牌|副牌|卡包|发牌/.test(text)) return "consume";
  return "poker";
}

function statusAsset(status) {
  if (status.id === "silence") return assetPath("assets/status/silence.svg");
  if (status.stat === "attack") return assetPath(`assets/status/attack-${status.value >= 0 ? "up" : "down"}.svg`);
  if (status.stat === "defense" || status.stat === "defenseMultiplier") return assetPath(`assets/status/defense-${status.value >= 0 ? "up" : "down"}.svg`);
  if (status.stat === "speed") return assetPath(`assets/status/speed-${status.value >= 0 ? "up" : "down"}.svg`);
  if (status.stat === "damageTaken") return assetPath(status.value >= 0 ? "assets/status/vulnerable.svg" : "assets/status/reduction.svg");
  if (status.stat === "damageDealt" || status.stat === "attackMultiplier") return assetPath(`assets/status/attack-${status.value >= 0 ? "up" : "down"}.svg`);
  if (/shield|护盾/.test(status.name || status.id)) return assetPath("assets/status/shield.svg");
  if (/蓄势|charge/.test(status.name || status.id)) return assetPath("assets/status/charge.svg");
  return assetPath(status.kind === "debuff" ? "assets/status/vulnerable.svg" : "assets/status/attack-up.svg");
}

function intentAsset(type) {
  const id = ({
    attack: "attack",
    multiAttack: "multi-attack",
    heavyAttack: "attack",
    chargedAttack: "attack",
    pierceAttack: "attack",
    aoe: "aoe",
    guard: "guard",
    guardAll: "guard",
    guardAttack: "guard",
    guardAttackBuff: "guard",
    defenseStance: "guard",
    healAlly: "heal",
    healAllyByAttack: "heal",
    healSelfMax: "heal",
    summon: "summon",
    attackBuff: "buff",
    speedBuff: "buff",
    growDefense: "buff",
    growMaxHpAndDefense: "buff",
    debuff: "debuff",
    slowHero: "debuff",
    vulnerableHero: "debuff",
    attackSlow: "debuff",
    weakenAttack: "debuff",
    attackWeakenDefenseByAttack: "debuff",
    cleanseAlly: "cleanse",
    cleanseSelfShield: "cleanse",
    skip: "skip",
  })[type] || "special";
  return assetPath(`assets/intents/${id}.svg`);
}

function nodeTypeLabel(type) {
  return ({ battle: "普通战斗", elite: "精英战斗", boss: "Boss", shop: "商店", upgrade: "制牌室", relic: "藏品", event: "事件" })[type] || type;
}

function render() {
  if (state.run && state.screen !== "battle") saveRun();
  const app = legacyMountTarget || document.getElementById("app");
  if (!app) return;
  unmountReactIslands();
  app.innerHTML = `
    <main class="app" style="--scene-bg: url('${sceneBackgroundAsset()}')">
      <div id="topbar-react-view"></div>
      <section class="layout">
        <div>${renderMain()}</div>
        <aside class="panel"><div id="side-react-view"></div></aside>
      </section>
      ${renderModal()}
    </main>
  `;
  bindEvents();
  mountReactIslands();
}

function unmountReactIslands() {
  backpackViewRoot?.unmount();
  backpackViewRoot = null;
  battleViewRoot?.unmount();
  battleViewRoot = null;
  cardChoiceViewRoot?.unmount();
  cardChoiceViewRoot = null;
  eventViewRoot?.unmount();
  eventViewRoot = null;
  mapViewRoot?.unmount();
  mapViewRoot = null;
  packManagerViewRoot?.unmount();
  packManagerViewRoot = null;
  rewardViewRoot?.unmount();
  rewardViewRoot = null;
  relicChoiceViewRoot?.unmount();
  relicChoiceViewRoot = null;
  sideViewRoot?.unmount();
  sideViewRoot = null;
  shopViewRoot?.unmount();
  shopViewRoot = null;
  topbarViewRoot?.unmount();
  topbarViewRoot = null;
  upgradeViewRoot?.unmount();
  upgradeViewRoot = null;
}

function mountReactIslands() {
  const topbarTarget = document.getElementById("topbar-react-view");
  if (topbarTarget) {
    topbarViewRoot = createRoot(topbarTarget);
    topbarViewRoot.render(React.createElement(TopbarView, buildTopbarViewProps()));
  }
  const sideTarget = document.getElementById("side-react-view");
  if (sideTarget) {
    sideViewRoot = createRoot(sideTarget);
    sideViewRoot.render(React.createElement(SideView, buildSideViewProps()));
  }
  if ((state.screen === "backpack" || state.screen === "album") && state.run) {
    const target = document.getElementById("backpack-react-view");
    if (!target) return;
    backpackViewRoot = createRoot(target);
    backpackViewRoot.render(React.createElement(BackpackView, buildBackpackViewProps()));
    return;
  }
  if (state.screen === "battle" && state.battle) {
    const target = document.getElementById("battle-react-view");
    if (!target) return;
    battleViewRoot = createRoot(target);
    battleViewRoot.render(React.createElement(BattleView, buildBattleViewProps()));
    return;
  }
  if (state.screen === "card-choice" && state.pendingChoice) {
    const target = document.getElementById("card-choice-react-view");
    if (!target) return;
    cardChoiceViewRoot = createRoot(target);
    cardChoiceViewRoot.render(React.createElement(CardChoiceView, buildCardChoiceViewProps()));
    return;
  }
  if (state.screen === "map" && state.run) {
    const target = document.getElementById("map-react-view");
    if (!target) return;
    mapViewRoot = createRoot(target);
    mapViewRoot.render(React.createElement(MapView, buildMapViewProps()));
    return;
  }
  if (state.screen === "packs" && state.run) {
    const target = document.getElementById("packs-react-view");
    if (!target) return;
    packManagerViewRoot = createRoot(target);
    packManagerViewRoot.render(React.createElement(PackManagerView, buildPackManagerViewProps()));
    return;
  }
  if (state.screen === "event" && state.event) {
    const target = document.getElementById("event-react-view");
    if (!target) return;
    eventViewRoot = createRoot(target);
    eventViewRoot.render(React.createElement(EventView, buildEventViewProps()));
    return;
  }
  if (state.screen === "reward" && state.reward) {
    const target = document.getElementById("reward-react-view");
    if (!target) return;
    rewardViewRoot = createRoot(target);
    rewardViewRoot.render(React.createElement(RewardView, buildRewardViewProps()));
    return;
  }
  if (state.screen === "relic-choice" && state.pendingRelicChoice) {
    const target = document.getElementById("relic-choice-react-view");
    if (!target) return;
    relicChoiceViewRoot = createRoot(target);
    relicChoiceViewRoot.render(React.createElement(RelicChoiceView, buildRelicChoiceViewProps()));
    return;
  }
  if (state.screen === "shop" && state.run) {
    const target = document.getElementById("shop-react-view");
    if (!target) return;
    shopViewRoot = createRoot(target);
    shopViewRoot.render(React.createElement(ShopView, buildShopViewProps()));
    return;
  }
  if (state.screen === "upgrade" && state.run) {
    const target = document.getElementById("upgrade-react-view");
    if (!target) return;
    upgradeViewRoot = createRoot(target);
    upgradeViewRoot.render(React.createElement(UpgradeView, buildUpgradeViewProps()));
  }
}

function sceneBackgroundAsset() {
  if (!state.run) return backgroundAsset("battle-common");
  if (state.screen === "battle") return backgroundAsset(state.battle?.type === "boss" ? "battle-boss" : "battle-common");
  const names = {
    1: "layer-1-rabbit-hole",
    2: "layer-2-tea-table",
    3: "layer-3-heart-garden",
    4: "layer-4-mirror-board",
    5: "layer-5-trial-court",
  };
  return backgroundAsset(names[state.run.layer] || "battle-common");
}

function renderTopbar() {
  return '<div id="topbar-react-view"></div>';
}

function buildTopbarViewProps() {
  const run = state.run;
  const h = run?.hero;
  return {
    visible: Boolean(run && h),
    seed: run?.seed || "",
    layer: run?.layer || 1,
    nodeCount: run?.nodeCount || 0,
    stats: h ? [
      { label: "生命", value: `${h.hp}/${h.maxHp}` },
      { label: "攻", value: h.attack },
      { label: "防", value: h.defense },
      { label: "速", value: h.speed },
      { label: "Lv", value: `${h.level}${h.level >= 8 ? " MAX" : ""}` },
      { label: "Exp", value: heroExpText(h) },
      { label: "Joker", value: run.joker },
    ] : [],
    onOpenGuide: openGuide,
    onSave: saveAndRender,
  };
}

function renderMain() {
  if (!state.run) return renderStart();
  if (state.screen === "battle") return renderBattle();
  if (state.screen === "map") return renderMap();
  if (state.screen === "lab") return renderLab();
  if (state.screen === "reward") return renderReward();
  if (state.screen === "event") return renderEvent();
  if (state.screen === "card-choice") return renderCardChoice();
  if (state.screen === "relic-choice") return renderRelicChoice();
  if (state.screen === "shop") return renderShop();
  if (state.screen === "upgrade") return renderUpgrade();
  if (state.screen === "backpack") return renderBackpack();
  if (state.screen === "album") return renderBackpack();
  if (state.screen === "packs") return renderPackManager();
  if (state.screen === "victory") return renderEnding("victory");
  if (state.screen === "defeat") return renderEnding("defeat");
  return "";
}

function renderStart() {
  const hasSave = Boolean(localStorage.getItem(SAVE_KEY));
  return `
    <section class="panel start-panel">
      <div class="start-copy">
        <span class="eyebrow">Static Web Roguelike Prototype</span>
        <h2>梦境牌国：持牌人原型</h2>
        <p>用德州扑克牌型、卡册构筑、卡包经济、地图路线、藏品联动和怪物意图系统组成的一局制肉鸽原型。</p>
        <div class="start-actions">
          <input id="seedInput" value="${state.seed}" aria-label="Seed" />
          <button class="primary-action" data-start>开始一局</button>
          <button data-load-save ${hasSave ? "" : "disabled"}>读取存档</button>
          <button data-open-guide>规则速览</button>
        </div>
      </div>
      <div class="start-showcase">
        <div class="showcase-card main-card">
          <strong>A♠</strong>
          <span>Lv.6 · 破防</span>
        </div>
        <div class="showcase-card red">
          <strong>10♥</strong>
          <span>同花回血</span>
        </div>
        <div class="showcase-card">
          <strong>K♣</strong>
          <span>梅花增伤</span>
        </div>
      </div>
      <div class="start-features">
        <span>52种牌大背包</span>
        <span>26格卡册构筑</span>
        <span>5层路线地图</span>
        <span>完整静态部署</span>
      </div>
    </section>
  `;
}

function renderEnding(type) {
  const victory = type === "victory";
  const h = state.run.hero;
  return `
    <section class="panel ending-panel ${victory ? "victory" : "defeat"}">
      <span class="eyebrow">${victory ? "Run Cleared" : "Run Ended"}</span>
      <h2>${victory ? "通关" : "失败"}</h2>
      <p>${victory ? "你离开了审判牌庭，牌册里的每张牌都记下了这次路线。" : "梦境吞没了这次牌局，但规则、资源和路线仍然完整保留在下一次尝试里。"}</p>
      <div class="ending-stats">
        <span>层数 <strong>${state.run.layer}</strong></span>
        <span>节点 <strong>${state.run.nodeCount}</strong></span>
        <span>等级 <strong>${h.level}${h.level >= 8 ? " MAX" : ""}</strong></span>
        <span>藏品 <strong>${state.run.relics.length}</strong></span>
        <span>Joker <strong>${state.run.joker}</strong></span>
        <span>Seed <strong>${state.run.seed}</strong></span>
      </div>
      <div class="screen-actions">
        <button class="primary-action" data-new-run>${victory ? "再开一局" : "重新开始"}</button>
        <button data-open-lab>查看实验室</button>
      </div>
    </section>
  `;
}

function renderBattle() {
  return '<div id="battle-react-view"></div>';
}

function buildBattleViewProps() {
  const b = state.battle;
  const target = getTargetEnemy();
  const hasFreeReroll = b.freeRerolls > 0 || b.freeRerollThisTurn || (hasRelic("old-deal-box") && !b.freeRerollUsed);
  const rerollCost = hasFreeReroll ? 0 : 1 + (b.rerollTaxNext || 0);
  return {
    title: `${nodeTypeLabel(b.type)} · 回合 ${b.turn}`,
    subtitle: "选择5张牌组成牌型，第一张会作为保留牌回到手牌。",
    deck: {
      draw: b.draw.length,
      discard: b.discard.length,
      focus: b.focus,
      extraConsume: b.extraConsume,
    },
    tactical: {
      speedOrderHtml: renderSpeedOrder(),
      targetName: target ? target.name : "无",
      rerollCostText: rerollCost === 0 ? "免费" : `${rerollCost} 调度点`,
      keepCardText: selectedCards()[0] ? cardLabel(selectedCards()[0]) : "选择第1张",
    },
    combatSummaryHtml: renderCombatSummary(),
    stage: buildBattleStageProps(),
    cards: buildBattleCardsProps(),
    control: buildBattleControlProps(),
  };
}

function buildBattleStageProps() {
  const h = state.run.hero;
  const statusText = renderStatusText("hero");
  const hit = lastEnemyEffects().some((effect) => ["damage", "hp-damage", "shield-damage"].includes(effect.type));
  return {
    hero: {
      artSrc: assetPath("assets/characters/holder-hero.png"),
      levelText: `Lv.${h.level}${h.level >= 8 ? " MAX" : ""}`,
      hp: h.hp,
      maxHp: h.maxHp,
      attack: h.attack + getHeroAttackBonus(),
      defense: h.defense + getHeroDefenseBonus(),
      speed: h.speed,
      shield: state.battle.shield,
      recentHit: hit,
      statusHtml: renderStatusStrip("hero", statusText),
      onShowStatus: () => openDetailModal("status", "hero"),
    },
    enemies: state.battle.enemies.map((enemy) => {
      const selected = state.battle?.targetId === enemy.id;
      const enemyStatusText = renderStatusText(enemy);
      const traitSummary = enemyTraitSummary(enemy);
      const intent = enemy.intent;
      return {
        id: enemy.id,
        name: enemy.name,
        artSrc: unitAsset(enemy),
        hp: enemy.hp,
        maxHp: enemy.maxHp,
        attack: enemy.attack,
        defense: enemy.defense,
        shield: enemy.shield,
        speed: effectiveSpeed(enemy),
        selected,
        boss: enemy.boss,
        elite: enemy.elite,
        dead: enemy.hp <= 0,
        statusHtml: renderStatusStrip(enemy.id, enemyStatusText),
        intentTypeLabel: intentTypeLabel(intent?.type),
        intentDetail: intentDetailText(intent, enemy),
        intentIconHtml: renderIntentIcon(enemy.intent?.type),
        traitSummary,
        onSelect: () => selectTarget(enemy.id),
        onShowIntent: () => openDetailModal("intent", enemy.id),
        onShowTrait: () => openDetailModal("trait", enemy.id),
        onShowStatus: () => openDetailModal("status", enemy.id),
      };
    }),
  };
}

function buildBattleCardsProps() {
  return {
    frameSrc: assetPath("assets/cards/card-frame-front.svg"),
    selectedCards: selectedCards().map(cardView),
    handCards: state.battle.hand.map(cardView),
    selectedCount: state.selected.length,
    onToggleCard: toggleCard,
  };
}

function buildBattleControlProps() {
  const b = state.battle;
  const hasFreeReroll = b.freeRerolls > 0 || b.freeRerollThisTurn || (hasRelic("old-deal-box") && !b.freeRerollUsed);
  const rerollCost = hasFreeReroll ? 0 : 1 + (b.rerollTaxNext || 0);
  return {
    preview: buildBattlePreviewProps(),
    actions: {
      canPlay: state.selected.length === 5,
      canReroll: state.selected.length === 3 && b.focus >= rerollCost && !b.swapChoice,
      canTempConsume: canOpenTempConsume(),
      tempHint: tempConsumeHint(),
      onPlay: playSelected,
      onPickSuggestion: pickSuggestedHand,
      onReroll: reroll,
      onOpenTempConsume: openTempConsumeModal,
      onClear: () => {
        state.selected = [];
        render();
      },
    },
  };
}

function buildBattlePreviewProps() {
  const suggestion = chooseBestHand(state.battle.hand);
  const suggestedHand = suggestion.length === 5 ? evaluateHand(suggestion) : null;
  const cards = selectedCards();
  if (cards.length !== 5) {
    return {
      ready: false,
      suggestionText: suggestedHand ? `${suggestedHand.name} · ${suggestedHand.detail}` : "手牌不足",
    };
  }
  const hand = evaluateHand(cards);
  const target = getTargetEnemy();
  const rankPower = cards.reduce((sum, card) => sum + getPlayedCardPower(card), 0);
  const pierce = Math.min(0.6, rankPower * 0.025);
  const bonus = getDamageBonus(hand, cards) + getHeroDamageDealtBonus();
  const events = getDamageEvents(hand);
  const targetDefense = target ? effectiveDefense(target) : 0;
  const heroAtk = state.run.hero.attack + state.battle.aPower + getHeroAttackBonus();
  const damage = target ? events.map((event) => computeDamage(heroAtk + event.power, targetDefense, pierce, bonus + enemyDamageTakenBonus(target))) : [];
  const suitText = suitPreviewText(cards, hand);
  const relicTriggers = previewRelicTriggers(hand, cards);
  const damageText = damage.length ? events.map((event, index) => `${event.aoe ? "群体" : "单体"} 倍率${event.power} → 主目标${damage[index]}`).join(" / ") : "无牌型伤害";
  const targetDamage = damage.reduce((sum, item) => sum + item, 0);
  const targetHpDamage = simulateHpDamage(damage, target);
  const effectiveTargetDefense = target ? Math.max(0, Math.round(targetDefense * (1 - pierce))) : 0;
  return {
    ready: true,
    suggestionText: "",
    handName: hand.name,
    handDetail: hand.detail,
    targetText: target ? target.name : "无目标",
    targetDamage: targetDamage || "-",
    damageText,
    piercePercent: Math.round(pierce * 100),
    pierceText: `牌力 ${rankPower}${target ? ` · 防御 ${targetDefense}→${effectiveTargetDefense}` : ""}`,
    suitState: suitText.includes("未触发") ? "未触发" : "触发",
    suitText,
    keepCard: cardLabel(cards[0]),
    discardText: cards.slice(1).map(cardLabel).join(" "),
    ruleGroups: [
      { title: "本次牌型会做什么", lines: handRuleLines(hand, cards, target, { heroAtk, damage, targetHpDamage }) },
      { title: "花色/后续效果", lines: suitRuleLines(hand, cards) },
    ],
    relicTriggers,
  };
}

function cardView(card) {
  return {
    uid: card.uid,
    rank: card.rank,
    symbol: card.symbol,
    color: card.color,
    level: state.run.backpack[card.id]?.level || 1,
    power: getPlayedCardPower(card),
    selectedIndex: state.selected.indexOf(card.uid),
  };
}

function renderSpeedOrder() {
  const units = [
    { label: "持牌人", speed: effectiveSpeed("hero"), kind: "unit-hero", tie: 0 },
    ...liveEnemies().map((enemy) => ({ label: enemy.name, speed: effectiveSpeed(enemy), kind: "unit-enemy", tie: 1 })),
  ].sort((a, b) => b.speed - a.speed || a.tie - b.tie);
  return units.map((unit) => `<b class="${unit.kind}">${unit.label}(${unit.speed})</b>`).join(" → ");
}

function renderCombatSummary() {
  const enemySummary = state.battle?.lastEnemySummary;
  if (enemySummary?.reports?.length) {
    const reports = enemySummary.reports.slice(-3);
    const effects = reports.flatMap((report) => report.effects || []).slice(0, 8);
    return `
      <div class="combat-summary enemy-summary">
        <strong>${enemySummary.title}</strong>
        <span>${reports.map((report) => `${report.enemyName} · ${report.intentName}`).join(" / ")}</span>
        <em>${reports.map((report) => `${report.enemyName}：${report.text}`).join(" ｜ ")}</em>
        ${effects.length ? `<div class="feedback-chips">${effects.map(renderFeedbackChip).join("")}</div>` : ""}
      </div>
    `;
  }
  const summary = state.battle?.lastActionSummary;
  if (!summary) {
    return `
      <div class="combat-summary idle">
        <strong>等待出牌</strong>
        <span>确认出牌后，这里会显示上一手牌的结算摘要。</span>
      </div>
    `;
  }
  return `
    <div class="combat-summary player-summary">
      <strong>${summary.handName}</strong>
      <span>${summary.targetName} · ${summary.segments}段 · 生命伤害 ${summary.hpDamage}</span>
      <em>${summary.description || summary.detail}</em>
      ${summary.effects?.length ? `<div class="feedback-chips">${summary.effects.map(renderFeedbackChip).join("")}</div>` : ""}
    </div>
  `;
}

function lastEnemyEffects() {
  return (state.battle?.lastEnemySummary?.reports || []).flatMap((report) => report.effects || []);
}

function renderFeedbackChip(effect) {
  return `<span class="feedback-chip ${effect.type}">${effect.label}</span>`;
}

function enemyTraitSummary(enemy) {
  const traits = enemy?.traits || [];
  if (!traits.length) return "";
  return traits.map(traitDescription).join(" · ");
}

function traitDescription(trait) {
  return traitInfo(trait).summary;
}

function traitInfo(trait) {
  const pct = (value, fallback = 0) => `${Math.round((value ?? fallback) * 100)}%`;
  const data = {
    gainAttackOnHit: {
      name: "镜面反击",
      summary: `每次受击后攻击+${trait.amount || 1}`,
      timing: "受到牌型攻击伤害后",
      effect: `攻击力永久提高 ${trait.amount || 1} 点，当前战斗内持续生效。`,
      note: "多段攻击会按命中段数多次触发。"
    },
    roundStartShieldByDefense: {
      name: "铁箱回响",
      summary: `回合开始获得${pct(trait.ratio, 0.3)}防御护盾`,
      timing: "每个回合开始时",
      effect: `获得等于自身防御力 ${pct(trait.ratio, 0.3)} 的护盾。`,
      note: "护盾先抵挡伤害，不属于可清除状态。"
    },
    roundStartHeroAttackDown: {
      name: "迟滞档案",
      summary: `回合开始使持牌人攻击-${trait.amount || 0}`,
      timing: "每个回合开始时",
      effect: `给持牌人施加攻击力 -${trait.amount || 0}，持续1回合，可清除。`,
      note: "本回合出牌前生效，会降低牌型伤害。"
    },
    roundStartShieldIfDebuffed: {
      name: "吞印护壳",
      summary: `有负面时获得${pct(trait.ratio, 0.5)}攻击护盾`,
      timing: "回合开始时检查自身状态",
      effect: `若自身存在可清除负面状态，获得自身攻击力 ${pct(trait.ratio, 0.5)} 的护盾。`,
      note: "沉默、破防、易伤等可清除负面都能触发。"
    },
    devourHeroBuffStart: {
      name: "吞噬王冠",
      summary: "回合开始清除持牌人1个增益",
      timing: "每个回合开始时",
      effect: "随机清除持牌人1个可清除增益状态，并恢复自身生命。",
      note: "护盾、蓄势、A之力不按普通增益处理。"
    },
    shuffleRound: {
      name: "终局洗牌",
      summary: "每3回合扰乱牌序",
      timing: "第3、6、9...回合开始时",
      effect: "扰乱当前手牌顺序，增加本回合组牌阅读成本。",
      note: "只影响展示和手牌位置，不改变手牌数量。"
    },
    roundEndAttack: {
      name: "双面成长",
      summary: `回合结束攻击+${trait.amount || 1}`,
      timing: "每个回合结束时",
      effect: `攻击力永久提高 ${trait.amount || 1} 点，当前战斗内持续生效。`,
      note: "战斗拖得越久，后续攻击越危险。"
    },
    roundEndHeal: {
      name: "生命归档",
      summary: `回合结束恢复${pct(trait.ratio, 0.2)}最大生命`,
      timing: "每个回合结束时",
      effect: `恢复自身最大生命值 ${pct(trait.ratio, 0.2)} 的生命。`,
      note: "优先压低或沉默它，避免战斗被拖长。"
    },
    roundEndTeamDefenseByAttack: {
      name: "加冕守势",
      summary: "回合结束按攻击提升全体防御",
      timing: "每个回合结束时",
      effect: "敌方全体防御力提高，数值等于该单位当前攻击力。",
      note: "会让敌方队伍随回合变硬。"
    },
    shieldOnDebuff: {
      name: "负面转盾",
      summary: `被施加负面时获得${pct(trait.ratio, 0.2)}防御护盾`,
      timing: "自身被施加可清除负面状态时",
      effect: `获得自身防御力 ${pct(trait.ratio, 0.2)} 的护盾。`,
      note: "破防、沉默等控制会同时给它补护盾。"
    },
    shieldOnStraightFlush: {
      name: "同花顺防线",
      summary: `被同花顺命中后获得${pct(trait.ratio, 0.15)}最大生命护盾`,
      timing: "受到同花顺或皇家同花顺伤害后",
      effect: `获得最大生命值 ${pct(trait.ratio, 0.15)} 的护盾。`,
      note: "同花顺仍会造成伤害，但后续伤害更难打穿。"
    },
    allyDeathHealBuff: {
      name: "主教悼词",
      summary: "友方死亡后治疗并提升攻击",
      timing: "其他敌方单位死亡时",
      effect: `恢复最大生命 ${pct(trait.healRatio, 0.2)}，并按当前攻击力 ${pct(trait.attackRatio, 0.5)} 提升攻击。`,
      note: "清小怪前要注意它会被强化。"
    },
    summonDeathHeal: {
      name: "母体回收",
      summary: `召唤物死亡时恢复${pct(trait.ratio, 0.1)}最大生命`,
      timing: "自身召唤物死亡时",
      effect: `恢复最大生命值 ${pct(trait.ratio, 0.1)} 的生命。`,
      note: "清理召唤物会拖慢击杀本体。"
    },
    multiHitReduction: {
      name: "裂段装甲",
      summary: `多段伤害后续段数-${pct(trait.reduction, 0.3)}`,
      timing: "受到同一次牌型的第2段及之后伤害时",
      effect: `后续每段伤害降低 ${pct(trait.reduction, 0.3)}。`,
      note: "顺子、多段追加伤害会被明显压低。"
    },
    fastPressure: {
      name: "高速压制",
      summary: `先手攻击伤害+${pct(trait.bonus, 0.3)}`,
      timing: "自身速度高于持牌人并造成攻击时",
      effect: `本次攻击造成伤害提高 ${pct(trait.bonus, 0.3)}。`,
      note: "降低它的速度或提高自身速度可以规避。"
    },
    dullArmor: {
      name: "钝甲",
      summary: `低于${pct(trait.thresholdRatio, 0.5)}防御的单段伤害-${pct(trait.reduction, 0.2)}`,
      timing: "受到单段较低伤害时",
      effect: `若单段伤害不高于自身防御力 ${pct(trait.thresholdRatio, 0.5)}，该段伤害降低 ${pct(trait.reduction, 0.2)}。`,
      note: "更适合用高倍率单段或破防处理。"
    },
    swiftCaster: {
      name: "迅捷施法",
      summary: "高速单位，偏好干扰与连续攻击",
      timing: "选择招式时",
      effect: "更容易利用高速度先手施加干扰或多段攻击。",
      note: "优先观察它的当回合意图。"
    },
  }[trait.type];
  return data || {
    name: "特殊特性",
    summary: trait.type || "特殊特性",
    timing: "满足条件时",
    effect: trait.type || "特殊效果",
    note: "该特性尚未补充详细说明。"
  };
}

function renderStatusStrip(targetId, fallbackText) {
  const target = targetId === "hero" ? "hero" : state.battle?.enemies.find((enemy) => enemy.id === targetId);
  const statuses = getStatusList(target).filter((status) => !status.pending);
  if (!statuses.length) return `<div class="status-line muted">暂无状态</div>`;
  const chips = statuses.slice(0, 5).map((status) => {
    const kind = status.kind === "debuff" ? "debuff" : "buff";
    const stacks = status.stacks > 1 ? `×${status.stacks}` : "";
    const turns = Number.isFinite(status.remaining) ? status.remaining : "∞";
    return `<span class="status-chip ${kind}"><img src="${statusAsset(status)}" alt="" aria-hidden="true">${status.name || status.id}${stacks}<em>${turns}</em></span>`;
  }).join("");
  const more = statuses.length > 5 ? `<span class="status-chip more">+${statuses.length - 5}</span>` : "";
  return `<button class="status-line detail-button status-strip" data-detail-status="${targetId}" title="${fallbackText}">${chips}${more}</button>`;
}

function statusIcon(status) {
  if (status.id === "silence") return "☠";
  if (status.stat === "attack") return status.value >= 0 ? "⚔" : "↓";
  if (status.stat === "defense") return status.value >= 0 ? "🛡" : "↓";
  if (status.stat === "speed") return "👢";
  if (status.stat === "damageDealt") return "✦";
  if (status.stat === "damageTaken") return status.value >= 0 ? "☠" : "◇";
  return status.kind === "debuff" ? "☠" : "✦";
}

function intentIcon(type) {
  return ({
    multiAttack: "⚔⚔",
    aoe: "💥",
    guard: "🛡",
    guardAll: "🛡",
    guardAttack: "🛡",
    healAlly: "❤",
    summon: "👾",
    attackBuff: "✦",
    speedBuff: "✦",
    debuff: "☠",
    cleanseAlly: "✨",
    shield: "🔰",
    skip: "☠",
  })[type] || "⚔";
}

function renderIntentIcon(type) {
  return `<img class="intent-art" src="${intentAsset(type)}" alt="" aria-hidden="true"><span>${intentIcon(type)}</span>`;
}

function simulateHpDamage(damages, target) {
  if (!target) return 0;
  let shield = target.shield || 0;
  let hp = target.hp;
  let hpDamage = 0;
  for (const amount of damages) {
    let remaining = amount;
    const blocked = Math.min(shield, remaining);
    shield -= blocked;
    remaining -= blocked;
    const dealt = Math.min(hp, remaining);
    hp -= dealt;
    hpDamage += dealt;
  }
  return hpDamage;
}

function handRuleLines(hand, cards, target, context) {
  const layer = state.run.layer;
  const pairValues = hand.pairValues || [];
  switch (hand.name) {
    case "高牌":
      return [`造成1次单体伤害，点数倍率=${hand.primary}`];
    case "一对":
      return [`造成2次单体伤害，每次点数倍率=${hand.primary}`, `获得护盾=${context.heroAtk}当前攻击×${layer}层=${context.heroAtk * layer}`];
    case "两对":
      return [`造成1次群体伤害，点数倍率=${pairValues[0]}×${pairValues[1]}×0.35=${ceil(pairValues[0] * pairValues[1] * 0.35)}`, `获得护盾=对主目标的实际生命伤害，当前预估+${context.targetHpDamage}`];
    case "三条":
      return [`不造成伤害`, `立即获得护盾=${hand.primary}×3=${hand.primary * 3}`, "下回合开始获得受到伤害-50%，持续1回合"];
    case "顺子":
      return [`按顺序造成5段单体伤害：${hand.sequence.join(" / ")}`];
    case "同花":
      return [`造成1次单体伤害，点数倍率=最高点数${hand.primary}×3=${hand.primary * 3}`, "同时触发该花色完整效果"];
    case "葫芦":
      return [`造成1次群体伤害，倍率=${hand.tripsValue}×3+${hand.pairValue}×2=${hand.tripsValue * 3 + hand.pairValue * 2}`, `额外对主目标造成1次伤害，倍率=${hand.tripsValue}×2=${hand.tripsValue * 2}`];
    case "四条":
      return [`造成1次群体伤害，倍率=${hand.primary}×5=${hand.primary * 5}`, `额外对主目标造成1次同等伤害`, "伤害后若主目标生命低于10%，直接斩杀"];
    case "同花顺":
      return [`按顺子点数造成5段群体伤害：${hand.sequence.join(" / ")}`, "同时触发该花色完整效果"];
    case "皇家同花顺":
      return [`按同花顺造成5段群体伤害：${hand.sequence.join(" / ")}`, "同时触发该花色完整效果，并获得下回合伤害+100%"];
    default:
      return [hand.detail];
  }
}

function suitRuleLines(hand, cards) {
  const suitCounts = countBy(cards, "suit");
  const completeSuit = naturalCompleteSuit(hand, cards) || scepterCompleteSuit(hand, cards);
  const partialSuit = weakSuit(cards, hand);
  const suit = completeSuit || partialSuit;
  if (!suit) return [];
  const label = SUITS.find((item) => item.id === suit)?.label || suit;
  const full = Boolean(completeSuit);
  const layer = state.run.layer;
  const lines = [];
  if (full) lines.push(`${label}完整花色`);
  else lines.push(`${suitCounts[suit]}张${label}，触发弱花色`);
  if (suit === "heart") lines.push(full ? `回复${8 + 2 * layer}生命，获得${8 * layer}护盾` : `回复${6 + layer}生命，获得${5 * layer}护盾`);
  if (suit === "spade") lines.push(full ? "敌方全体沉默1层" : "敌方全体下回合速度-2");
  if (suit === "diamond") lines.push(full ? "获得1次任意回合免费重抽" : "下回合首次重抽免费");
  if (suit === "club") lines.push(full ? "打出时获得牌型伤害+15%，战斗内永久，可叠层" : "打出时获得攻击+1，战斗内永久，可叠层");
  return lines;
}

function previewRelicTriggers(hand, cards) {
  const triggers = [];
  const suitCounts = countBy(cards, "suit");
  const hasSuit = (suit, count) => (suitCounts[suit] || 0) >= count;
  const hasRank = (rank) => cards.some((card) => card.rank === rank);
  const fourSuits = new Set(cards.map((card) => card.suit)).size === 4;
  const add = (id, condition) => {
    if (!condition || !hasRelic(id)) return;
    const relic = RELICS.find((item) => item.id === id);
    if (relic) triggers.push(relic.name);
  };
  add("heart-crown", hasSuit("heart", 3));
  add("spade-crown", hasSuit("spade", 3));
  add("diamond-crown", hasSuit("diamond", 3));
  add("club-crown", hasSuit("club", 3));
  add("heart-scepter", hasSuit("heart", 4));
  add("spade-scepter", hasSuit("spade", 4));
  add("diamond-scepter", hasSuit("diamond", 4));
  add("club-scepter", hasSuit("club", 4));
  add("ladder", hand.name === "顺子");
  add("gold-gourd", hand.name === "葫芦");
  add("silver-gourd", hand.name === "葫芦");
  add("curse-doll", true);
  add("yin-yang-charm", hand.name === "一对");
  add("double-blades", hand.name === "一对");
  add("twins-photo", hand.name === "两对");
  add("angel-wings", hand.name === "一对");
  add("five-color-stone", fourSuits);
  add("paper-cup", true);
  add("crayon", hand.name === "同花");
  add("armor-piercer", hasRank("A"));
  add("throne-shard", hasRank("A") && cards.some((card) => card.rank === "A" && (state.run.backpack[card.id]?.level || 1) >= 6));
  add("judgement-frame", hand.name === "四条" && !state.battle.judgementFrameUsed);
  add("phonograph", hand.name === "四条" && !state.battle.phonographRank);
  add("scissors", true);
  add("royal-coin", hand.name === "顺子" && (state.battle.royalCoinTriggers || 0) < 2);
  add("echo-shield", true);
  add("dealer-chip", hand.name === "同花" && !state.battle.dealerChipFlushUsed);
  add("dealer-chip", ["同花顺", "皇家同花顺"].includes(hand.name) && !state.battle.dealerChipStraightFlushUsed);
  add("cursed-contract", ["葫芦", "四条"].includes(hand.name) && (state.battle.cursedContractTriggers || 0) < 2);
  const completeSuit = naturalCompleteSuit(hand, cards) || scepterCompleteSuit(hand, cards);
  if (completeSuit) triggers.push(`${SUITS.find((suit) => suit.id === completeSuit)?.label || completeSuit}完整花色`);
  else if (Object.values(suitCounts).some((count) => count >= 3)) triggers.push("弱花色");
  return [...new Set(triggers)];
}

function suitPreviewText(cards, hand) {
  const completeSuit = naturalCompleteSuit(hand, cards) || scepterCompleteSuit(hand, cards);
  if (completeSuit) return `${SUITS.find((item) => item.id === completeSuit)?.label || completeSuit}完整花色效果`;
  const suitCounts = countBy(cards, "suit");
  const partial = Object.entries(suitCounts).filter(([, count]) => count >= 3).sort((a, b) => b[1] - a[1])[0];
  if (!partial) return "未触发";
  const suit = SUITS.find((item) => item.id === partial[0]);
  return `${partial[1]}张${suit?.label || partial[0]} · 弱花色效果`;
}

function renderStatusText(target) {
  const statuses = getStatusList(target).filter((status) => !status.pending);
  if (!statuses.length) return "";
  return statuses.map((status) => `${status.name || status.id}${status.stacks > 1 ? `x${status.stacks}` : ""}${Number.isFinite(status.remaining) ? `(${status.remaining})` : ""}`).join(" · ");
}

function renderTempConsumeModal() {
  const free = (state.battle?.freeTempConsume || 0) > 0;
  const minCount = free ? 1 : 2;
  const options = Object.entries(state.run.backpack)
    .filter(([, item]) => item.count >= minCount)
    .slice(0, 36);
  return `
    <h2>一次性消耗补牌</h2>
    <p class="small">${free ? "方片齿轮生效：本次选择不会永久消耗大背包卡牌。" : "选择1张大背包重复牌加入本次牌型。消耗牌不提供牌力，不进入战斗牌堆。"}</p>
    <div class="modal-grid">
      ${options.map(([id, item]) => {
        const card = cardById[id];
        return `<button class="mini-card ${card.color}" data-temp-card="${id}">
          <strong>${cardLabel(card)}</strong>
          <span>余 ${free ? item.count : item.count - 1}</span>
          <span>Lv.${item.level}</span>
        </button>`;
      }).join("") || `<p class="small">${free ? "暂无可选择牌。" : "暂无可消耗重复牌。"}</p>`}
    </div>
    <div class="modal-actions">
      <button data-close-modal>取消</button>
    </div>
  `;
}

function renderSwapModal() {
  const choice = state.battle?.swapChoice;
  if (!choice) return "";
  const pool = swapPoolCards(choice);
  const canConfirm = choice.selectedHand.length === choice.selectedPool.length && choice.selectedHand.length > 0 && (!choice.exact || choice.selectedHand.length === choice.max);
  return `
      <h2>藏品触发：${choice.title}</h2>
      <p class="small">${choice.text}</p>
      <div class="swap-columns">
        <div>
          <div class="small">选择手牌</div>
          <div class="temp-grid">
            ${state.battle.hand.map((card) => `<button class="${choice.selectedHand.includes(card.uid) ? "selected" : ""}" data-swap-hand="${card.uid}">${cardLabel(card)}<br><span class="small">手牌</span></button>`).join("")}
          </div>
        </div>
        <div>
          <div class="small">选择牌堆</div>
          <div class="temp-grid">
            ${pool.map((card) => `<button class="${choice.selectedPool.includes(card.key) ? "selected" : ""}" data-swap-pool="${card.key}">${cardLabel(card)}<br><span class="small">${card.zone === "draw" ? "抽牌堆" : "弃牌堆"}</span></button>`).join("")}
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button data-confirm-swap ${canConfirm ? "" : "disabled"}>确认交换</button>
        <button data-skip-swap>跳过</button>
      </div>
  `;
}

function renderModal() {
  if (state.battle?.swapChoice) {
    return `
      <div class="modal-backdrop">
        <section class="modal" data-modal-surface>${renderSwapModal()}</section>
      </div>
    `;
  }
  if (!state.modal) return "";
  const content = state.modal.type === "temp-consume" ? renderTempConsumeModal() : state.modal.type === "node" ? renderNodeModal() : state.modal.type === "guide" ? renderGuideModal() : renderDetailModal();
  return `
    <div class="modal-backdrop" data-close-modal>
      <section class="modal" data-modal-surface>${content}</section>
    </div>
  `;
}

function renderGuideModal() {
  const guideItems = [
    { icon: "♠", title: "战斗出牌", text: "每回合手牌7张，选择5张组成德州扑克牌型。第1张会作为保留牌回到手牌，其余4张进入弃牌堆，然后补4张。", tags: ["5张成型", "首张保留", "看敌人意图"] },
    { icon: "📖", title: "卡册构筑", text: "局外从大背包中装入26种牌作为战斗卡册。每种牌最多装入1格，重复牌留在大背包用于升级、制牌或临时消耗补牌。", tags: ["26格", "52种牌", "重复牌资源"] },
    { icon: "🧭", title: "地图路线", text: "每层从左到右单向推进，只显示可抵达节点。普通路线和并行路线都用虚线连接，并行穿行通常消耗2个未开卡包。", tags: ["单向", "虚线路线", "并行消耗"] },
    { icon: "📦", title: "卡包经济", text: "战斗、商店、事件会产出卡包。卡包战斗外随时可开，提供扑克牌并有概率额外获得Joker，Joker用于商店购买和刷新。", tags: ["战斗外开包", "Joker货币", "商店刷新"] },
    { icon: "💎", title: "藏品联动", text: "藏品会修改牌型、花色、经济和路线规则。战斗中可点击藏品、状态、敌人意图查看详细说明。", tags: ["规则修改", "牌型联动", "点击详情"] },
  ];
  return `
    <div class="detail-head">
      <span class="detail-icon">?</span>
      <div>
        <h2>规则速览</h2>
        <p>先看这 5 条，就能开始理解这局牌国肉鸽。</p>
      </div>
    </div>
    <div class="guide-grid">
      ${guideItems.map((item) => `
        <section class="guide-card">
          <div class="guide-title"><span>${item.icon}</span><strong>${item.title}</strong></div>
          <p>${item.text}</p>
          <div class="guide-tags">${item.tags.map((tag) => `<b>${tag}</b>`).join("")}</div>
        </section>
      `).join("")}
    </div>
    <div class="detail-row"><strong>操作提示</strong><span>战斗中优先看敌人意图，再选5张牌；选满后看牌型预览和反馈标签，确认本回合收益。</span></div>
    <div class="modal-actions"><button data-close-modal>关闭</button></div>
  `;
}

function renderNodeModal() {
  const node = state.run.map.cols.flat().find((item) => item.id === state.modal?.nodeId);
  if (!node) return `<h2>节点</h2><p class="small">节点不存在。</p><div class="modal-actions"><button data-close-modal>关闭</button></div>`;
  const parallel = getTraverseHint(node, true);
  const blocked = nodeBlockedReason(node);
  const needsParallelPackChoice = parallel.includes("并行-2包") && !blocked;
  const parallelChoice = needsParallelPackChoice ? renderParallelPackChoice() : "";
  const confirmDisabled = blocked || (needsParallelPackChoice && parallelPackSelectionTotal(state.modal?.parallelPacks) !== 2);
  return `
    <h2>${nodeIcon(node.type)} ${nodeTypeLabel(node.type)}</h2>
    <div class="detail-row"><strong>节点</strong><span>${node.id}${parallel || ""}</span></div>
    <div class="detail-row"><strong>奖励</strong><span>${nodeRewardText(node)}</span></div>
    <div class="detail-row"><strong>说明</strong><span>${nodeDescription(node)}</span></div>
    ${blocked ? `<p class="small">无法进入：${blocked}</p>` : ""}
    ${parallelChoice}
    <div class="modal-actions">
      <button data-confirm-node ${confirmDisabled ? "disabled" : ""}>进入</button>
      <button data-close-modal>关闭</button>
    </div>
  `;
}

function renderParallelPackChoice() {
  const selection = normalizeParallelPackSelection(state.modal?.parallelPacks);
  const selected = parallelPackSelectionTotal(selection);
  const groups = groupedUnopenedPacks();
  return `
    <div class="detail-row"><strong>并行消耗</strong><span>选择要消耗的 2 个未开卡包，已选 ${selected}/2。</span></div>
    <div class="parallel-pack-list">
      ${groups.map(({ quality, packs }) => {
        const count = selection[quality] || 0;
        const canMinus = count > 0;
        const canPlus = count < packs.length && selected < 2;
        return `
          <div class="parallel-pack-row">
            <span>${packLabel(Number(quality))}</span>
            <small>拥有 ${packs.length}</small>
            <div class="parallel-pack-controls">
              <button data-parallel-pack="${quality}" data-parallel-pack-delta="-1" ${canMinus ? "" : "disabled"}>-</button>
              <strong>${count}</strong>
              <button data-parallel-pack="${quality}" data-parallel-pack-delta="1" ${canPlus ? "" : "disabled"}>+</button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function nodeBlockedReason(node) {
  if (isCombatNode(node) && state.run.album.length !== 26) return "卡册必须正好装入26种牌";
  if (isCombatNode(node) && !isAlbumPlayable()) return "卡册中存在已耗尽的牌";
  if (getTraverseHint(node, true).includes("并行-2包") && state.run.unopenedPacks.length < 2) return "并行穿行需要2个未开卡包";
  return "";
}

function nodeRewardText(node) {
  if (node.type === "battle") return "1个当前层卡包 + 2 Joker + 5经验";
  if (node.type === "elite") return "2个当前层卡包 + 1个随机藏品 + 3 Joker + 7经验";
  if (node.type === "boss" && node.layer >= 5) return "终局之战：击败后完成本局";
  if (node.type === "boss") return "5个当前层卡包 + 2个随机藏品 + 5 Joker + 10经验";
  if (node.type === "shop") return "可购买藏品、卡包，也可出售未开卡包";
  if (node.type === "upgrade") return "升级卡牌，或3张多余牌制作1张当前层UP牌";
  if (node.type === "relic") return "获得1个随机藏品";
  if (node.type === "event") return "触发一个事件，按选项获得奖励或承担代价";
  return "未知奖励";
}

function nodeDescription(node) {
  if (isCombatNode(node)) return "进入后默认使用当前配置好的26张卡册。";
  if (node.type === "shop") return "商店不会触发节点结算，离开后返回地图。";
  if (node.type === "upgrade") return "制牌不会消耗每种牌保留的最后1张基础牌。";
  if (node.type === "event") return "资源不足的事件选项会置灰，不能选择。";
  return "确认后进入节点。";
}

function renderDetailModal() {
  const { kind, id } = state.modal || {};
  if (kind === "intent") {
    const enemy = state.battle?.enemies.find((item) => item.id === id);
    const intent = enemy?.intent;
    return `
      <div class="detail-head">
        <span class="detail-icon detail-icon-art">${renderIntentIcon(intent?.type)}</span>
        <div>
          <h2>${enemy?.name || "敌人"} · 准备行动</h2>
          <p>${intentTypeLabel(intent?.type)} · ${intent?.text || "等待"}</p>
        </div>
      </div>
      <div class="detail-row"><strong>招式类型</strong><span>${intentTypeLabel(intent?.type)}</span></div>
      <div class="detail-row"><strong>准备效果</strong><span>${intentDetailText(intent, enemy)}</span></div>
      <div class="detail-row"><strong>结算对象</strong><span>${intentTargetText(intent?.type)}</span></div>
      <div class="modal-actions"><button data-close-modal>关闭</button></div>
    `;
  }
  if (kind === "status") {
    const target = id === "hero" ? "hero" : state.battle?.enemies.find((item) => item.id === id);
    const title = id === "hero" ? "持牌人状态" : `${target?.name || "目标"}状态`;
    const statuses = target ? getStatusList(target).filter((status) => !status.pending) : [];
    return `
      <div class="detail-head">
        <span class="detail-icon">✦</span>
        <div>
          <h2>${title}</h2>
          <p>${statuses.length ? `${statuses.length} 个当前状态` : "暂无状态"}</p>
        </div>
      </div>
      <div class="status-detail-grid">
        ${statuses.map((status) => `
          <div class="status-detail-card ${status.kind === "debuff" ? "debuff" : "buff"}">
            <div>
              <strong>${statusIcon(status)} ${status.name || status.id}${status.stacks > 1 ? ` x${status.stacks}` : ""}</strong>
              <span>${statusDetailText(status)}</span>
            </div>
            <em>${status.clearable === false ? "不可清除" : "可清除"}</em>
          </div>
        `).join("") || '<p class="small">暂无状态。</p>'}
      </div>
      ${statuses.length ? `
        <div class="detail-row">
          <strong>规则说明</strong>
          <span>回合数会在回合结算时减少；标记为“下回合开始生效”的状态不会立刻参与本回合计算。</span>
        </div>
      ` : ""}
      <div class="modal-actions"><button data-close-modal>关闭</button></div>
    `;
  }
  if (kind === "trait") {
    const enemy = state.battle?.enemies.find((item) => item.id === id);
    const traits = enemy?.traits || [];
    return `
      <div class="detail-head">
        <span class="detail-icon">◆</span>
        <div>
          <h2>${enemy?.name || "敌人"} · 特性详情</h2>
          <p>${traits.length ? `${traits.length} 个特性` : "无特殊特性"}</p>
        </div>
      </div>
      <div class="status-detail-grid">
        ${traits.map((trait) => {
          const info = traitInfo(trait);
          return `
            <div class="status-detail-card">
              <div>
                <strong>${info.name}</strong>
                <span>${info.summary}</span>
              </div>
            </div>
            <div class="detail-row"><strong>触发时机</strong><span>${info.timing}</span></div>
            <div class="detail-row"><strong>具体效果</strong><span>${info.effect}</span></div>
            <div class="detail-row"><strong>应对提示</strong><span>${info.note}</span></div>
          `;
        }).join("") || '<p class="small">无特殊特性。</p>'}
      </div>
      <div class="modal-actions"><button data-close-modal>关闭</button></div>
    `;
  }
  if (kind === "relic") {
    const relic = RELICS.find((item) => item.id === id);
    return `
      <div class="detail-head">
        <span class="detail-icon">💎</span>
        <div>
          <h2>${relic?.name || "藏品"}</h2>
          <p>${state.run.relics.includes(id) ? "已获得" : "未获得"} · 同名藏品不会重复获得</p>
        </div>
      </div>
      <div class="detail-kpis">
        <span><strong>${state.run.relics.includes(id) ? "已拥有" : "未拥有"}</strong>状态</span>
      </div>
      <div class="detail-row"><strong>效果</strong><span>${relic?.text || "暂无描述"}</span></div>
      <div class="detail-row"><strong>说明</strong><span>藏品会改变战斗、地图、卡包或经济规则；同名藏品不会重复获得。</span></div>
      <div class="modal-actions"><button data-close-modal>关闭</button></div>
    `;
  }
  return `<h2>详情</h2><p class="small">暂无详情。</p><div class="modal-actions"><button data-close-modal>关闭</button></div>`;
}

function intentTargetText(type) {
  if (["guard", "attackBuff", "speedBuff", "shield", "skip"].includes(type)) return "自身";
  if (["guardAll", "healAlly", "cleanseAlly", "summon"].includes(type)) return "敌方队伍";
  if (["aoe", "debuff", "focusTax", "vulnerableHero"].includes(type)) return "持牌人";
  if (["multiAttack", "guardAttack"].includes(type)) return "持牌人，多段结算";
  return "持牌人";
}

function intentDetailText(intent, enemy) {
  if (!intent) return "等待行动。";
  const attack = enemy ? enemy.attack + getEnemyAttackFlat(enemy) : 0;
  const defense = enemy ? enemy.defense : 0;
  const shield = enemy ? intentShield(intent, enemy) : 0;
  const pct = (value, fallback = 0) => `${Math.round((value ?? fallback) * 100)}%`;
  switch (intent.type) {
    case "skip": return "本回合被沉默，行动轮到它时会跳过。";
    case "attack": return `对持牌人造成1段攻击，基础伤害约为自身攻击 ${attack}。`;
    case "multiAttack": return `对持牌人连续攻击 ${intent.hits || 2} 段，每段基础伤害约为 ${ceil(attack * (intent.multiplier || 1))}。`;
    case "heavyAttack": return `对持牌人造成强力单段攻击，基础伤害约为 ${ceil(attack * (intent.multiplier || 1))}。`;
    case "chargedAttack": return `对持牌人造成蓄力攻击，基础伤害约为 ${ceil(attack * (intent.multiplier || 1))}。`;
    case "pierceAttack": return `对持牌人攻击1次，并按 ${pct(intent.pierce)} 穿透防御。`;
    case "speedHeavyAttack": return `行动时先获得速度 +${intent.speed || 0}，再造成约 ${ceil(attack * (intent.multiplier || 1))} 基础伤害。`;
    case "guard": return `自身获得 ${shield} 护盾。`;
    case "guardAll": return `敌方全体获得 ${shield} 护盾。`;
    case "guardAttack": return `自身获得 ${shield} 护盾，并对持牌人攻击1次。`;
    case "guardAttackBuff": return `进入防御姿态，本回合受伤降低，并提升自身攻击 ${ceil(attack * (intent.attackRatio || 0.5))}。`;
    case "defenseStance": return `进入防御姿态，本回合受到的伤害降低 ${pct(intent.reduction, 0.5)}。`;
    case "healAlly": return `治疗当前生命比例最低的敌人，治疗量 ${intent.flatByAttack ? attack : ceil(enemy.maxHp * intent.ratio)}。`;
    case "healAllyByAttack": return `敌方全体恢复 ${attack} 生命。`;
    case "healSelfMax": return `自身恢复最大生命值的 ${pct(intent.ratio, 0.2)}。`;
    case "healAllByDefense": return `敌方全体按自身防御恢复 ${ceil(defense * (intent.ratio || 0.5))} 生命。`;
    case "attackBuff": return `提升自身攻击 ${ceil(enemy.baseAttack * intent.amountRatio)}${intent.duration ? `，持续 ${intent.duration} 回合` : ""}。`;
    case "attackBuffByDefense": return `按自身防御提升攻击 ${ceil(defense * (intent.ratio || 0.2))}，持续 ${intent.duration || 2} 回合。`;
    case "allyAttackBuffHalf": return `随机1名敌方单位获得攻击 +${ceil(attack * 0.5)}。`;
    case "teamAttackBuffFlat": return `敌方全体攻击 +${attack}。`;
    case "growAttack": return `永久提升自身攻击 ${intent.amount || 1}。`;
    case "growDefense": return `永久提升自身防御 ${intent.amount ?? pct(intent.ratio)}。`;
    case "growDefenseByAttack": return `按自身攻击提升防御 ${ceil(attack * (intent.ratio || 1))}。`;
    case "growMaxHpAndDefense": return `生命上限 +${ceil(attack * (intent.hpByAtk || 2.5))}，防御 +${ceil(attack * (intent.defByAtk || 5))}。`;
    case "speedBuff": return `自身速度 +${intent.amount || 0}。`;
    case "weakenAttack": return `使持牌人攻击 -${intent.amount || 0}。`;
    case "weakenDefense": return `先攻击1次，然后永久降低持牌人防御 ${intent.amount || 0}。`;
    case "attackWeakenDefenseByAttack": return `先攻击1次，下回合开始使持牌人防御 -${ceil(attack * (intent.ratio || 1))}，持续 ${intent.duration || 2} 回合。`;
    case "attackCleanseHeroBuff": return "先攻击1次，然后清除持牌人1个可清除增益。";
    case "attackSlow": return `攻击1次，基础伤害约 ${ceil(attack * (intent.multiplier || 1))}，并使持牌人速度 ${intent.amount}，下回合开始。`;
    case "slowHero": return `使持牌人速度 ${intent.amount}，持续 ${intent.duration || 1} 回合，下回合开始。`;
    case "vulnerableHero": return `使持牌人受到伤害 +${pct(intent.bonus, 0.3)}，持续 ${intent.duration || 1} 回合。`;
    case "cleanseAlly": return "清除敌方1个单位的1个可清除负面状态，优先选择已被沉默或有负面的单位。";
    case "cleanseSelfShield": return `清除自身1个负面状态，并获得 ${ceil(defense * (intent.shieldByDef || 0.3))} 护盾。`;
    case "cleanseSelfAllDefenseStance": return "清除自身全部可清除负面状态，并进入防御姿态。";
    case "selfShieldMax": return `自身获得 ${intent.ratioByDefense ? ceil(defense * intent.ratioByDefense) : pct(intent.ratio, 0.2)} 护盾${intent.cleanse || intent.cleanseAll ? "，并清除负面状态" : ""}。`;
    case "guardLowest": return `给护盾最低的敌方单位 ${ceil(defense * (intent.shieldByDef || 0.5))} 护盾。`;
    case "drain": return `攻击1次，并恢复 ${ceil(attack * intent.ratio)} 生命。`;
    case "hpScaledAttack": return `按自身当前生命造成压制攻击，基础伤害约 ${ceil(attack * enemy.hp * (intent.ratio || 0.1))}。`;
    case "defenseAttack": return `按自身防御造成攻击，基础伤害约 ${ceil(defense * (intent.ratio || 1))}。`;
    case "clearHeroBuff": return `清除持牌人1个可清除增益${intent.healRatio ? `，若成功则自身恢复 ${pct(intent.healRatio)} 最大生命` : ""}。`;
    case "focusTax": return "若持牌人有调度点，则调度点 -1；否则改为造成一次较高伤害。";
    case "sealLastHand": return state.battle?.lastHandName ? `封锁上回合牌型「${state.battle.lastHandName}」，下回合再次打出该牌型会被削弱。` : "尝试封锁上回合牌型；当前没有可封锁牌型时效果较弱。";
    case "executeDebuff": return getStatusList("hero").some((status) => status.kind === "debuff" && status.clearable !== false)
      ? `若持牌人有负面状态，造成清算攻击，基础伤害约 ${ceil(attack * (intent.multiplier || 2))}。`
      : `持牌人没有负面状态时，改为普通攻击，基础伤害约 ${attack}。`;
    case "rerollTaxNext": return "本回合首次调度重抽费用 +1。";
    case "summon": return `召唤 ${intent.name || "召唤物"}，上限 ${intent.limit || 3} 个。`;
    case "buffSummons": return `强化己方召唤物，使其攻击按自身攻击提升 ${pct(intent.attackRatio, 0.5)}。`;
    default: return intent.text || "准备行动。";
  }
}

function intentTypeLabel(type) {
  return ({
    attack: "单体攻击",
    multiAttack: "多段攻击",
    guard: "防御",
    guardAll: "群体护盾",
    guardAttack: "护盾攻击",
    guardAttackBuff: "防御强化",
    defenseStance: "防御姿态",
    healAlly: "治疗",
    healAllyByAttack: "群体治疗",
    healAllByDefense: "群体治疗",
    healSelfMax: "自我恢复",
    guardLowest: "援护",
    selfShieldMax: "自我护盾",
    cleanseSelfShield: "净化护盾",
    cleanseSelfAllDefenseStance: "净化防御",
    cleanseAlly: "净化",
    summon: "召唤",
    buffSummons: "强化召唤物",
    attackBuff: "攻击提升",
    attackBuffByDefense: "攻击提升",
    allyAttackBuffHalf: "攻击支援",
    teamAttackBuffFlat: "群体攻击提升",
    growAttack: "成长攻击",
    growDefense: "成长防御",
    growDefenseByAttack: "成长防御",
    growMaxHpAndDefense: "成长体魄",
    speedBuff: "速度提升",
    heavyAttack: "强力攻击",
    chargedAttack: "蓄力攻击",
    pierceAttack: "穿甲攻击",
    speedHeavyAttack: "高速重击",
    defenseAttack: "防御攻击",
    hpScaledAttack: "生命压制",
    drain: "吸取攻击",
    attackSlow: "迟滞攻击",
    attackWeakenDefenseByAttack: "破防攻击",
    attackCleanseHeroBuff: "驱散攻击",
    weakenAttack: "攻击削弱",
    weakenDefense: "防御削弱",
    clearHeroBuff: "驱散增益",
    slowHero: "速度削弱",
    vulnerableHero: "易伤",
    focusTax: "调度干扰",
    rerollTaxNext: "调度干扰",
    sealLastHand: "封牌",
    executeDebuff: "清算",
    skip: "沉默跳过",
  })[type] || "攻击/技能";
}

function statusDetailText(status) {
  const parts = [];
  if (status.stat) parts.push(statusEffectText(status));
  if ((status.stacks || 1) > 1) parts.push(`叠层 ${status.stacks}`);
  if (Number.isFinite(status.remaining)) parts.push(`剩余 ${status.remaining} 回合`);
  parts.push(status.clearable === false ? "不可清除" : "可清除");
  if (status.pending) parts.push("下回合开始生效");
  return parts.join(" · ");
}

function statusEffectText(status) {
  const value = status.value || 0;
  const signed = value > 0 ? "+" : "";
  const percent = `${signed}${Math.round(value * 100)}%`;
  const number = `${signed}${value}`;
  const labels = {
    attack: "攻击力",
    defense: "防御力",
    speed: "速度",
    attackFlat: "攻击力",
    attackMultiplier: "造成伤害",
    damageDealt: "牌型伤害",
    damageTaken: "受到伤害",
    nextHandDamageTaken: "下次受到牌型伤害",
    defenseMultiplier: "防御力",
    clubCrown: "梅花皇冠",
  };
  const label = labels[status.stat] || "状态效果";
  if (["damageDealt", "damageTaken", "nextHandDamageTaken", "attackMultiplier", "defenseMultiplier"].includes(status.stat)) {
    return `${label} ${percent}`;
  }
  if (status.stat === "clubCrown") return "下回合首次牌型攻击命中主目标后，追加其最大生命10%的固定伤害";
  return `${label} ${number}`;
}

function rarityLabel(rarity) {
  return ({ common: "普通", rare: "稀有", epic: "史诗", legendary: "传奇" })[rarity] || "未知";
}

function renderMap() {
  return '<div id="map-react-view"></div>';
}

function buildMapViewProps() {
  const cols = state.run.map.cols;
  const h = state.run.hero;
  const available = new Set(availableNodes().map((n) => n.id));
  const visible = visibleMapNodes(available);
  const scoutText = hasRelic("flashlight") ? "手电筒：显示两步内可抵达节点" : state.run.scoutSteps > 0 ? `临时侦查：剩余 ${state.run.scoutSteps} 步` : "未侦查节点会保持隐藏";
  const currentStep = Math.min(Math.max(state.run.currentCol + 1, 0), 5);
  return {
    layer: state.run.layer,
    scoutText,
    hpText: `${h.hp}/${h.maxHp}`,
    levelText: `Lv.${h.level}${h.level >= 8 ? " MAX" : ""}`,
    expText: heroExpText(h),
    relics: state.run.relics.slice(0, 5).map((id) => {
      const relic = RELICS.find((item) => item.id === id);
      return { id, name: relic?.name || id };
    }),
    flow: {
      currentStep,
      availableCount: available.size,
      unopenedPackCount: state.run.unopenedPacks.length,
      traverseText: state.run.freeTraverse > 0 ? `免费并行 ${state.run.freeTraverse}` : "并行消耗 2 卡包",
    },
    joker: state.run.joker,
    links: buildMapLinkViews(cols, visible, available),
    nodes: buildMapNodeViews(cols, visible, available),
    onOpenBackpack: openBackpack,
    onOpenLab: openLab,
    onOpenPacks: openPackManager,
    onOpenNode: openNodeModal,
    onDetailRelic: (id) => openDetailModal("relic", id),
  };
}

function buildMapLinkViews(cols, visible, available) {
  const allNodes = cols.flat();
  const byId = Object.fromEntries(allNodes.map((node) => [node.id, node]));
  const links = [];
  const drawnParallel = new Set();
  const currentNode = currentMapNode();
  for (const from of allNodes) {
    for (const link of from.links || []) {
      const to = byId[link.to];
      if (!to) continue;
      if (link.parallel) {
        const key = [from.id, to.id].sort().join("::");
        if (drawnParallel.has(key)) continue;
        drawnParallel.add(key);
      }
      const a = mapNodePoint(from, cols, visible);
      const b = mapNodePoint(to, cols, visible);
      const active = link.parallel
        ? ((currentNode?.id === from.id && available.has(to.id)) || (currentNode?.id === to.id && available.has(from.id)))
        : currentNode?.id === from.id && available.has(to.id);
      links.push({
        from: from.id,
        to: to.id,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
        parallel: Boolean(link.parallel),
        hidden: !visible.has(from.id) || !visible.has(to.id),
        active,
        done: Boolean(from.done && to.done),
      });
    }
  }
  return links;
}

function buildMapNodeViews(cols, visible, available) {
  return cols.flat().map((node) => {
    const point = mapNodePoint(node, cols, visible);
    const isVisible = visible.has(node.id);
    if (!isVisible) {
      return {
        id: node.id,
        type: node.type,
        x: point.x,
        y: point.y,
        visible: false,
        available: false,
        done: false,
        current: false,
        parallel: false,
        stateLabel: "未知",
        icon: "?",
        assetSrc: nodeAsset("event"),
        typeLabel: "未知",
        hint: "未侦查",
      };
    }
    const isAvailable = available.has(node.id);
    const isCurrent = node.done && state.run.currentNodeId === node.id;
    const stateLabel = isCurrent ? "当前位置" : node.done ? "已通过" : isAvailable ? "可前往" : "未抵达";
    const hint = getTraverseHint(node, isAvailable);
    return {
      id: node.id,
      type: node.type,
      x: point.x,
      y: point.y,
      visible: true,
      available: isAvailable,
      done: Boolean(node.done),
      current: Boolean(isCurrent),
      parallel: hint.includes("并行"),
      stateLabel,
      icon: nodeIcon(node.type),
      assetSrc: nodeAsset(node.type),
      typeLabel: nodeTypeLabel(node.type),
      hint: hint || node.id,
    };
  });
}

function mapNodePoint(node, cols, visible) {
  const colNodes = cols[node.col];
  const visibleIndex = Math.max(0, colNodes.findIndex((item) => item.id === node.id));
  const x = ((node.col + 0.5) / cols.length) * 1000;
  const spacing = Math.min(260, 760 / Math.max(1, colNodes.length - 1));
  const offset = visibleIndex - (colNodes.length - 1) / 2;
  const y = 500 + offset * spacing;
  return { x: Math.round(x), y: Math.round(y) };
}

function visibleMapNodes(available) {
  const visible = new Set(available);
  for (const node of state.run.map.cols.flat()) {
    if (node.done) visible.add(node.id);
  }
  const extraSteps = Math.max(hasRelic("flashlight") ? 2 : 0, state.run.scoutSteps || 0);
  let frontier = [...available];
  for (let step = 0; step < extraSteps; step++) {
    const next = [];
    for (const node of frontier) {
      for (const link of node.links || []) {
        const linkedNode = state.run.map.cols.flat().find((item) => item.id === link.to);
        if (!linkedNode) continue;
        visible.add(linkedNode.id);
        next.push(linkedNode);
      }
    }
    frontier = next;
  }
  return visible;
}

function renderLab() {
  const run = state.run;
  const serialized = JSON.stringify({ run: serializeRun(), log: state.log }, null, 2);
  return `
    <section class="panel">
      <h2>实验室</h2>
      <div class="lab-grid">
        <div class="lab-card">
          <strong>随机与复现</strong>
          <span>Seed：${run.seed}</span>
          <span>RNG 状态：${state.rng?.getState?.() ?? run.rngState}</span>
          <span>节点：第${run.layer}层 / 已推进 ${run.nodeCount}</span>
        </div>
        <div class="lab-card">
          <strong>数据池</strong>
          <span>藏品：${RELICS.length}</span>
          <span>普通怪：${MONSTERS.length}</span>
          <span>精英怪：${ELITES.length}</span>
          <span>Boss：${Object.values(BOSSES).flat().length}</span>
          <span>事件：${EVENTS.length}</span>
        </div>
        <div class="lab-card">
          <strong>当前资源</strong>
          <span>未开卡包：${run.unopenedPacks.length}</span>
          <span>藏品：${run.relics.length}</span>
          <span>Joker：${run.joker}</span>
          <span>可免费并行：${run.freeTraverse}</span>
        </div>
      </div>
      <div class="screen-actions">
        <button data-run-smoke>固定策略试跑 12 战</button>
        <button data-copy-seed>复制 Seed</button>
        <button data-copy-save>复制存档</button>
        <button data-import-save>导入存档</button>
        <button data-map>返回地图</button>
      </div>
      ${state.labResult ? renderLabResult(state.labResult) : ""}
      <h3>本地存档导出</h3>
      <textarea class="save-export" readonly>${serialized}</textarea>
      <h3>粘贴存档导入</h3>
      <textarea id="saveImport" class="save-export" placeholder="粘贴复制出的存档 JSON"></textarea>
    </section>
  `;
}

function renderLabResult(result) {
  return `
    <div class="reward-card">
      试跑结果：Seed ${result.seed}，目标 ${result.battles} 战，胜利 ${result.wins} 战，剩余生命 ${result.hp}，等级 ${result.level}，Joker ${result.joker}，未开卡包 ${result.packs}
    </div>
  `;
}

function nodeIcon(type) {
  return ({ battle: "⚔", elite: "⚔⚔", boss: "👑", shop: "🛒", upgrade: "⬆", relic: "💎", event: "?" })[type] || "•";
}

function nodeAsset(type) {
  return assetPath(`assets/map/node-${type || "event"}.svg`);
}

function getTraverseHint(node, isAvailable) {
  if (!isAvailable || state.run.currentCol < 0) return "";
  const currentNode = currentMapNode();
  const link = currentNode?.links?.find((item) => item.to === node.id);
  if (!link?.parallel) return "";
  return state.run.freeTraverse > 0 ? " · 免费并行" : " · 并行-2包";
}

function renderReward() {
  return '<div id="reward-react-view"></div>';
}

function buildRewardViewProps() {
  const reward = state.reward || {};
  const loot = reward.loot || [];
  const upgrades = reward.upgrades || [];
  const lines = reward.lines || [];
  return {
    title: reward.title || "节点结算",
    lootCount: loot.length,
    upgradeCount: upgrades.length,
    lineCount: lines.length,
    loot: loot.map((item) => ({
      className: rewardLootClass(item),
      artSrc: rewardAsset(item),
      icon: item.icon || "•",
      title: item.title,
      text: item.text || "",
    })),
    upgrades: upgrades.map((upgrade) => ({
      level: upgrade.level,
      rewards: upgrade.rewards || [],
    })),
    lines,
    continueText: reward.returnScreen ? "返回" : "继续前进",
    onContinue: continueReward,
  };
}

function rewardAsset(item) {
  const text = `${item.icon || ""} ${item.title || ""} ${item.text || ""}`;
  if (text.includes("Joker") || text.includes("💰")) return assetPath("assets/ui/joker.svg");
  if (text.includes("卡包") || text.includes("📦")) return packAsset("reward");
  if (text.includes("藏品") || text.includes("💎")) {
    const relic = RELICS.find((candidate) => candidate.name === item.title);
    return relicAsset(relic);
  }
  return "";
}

function rewardLootClass(item) {
  const text = `${item.icon || ""} ${item.title || ""} ${item.text || ""}`;
  if (text.includes("Joker") || text.includes("💰")) return "loot-joker";
  if (text.includes("卡包") || text.includes("📦")) return "loot-pack";
  if (text.includes("藏品") || text.includes("💎")) return "loot-relic";
  if (text.includes("加入大背包") || text.includes("🃏")) return "loot-card";
  return "loot-generic";
}

function renderEvent() {
  return '<div id="event-react-view"></div>';
}

function buildEventViewProps() {
  const event = state.event;
  return {
    title: event?.title || "",
    text: event?.text || "",
    sceneSrc: sceneAsset("event-table"),
    options: (event?.options || []).map((option, index) => {
      const disabledReason = eventOptionDisabledReason(option);
      return {
        index,
        label: option.label,
        result: option.result,
        disabledReason,
        tags: eventOptionTags(option, disabledReason),
      };
    }),
    onChoose: chooseEventOption,
  };
}

function eventOptionTags(option, disabledReason) {
  const result = option.result || "";
  const tags = [];
  if (disabledReason) tags.push({ type: "cost", text: "资源不足" });
  if (/支付|消耗|失去|生命值|Joker/.test(result)) tags.push({ type: "cost", text: "有代价" });
  if (/藏品|卡包|经验|护盾|攻击|防御|速度|复制|升级|商店/.test(result)) tags.push({ type: "gain", text: "有收益" });
  if (/下次|本场|临时|指定/.test(result)) tags.push({ type: "special", text: "特殊效果" });
  if (!tags.length) tags.push({ type: "neutral", text: "普通选项" });
  return tags.slice(0, 3);
}

function renderCardChoice() {
  return '<div id="card-choice-react-view"></div>';
}

function buildCardChoiceViewProps() {
  const choice = state.pendingChoice;
  const cards = Object.entries(state.run.backpack)
    .filter(([, item]) => item.count > 0)
    .map(([id, item]) => ({ id, item, card: cardById[id] }))
    .sort((a, b) => RANK_ORDER[b.card.rank] - RANK_ORDER[a.card.rank] || a.card.suit.localeCompare(b.card.suit));
  const actionText = choice?.action === "upgradeFree" ? "升级" : "复制";
  return {
    title: choice?.title || "选择一张牌",
    text: choice?.text || "",
    progressText: choice?.picks > 1 ? `已选择 ${choice.selected?.length || 0}/${choice.picks}。每张会复制 ${choice.copies || 1} 次。` : "",
    cards: cards.map(({ id, item, card }) => {
      const disabled = choice?.action === "upgradeFree" && item.level >= maxCardLevel(id);
      const picked = choice?.selected?.includes(id);
      return {
        id,
        rank: card.rank,
        symbol: card.symbol,
        suitLabel: card.suitLabel,
        color: card.color,
        level: item.level,
        count: item.count,
        disabled: Boolean(disabled),
        picked: Boolean(picked),
        actionText: disabled ? "已满级" : actionText,
      };
    }),
    onChoose: choosePendingCard,
  };
}

function choosePendingCard(cardId) {
  const choice = state.pendingChoice;
  if (!choice) return;
  let ok = false;
  if (choice.action === "upgradeFree") ok = upgradeCardFree(cardId);
  if (choice.action === "duplicate") {
    const copies = choice.copies || 1;
    for (let i = 0; i < copies; i++) ok = duplicateBackpackCard(cardId) || ok;
  }
  if (!ok) {
    render();
    return;
  }
  if (choice.picks > 1) {
    choice.selected ||= [];
    choice.selected.push(cardId);
    if (choice.selected.length < choice.picks) {
      render();
      return;
    }
  }
  state.reward = { title: choice.title, lines: [choice.result || "完成选择"] };
  state.pendingChoice = null;
  state.screen = "reward";
  render();
}

function renderRelicChoice() {
  return '<div id="relic-choice-react-view"></div>';
}

function buildRelicChoiceViewProps() {
  const choice = state.pendingRelicChoice;
  const relics = (choice?.choices || []).map((id) => RELICS.find((relic) => relic.id === id)).filter(Boolean);
  return {
    title: choice?.title || "选择藏品",
    relics: relics.map((relic) => ({
      id: relic.id,
      name: relic.name,
      text: relic.text,
      artSrc: relicAsset(relic),
    })),
    onChoose: choosePendingRelic,
  };
}

function choosePendingRelic(relicId) {
  const choice = state.pendingRelicChoice;
  if (!choice || !choice.choices.includes(relicId)) return;
  addRelic(relicId);
  const relic = RELICS.find((item) => item.id === relicId);
  state.pendingRelicChoice = null;
  state.reward = {
    title: choice.title,
    loot: relic ? [{ icon: "💎", title: relic.name, text: relic.text }] : [],
    lines: relic ? [`获得藏品：${relic.name}`] : ["获得藏品"],
  };
  state.screen = "reward";
  render();
}

function renderShop() {
  return '<div id="shop-react-view"></div>';
}

function buildShopViewProps() {
  const shop = state.run.shop || createShop();
  state.run.shop = shop;
  const nextRefreshCost = shopRefreshCost(shop);
  const sellablePacks = state.run.unopenedPacks.slice(0, 8);
  return {
    joker: state.run.joker,
    relicAvailableCount: shop.relics.filter((slot) => !slot.sold).length,
    packAvailableCount: shop.packs.filter((slot) => !slot.sold).length,
    sellablePackCount: sellablePacks.length,
    sceneSrc: sceneAsset("shop-counter"),
    relics: shop.relics.map((slot, index) => {
      const relic = RELICS.find((item) => item.id === slot.id);
      const price = relicPrice(relic);
      const disabledReason = slot.sold ? "已售出" : state.run.joker < price ? `还差 ${price - state.run.joker} Joker` : "点击购买";
      return {
        index,
        sold: Boolean(slot.sold),
        name: relic?.name || slot.id,
        text: relic?.text || "",
        price,
        artSrc: relicAsset(relic),
        disabledReason,
        disabled: Boolean(slot.sold || state.run.joker < price),
      };
    }),
    packs: shop.packs.map((slot, index) => {
      const price = slot.fixed ? 2 : 1;
      const label = slot.fixed ? packLabel(slot.quality) : "随机卡包";
      const disabledReason = slot.sold ? "已售出" : state.run.joker < price ? `还差 ${price - state.run.joker} Joker` : "点击购买";
      return {
        index,
        sold: Boolean(slot.sold),
        label,
        description: slot.fixed ? "固定品质" : "品质按当前层掉落规则随机",
        price,
        artSrc: packAsset(slot.fixed ? slot.quality : "reward"),
        disabledReason,
        disabled: Boolean(slot.sold || state.run.joker < price),
      };
    }),
    sellablePacks: sellablePacks.map((pack) => ({ id: pack.id, label: packLabel(pack.quality) })),
    refreshText: `刷新 ${nextRefreshCost} Joker`,
    canRefresh: state.run.joker >= nextRefreshCost,
    onRefresh: refreshShop,
    onLeave: continueReward,
    onBuyRelic: buyShopRelic,
    onBuyPack: buyShopPack,
    onSellPack: sellShopPack,
  };
}

function renderUpgrade() {
  return '<div id="upgrade-react-view"></div>';
}

function buildUpgradeViewProps() {
  const upgradeable = Object.entries(state.run.backpack)
    .filter(([id, item]) => item.level < (cardById[id].rank === "A" ? 6 : 5) && item.count - 1 >= (item.level === 5 ? 6 : item.level))
    .slice(0, 32);
  const craftable = Object.entries(state.run.backpack)
    .filter(([id]) => craftableCopies(id) > 0 || selectedCraftCount(id) > 0)
    .sort((a, b) => RANK_ORDER[cardById[b[0]].rank] - RANK_ORDER[cardById[a[0]].rank] || cardById[a[0]].suit.localeCompare(cardById[b[0]].suit))
    .slice(0, 52);
  const selected = state.craftSelection || [];
  const upRanks = packUpRanks(state.run.layer).join(" / ");
  return {
    upgradeableCount: upgradeable.length,
    selectedCount: selected.length,
    upRanksText: upRanks,
    sceneSrc: sceneAsset("upgrade-room"),
    craftCards: craftable.map(([id, item]) => {
      const card = cardById[id];
      const chosen = selectedCraftCount(id);
      const available = Math.max(0, item.count - 1);
      return {
        id,
        label: cardLabel(card),
        color: card.color,
        available,
        chosen,
        disabled: selected.length >= 3 && !chosen,
      };
    }),
    upgradeCards: upgradeable.map(([id, item]) => {
      const card = cardById[id];
      const max = maxCardLevel(id);
      const cost = item.level === 5 ? 6 : item.level;
      return {
        id,
        label: cardLabel(card),
        color: card.color,
        level: item.level,
        nextLevel: item.level + 1,
        maxLevel: max,
        count: item.count,
        cost,
      };
    }),
    canCraft: selected.length === 3,
    onToggleCraft: toggleCraftCard,
    onCraft: craftLayerUpCard,
    onUpgrade: upgradeCard,
    onLeave: continueReward,
  };
}

function renderBackpack() {
  return '<div id="backpack-react-view"></div>';
}

function buildBackpackViewProps() {
  const cards = sortCardsForView(ALL_CARDS);
  const stats = cardCollectionStats();
  const valid = state.run.album.length === 26;
  return {
    resources: [
      `总牌数 ${stats.total}`,
      `卡包 ${state.run.unopenedPacks.length}`,
      `卡册 ${state.run.album.length}/26`,
      valid ? "可战斗" : "需补齐",
    ],
    valid,
    summary: {
      ownedKinds: stats.ownedKinds,
      duplicateKinds: stats.duplicateKinds,
      upgradedKinds: stats.upgradedKinds,
      inAlbum: stats.inAlbum,
      inAlbumPower: stats.inAlbumPower,
    },
    suits: SUITS.map((suit) => ({
      id: suit.id,
      symbol: suit.symbol,
      color: suit.color,
      count: stats.albumSuitCounts[suit.id] || 0,
    })),
    cards: cards.map((card) => {
      const item = state.run.backpack[card.id];
      const inAlbum = state.run.album.includes(card.id);
      return {
        id: card.id,
        rank: card.rank,
        symbol: card.symbol,
        color: card.color,
        count: item.count,
        level: item.level,
        power: getCardPower(card.id),
        inAlbum,
        disabled: item.count <= 0,
        hint: item.count <= 0 ? "未拥有" : inAlbum ? "点击移除" : state.run.album.length >= 26 ? "卡册已满" : "点击装入",
      };
    }),
    onOpenPacks: openPackManager,
    onClose: () => { state.screen = "map"; render(); },
    onToggleCard: toggleAlbumCard,
  };
}

function renderPackManager() {
  return '<div id="packs-react-view"></div>';
}

function buildPackManagerViewProps() {
  const fromBackpack = state.previousScreen === "backpack";
  const groups = [1, 2, 3, 4, 5, "reward"].map((quality) => ({
    quality,
    packs: state.run.unopenedPacks.filter((pack) => pack.quality === quality),
  })).filter((group) => group.packs.length > 0);
  const qualities = [1, 2, 3, 4, 5, "reward"];
  return {
    unopenedCount: state.run.unopenedPacks.length,
    joker: state.run.joker,
    summaries: qualities.map((quality) => ({
      quality: String(quality),
      label: packLabel(quality),
      count: state.run.unopenedPacks.filter((pack) => pack.quality === quality).length,
    })),
    groups: groups.map((group) => ({
      quality: String(group.quality),
      firstId: group.packs[0].id,
      label: packLabel(group.quality),
      count: group.packs.length,
      description: packDescription(group.quality),
      artSrc: packAsset(group.quality),
    })),
    showBackpackButton: fromBackpack,
    onOpenPack: openPack,
    onBackpack: openBackpack,
    onClose: closePackManager,
  };
}

function packDescription(quality) {
  return ({
    1: "高概率 2/3/4",
    2: "高概率 5/6/7",
    3: "高概率 8/9/10",
    4: "高概率 J/Q/K",
    5: "高概率 A",
    reward: "按当前层随机",
  })[quality] || "随机品质";
}

function cardCollectionStats() {
  const items = Object.entries(state.run.backpack);
  const album = new Set(state.run.album);
  return {
    total: items.reduce((sum, [, item]) => sum + item.count, 0),
    ownedKinds: items.filter(([, item]) => item.count > 0).length,
    duplicateKinds: items.filter(([, item]) => item.count > 1).length,
    upgradedKinds: items.filter(([, item]) => item.level > 1).length,
    inAlbum: state.run.album.length,
    inAlbumPower: state.run.album.reduce((sum, id) => sum + getCardPower(id), 0),
    inAlbumDuplicates: state.run.album.filter((id) => (state.run.backpack[id]?.count || 0) > 1).length,
    suitCounts: Object.fromEntries(SUITS.map((suit) => [suit.id, items.filter(([id, item]) => cardById[id].suit === suit.id && item.count > 0).length])),
    albumSuitCounts: Object.fromEntries(SUITS.map((suit) => [suit.id, state.run.album.filter((id) => cardById[id].suit === suit.id).length])),
  };
}

function sortCardsForView(cards) {
  return [...cards].sort((a, b) => RANK_ORDER[b.rank] - RANK_ORDER[a.rank] || SUITS.findIndex((s) => s.id === a.suit) - SUITS.findIndex((s) => s.id === b.suit));
}

function renderSide() {
  return '<div id="side-react-view"></div>';
}

function buildSideViewProps() {
  if (!state.run) return {
    runActive: false,
    startStats: [
      { label: "藏品", value: RELICS.length },
      { label: "事件", value: EVENTS.length },
      { label: "普通怪", value: MONSTERS.length },
      { label: "Boss", value: Object.values(BOSSES).flat().length },
    ],
    canUseOutgameInventory: false,
    packTags: [],
    relicTags: [],
    logEntries: state.log,
    onOpenGuide: openGuide,
    onNewRun: () => newRun(makeSeedString()),
    onOpenBackpack: openBackpack,
    onOpenPacks: openPackManager,
    onOpenPack: openPack,
    onDetailRelic: (id) => openDetailModal("relic", id),
  };
  const canUseOutgameInventory = state.screen !== "battle" && state.screen !== "reward";
  const h = state.run.hero;
  return {
    runActive: true,
    startStats: [],
    hero: {
      avatarSrc: assetPath("assets/characters/holder-avatar.png"),
      hpText: `${h.hp}/${h.maxHp}`,
      attack: h.attack,
      defense: h.defense,
      speed: h.speed,
      levelText: `Lv ${h.level}${h.level >= 8 ? " MAX" : ""}`,
      expText: heroExpText(h),
      joker: state.run.joker,
      packs: state.run.unopenedPacks.length,
      albumText: `${state.run.album.length}/26`,
    },
    canUseOutgameInventory,
    packTags: state.run.unopenedPacks.slice(0, 12).map((pack) => ({ id: pack.id, label: packLabel(pack.quality) })),
    relicTags: state.run.relics.map((id) => {
      const relic = RELICS.find((item) => item.id === id);
      return { id, name: relic?.name || id, title: relic?.text || "" };
    }),
    logEntries: state.log,
    onOpenGuide: openGuide,
    onNewRun: () => newRun(makeSeedString()),
    onOpenBackpack: openBackpack,
    onOpenPacks: openPackManager,
    onOpenPack: openPack,
    onDetailRelic: (id) => openDetailModal("relic", id),
  };
}

function bindEvents() {
  document.querySelector("[data-start]")?.addEventListener("click", () => {
    const value = document.getElementById("seedInput").value;
    newRun(value);
  });
  document.querySelector("[data-load-save]")?.addEventListener("click", () => { if (loadRun()) render(); });
  document.querySelector("[data-save]")?.addEventListener("click", saveAndRender);
  document.querySelectorAll("[data-open-guide]").forEach((button) => button.addEventListener("click", openGuide));
  document.querySelectorAll("[data-new-run]").forEach((button) => button.addEventListener("click", () => newRun(makeSeedString())));
  document.querySelectorAll("[data-card]").forEach((button) => button.addEventListener("click", () => toggleCard(button.dataset.card)));
  document.querySelectorAll("[data-target-enemy]").forEach((button) => button.addEventListener("click", () => selectTarget(button.dataset.targetEnemy)));
  document.querySelectorAll("[data-target-enemy-card]").forEach((card) => card.addEventListener("click", (event) => {
    if (event.target.closest("[data-detail-intent], [data-detail-status], [data-detail-trait], [data-target-enemy]")) return;
    selectTarget(card.dataset.targetEnemyCard);
  }));
  document.querySelector("[data-play]")?.addEventListener("click", playSelected);
  document.querySelector("[data-pick-suggestion]")?.addEventListener("click", pickSuggestedHand);
  document.querySelector("[data-reroll]")?.addEventListener("click", reroll);
  document.querySelector("[data-clear]")?.addEventListener("click", () => { state.selected = []; render(); });
  document.querySelector("[data-open-temp-consume]")?.addEventListener("click", openTempConsumeModal);
  document.querySelectorAll("[data-node]").forEach((button) => button.addEventListener("click", () => openNodeModal(button.dataset.node)));
  document.querySelectorAll("[data-open-pack]").forEach((button) => button.addEventListener("click", () => openPack(button.dataset.openPack)));
  document.querySelectorAll("[data-temp-card]").forEach((button) => button.addEventListener("click", () => tempConsumeCard(button.dataset.tempCard)));
  document.querySelectorAll("[data-swap-hand]").forEach((button) => button.addEventListener("click", () => toggleSwapHand(button.dataset.swapHand)));
  document.querySelectorAll("[data-swap-pool]").forEach((button) => button.addEventListener("click", () => toggleSwapPool(button.dataset.swapPool)));
  document.querySelector("[data-confirm-swap]")?.addEventListener("click", confirmSwapChoice);
  document.querySelector("[data-skip-swap]")?.addEventListener("click", skipSwapChoice);
  document.querySelectorAll("[data-detail-intent]").forEach((button) => button.addEventListener("click", () => openDetailModal("intent", button.dataset.detailIntent)));
  document.querySelectorAll("[data-detail-status]").forEach((button) => button.addEventListener("click", () => openDetailModal("status", button.dataset.detailStatus)));
  document.querySelectorAll("[data-detail-trait]").forEach((button) => button.addEventListener("click", () => openDetailModal("trait", button.dataset.detailTrait)));
  document.querySelectorAll("[data-detail-relic]").forEach((button) => button.addEventListener("click", () => openDetailModal("relic", button.dataset.detailRelic)));
  document.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
  document.querySelector("[data-confirm-node]")?.addEventListener("click", confirmNodeModal);
  document.querySelectorAll("[data-parallel-pack]").forEach((button) => button.addEventListener("click", () => adjustParallelPackChoice(button.dataset.parallelPack, Number(button.dataset.parallelPackDelta))));
  document.querySelector("[data-modal-surface]")?.addEventListener("click", (event) => event.stopPropagation());
  document.querySelectorAll("[data-event-option]").forEach((button) => button.addEventListener("click", () => chooseEventOption(Number(button.dataset.eventOption))));
  document.querySelectorAll("[data-choice-card]").forEach((button) => button.addEventListener("click", () => choosePendingCard(button.dataset.choiceCard)));
  document.querySelectorAll("[data-choice-relic]").forEach((button) => button.addEventListener("click", () => choosePendingRelic(button.dataset.choiceRelic)));
  document.querySelector("[data-continue]")?.addEventListener("click", continueReward);
  document.querySelectorAll("[data-map]").forEach((button) => button.addEventListener("click", () => { state.screen = "map"; render(); }));
  document.querySelectorAll("[data-open-backpack]").forEach((button) => button.addEventListener("click", openBackpack));
  document.querySelectorAll("[data-open-packs]").forEach((button) => button.addEventListener("click", openPackManager));
  document.querySelector("[data-close-packs]")?.addEventListener("click", closePackManager);
  document.querySelectorAll("[data-open-lab]").forEach((button) => button.addEventListener("click", openLab));
  document.querySelectorAll("[data-album-toggle]").forEach((button) => button.addEventListener("click", () => toggleAlbumCard(button.dataset.albumToggle)));
  document.querySelector("[data-refresh-shop]")?.addEventListener("click", refreshShop);
  document.querySelectorAll("[data-buy-relic]").forEach((button) => button.addEventListener("click", () => buyShopRelic(Number(button.dataset.buyRelic))));
  document.querySelectorAll("[data-buy-pack]").forEach((button) => button.addEventListener("click", () => buyShopPack(Number(button.dataset.buyPack))));
  document.querySelectorAll("[data-sell-pack]").forEach((button) => button.addEventListener("click", () => sellShopPack(button.dataset.sellPack)));
  document.querySelectorAll("[data-upgrade]").forEach((button) => button.addEventListener("click", () => upgradeCard(button.dataset.upgrade)));
  document.querySelectorAll("[data-craft-card]").forEach((button) => button.addEventListener("click", () => toggleCraftCard(button.dataset.craftCard)));
  document.querySelector("[data-craft-up-card]")?.addEventListener("click", craftLayerUpCard);
  document.querySelector("[data-run-smoke]")?.addEventListener("click", runLabSmoke);
  document.querySelector("[data-copy-seed]")?.addEventListener("click", copySeed);
  document.querySelector("[data-copy-save]")?.addEventListener("click", copySave);
  document.querySelector("[data-import-save]")?.addEventListener("click", importSave);
}

function adjustParallelPackChoice(quality, delta) {
  if (state.modal?.type !== "node" || !quality || !delta) return;
  const selection = normalizeParallelPackSelection(state.modal.parallelPacks);
  const group = groupedUnopenedPacks().find((item) => String(item.quality) === String(quality));
  const owned = group?.packs.length || 0;
  const current = selection[quality] || 0;
  const otherSelected = parallelPackSelectionTotal(selection) - current;
  const next = Math.max(0, Math.min(owned, Math.min(2 - otherSelected, current + delta)));
  if (next > 0) selection[quality] = next;
  else delete selection[quality];
  state.modal.parallelPacks = selection;
  render();
}

function openLab() {
  state.screen = "lab";
  render();
}

function runLabSmoke() {
  state.labResult = runBalanceSmoke(state.run.seed, 12);
  state.screen = "lab";
  render();
}

async function copySeed() {
  try {
    await navigator.clipboard.writeText(state.run.seed);
    log("Seed 已复制。");
  } catch (error) {
    log(`Seed：${state.run.seed}`);
  }
  render();
}

async function copySave() {
  const payload = JSON.stringify({ run: serializeRun(), log: state.log }, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    log("存档 JSON 已复制。");
  } catch (error) {
    log("浏览器阻止了复制，请在实验室导出框手动复制。");
  }
  render();
}

function importSave() {
  const raw = document.getElementById("saveImport")?.value?.trim();
  if (!raw) {
    log("请先粘贴存档 JSON。");
    render();
    return;
  }
  try {
    const data = JSON.parse(raw);
    restoreRunSnapshot(data, "已导入存档。");
    saveRun();
  } catch (error) {
    log("导入失败：存档 JSON 格式不正确。");
  }
  render();
}

function pickSuggestedHand() {
  if (!state.battle) return;
  state.selected = chooseBestHand(state.battle.hand).map((card) => card.uid);
  render();
}

function continueReward() {
  if (state.reward?.returnScreen) {
    state.screen = state.reward.returnScreen;
    state.reward = null;
    render();
    return;
  }
  if (state.run?.scoutSteps) state.run.scoutSteps = Math.max(0, state.run.scoutSteps - 1);
  finishNonCombat();
}

function runBalanceSmoke(seed = "R1-0001-0002-0003", battles = 12) {
  const storedSave = localStorage.getItem(SAVE_KEY);
  const snapshot = {
    state: JSON.stringify({
      run: state.run ? serializeRun() : null,
      log: state.log,
      screen: state.screen,
      reward: state.reward,
      event: state.event,
    }),
  };
  newRun(seed);
  let wins = 0;
  for (let i = 0; i < battles && state.run.hero.hp > 0; i++) {
    startBattle(i % 4 === 3 ? "elite" : "battle");
    while (state.screen === "battle" && state.run.hero.hp > 0) {
      const hand = chooseBestHand(state.battle.hand);
      state.selected = hand.map((card) => card.uid);
      playSelected();
    }
    if (state.screen === "reward") {
      wins += 1;
      finishNonCombat();
    }
  }
  const result = {
    seed,
    battles,
    wins,
    hp: state.run.hero.hp,
    level: state.run.hero.level,
    joker: state.run.joker,
    packs: state.run.unopenedPacks.length,
  };
  const saved = JSON.parse(snapshot.state);
  if (saved.run) {
    state.run = { ...saved.run, completedNodes: new Set(saved.run.completedNodes || []) };
    state.rng = createRng(state.run.rngState ?? state.run.seedValue);
  } else {
    state.run = null;
    state.rng = null;
  }
  state.log = saved.log || [];
  state.screen = saved.screen || "map";
  state.reward = saved.reward || null;
  state.event = saved.event || null;
  state.selected = [];
  state.battle = null;
  if (storedSave) localStorage.setItem(SAVE_KEY, storedSave);
  else localStorage.removeItem(SAVE_KEY);
  return result;
}

window.__dreamPokerSmoke = runBalanceSmoke;

export function mountLegacyApp(target) {
  legacyMountTarget = target;
  render();
  window.__dreamPokerSmoke = runBalanceSmoke;
  return () => {
    unmountReactIslands();
    if (legacyMountTarget === target) legacyMountTarget = null;
    target.innerHTML = "";
  };
}
