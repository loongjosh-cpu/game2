import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function save(path, svg) {
  const out = join(root, "public", path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg.trimStart());
}

function svg(width, height, body, defs = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
<defs>
${defs}
<filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
  <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#050509" flood-opacity=".45"/>
</filter>
</defs>
${body}
</svg>`;
}

const gold = "#d9a746";
const gold2 = "#f1d17a";
const ink = "#191820";
const panel = "#272530";
const red = "#b9414b";
const blue = "#67a6d9";
const green = "#7fbc77";
const purple = "#9a78d3";

save("assets/cards/card-frame-front.svg", svg(512, 768, `
<rect width="512" height="768" rx="38" fill="#f1eadf"/>
<rect x="18" y="18" width="476" height="732" rx="30" fill="url(#paper)" stroke="${gold}" stroke-width="8"/>
<rect x="45" y="45" width="422" height="678" rx="22" stroke="#6b5d45" stroke-opacity=".32" stroke-width="3"/>
<path d="M78 118 C166 58 346 58 434 118" stroke="${gold}" stroke-opacity=".45" stroke-width="5"/>
<path d="M78 650 C166 710 346 710 434 650" stroke="${gold}" stroke-opacity=".45" stroke-width="5"/>
`, `<linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffaf2"/><stop offset="1" stop-color="#d9cdbd"/></linearGradient>`));

save("assets/cards/card-back.svg", svg(512, 768, `
<rect width="512" height="768" rx="38" fill="#181720"/>
<rect x="22" y="22" width="468" height="724" rx="30" fill="url(#back)" stroke="${gold}" stroke-width="8"/>
<rect x="62" y="62" width="388" height="644" rx="20" stroke="${gold2}" stroke-opacity=".45" stroke-width="4"/>
<path d="M256 154 L338 302 L256 614 L174 302 Z" fill="#111018" stroke="${gold2}" stroke-width="8"/>
<circle cx="256" cy="384" r="86" fill="${red}" fill-opacity=".18" stroke="${gold}" stroke-width="6"/>
<path d="M214 384 C214 332 256 300 256 300 C256 300 298 332 298 384 C298 434 256 468 256 468 C256 468 214 434 214 384 Z" fill="${gold2}"/>
`, `<linearGradient id="back" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#312236"/><stop offset=".55" stop-color="#172033"/><stop offset="1" stop-color="#0f1016"/></linearGradient>`));

const suits = {
  heart: `<path d="M128 222 C64 166 48 96 92 62 C128 34 164 54 184 90 C204 54 240 34 276 62 C320 96 304 166 240 222 L184 278 Z" fill="${red}"/>`,
  spade: `<path d="M184 42 C104 110 64 158 64 210 C64 254 96 282 136 282 C154 282 168 276 178 264 C176 292 164 318 142 338 H226 C204 318 192 292 190 264 C200 276 214 282 232 282 C272 282 304 254 304 210 C304 158 264 110 184 42 Z" fill="#171922"/>`,
  diamond: `<path d="M184 36 L304 184 L184 332 L64 184 Z" fill="${red}"/>`,
  club: `<path d="M184 54 C222 54 252 84 252 122 C252 134 248 146 242 156 C280 158 310 188 310 226 C310 266 278 298 238 298 C218 298 202 290 190 276 C192 302 204 326 226 344 H142 C164 326 176 302 178 276 C166 290 150 298 130 298 C90 298 58 266 58 226 C58 188 88 158 126 156 C120 146 116 134 116 122 C116 84 146 54 184 54 Z" fill="#171922"/>`,
};
for (const [name, body] of Object.entries(suits)) save(`assets/cards/suit-${name}.svg`, svg(368, 368, body));

function pack(tier, color, label) {
  save(`assets/packs/pack-tier-${tier}.svg`, svg(512, 512, `
<rect width="512" height="512" rx="64" fill="#13141a"/>
<path d="M128 86 H384 L420 424 H92 Z" fill="url(#g)" stroke="${gold}" stroke-width="10" filter="url(#softShadow)"/>
<path d="M128 86 L256 168 L384 86" stroke="${gold2}" stroke-width="8"/>
<circle cx="256" cy="272" r="78" fill="#0e0f14" fill-opacity=".45" stroke="${gold2}" stroke-width="7"/>
<text x="256" y="292" text-anchor="middle" font-family="Georgia, serif" font-size="92" font-weight="700" fill="#fff6d7">${label}</text>
`, `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#211b28"/></linearGradient>`));
}
pack(1, "#496f74", "I");
pack(2, "#5d7448", "II");
pack(3, "#7a6040", "III");
pack(4, "#6c4b7d", "IV");
pack(5, "#8b3544", "A");
save("assets/packs/pack-reward.svg", svg(512, 512, `
<rect width="512" height="512" rx="64" fill="#15151c"/>
<path d="M104 112 H408 L438 420 H74 Z" fill="url(#g)" stroke="${gold}" stroke-width="10" filter="url(#softShadow)"/>
<path d="M104 112 L256 198 L408 112" stroke="${gold2}" stroke-width="8"/>
<path d="M256 218 L294 288 L372 302 L316 356 L326 434 L256 398 L186 434 L196 356 L140 302 L218 288 Z" fill="${gold2}"/>
`, `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#334a70"/><stop offset=".55" stop-color="#65385c"/><stop offset="1" stop-color="#231b2b"/></linearGradient>`));

save("assets/ui/joker.svg", svg(256, 256, `
<circle cx="128" cy="128" r="104" fill="url(#g)" stroke="${gold2}" stroke-width="10" filter="url(#softShadow)"/>
<path d="M74 116 C86 70 116 62 128 96 C140 62 170 70 182 116 C190 144 166 178 128 198 C90 178 66 144 74 116 Z" fill="#21131c"/>
<circle cx="101" cy="122" r="9" fill="${gold2}"/><circle cx="155" cy="122" r="9" fill="${gold2}"/>
<path d="M96 154 Q128 178 160 154" stroke="${gold2}" stroke-width="9" stroke-linecap="round"/>
`, `<radialGradient id="g" cx=".35" cy=".25" r=".8"><stop stop-color="#fff0a6"/><stop offset=".55" stop-color="${gold}"/><stop offset="1" stop-color="#8b5820"/></radialGradient>`));

const nodeData = [
  ["battle", "#6f737e", "⚔"], ["elite", red, "⚔"], ["boss", gold, "♛"], ["shop", green, "✦"],
  ["upgrade", blue, "⬢"], ["relic", purple, "◆"], ["event", "#cfc3a6", "?"],
];
for (const [name, color, mark] of nodeData) save(`assets/map/node-${name}.svg`, svg(256, 256, `
<circle cx="128" cy="128" r="102" fill="#1b1b23" stroke="${color}" stroke-width="10" filter="url(#softShadow)"/>
<circle cx="128" cy="128" r="68" fill="${color}" fill-opacity=".14" stroke="${color}" stroke-opacity=".5" stroke-width="4"/>
<text x="128" y="154" text-anchor="middle" font-family="Georgia, serif" font-size="76" font-weight="700" fill="#fff5d8">${mark}</text>
`));

const relics = ["gold-gourd", "silver-gourd", "heart-crown", "spade-crown", "diamond-crown", "club-crown", "heart-scepter", "spade-scepter", "diamond-scepter", "club-scepter", "ladder", "echo-shield", "five-color-stone", "side-route-map", "royal-coin", "red-knight-contract", "black-knight-contract", "dealer-chip", "cursed-contract", "throne-shard"];
for (const id of relics) {
  const isCrown = id.includes("crown");
  const isGourd = id.includes("gourd");
  const isScepter = id.includes("scepter");
  const hue = id.includes("heart") || id.includes("red") || id.includes("gold") ? red : id.includes("spade") || id.includes("black") ? "#20222a" : id.includes("diamond") ? blue : id.includes("club") ? green : purple;
  save(`assets/relics/${id}.svg`, svg(256, 256, `
<rect x="22" y="22" width="212" height="212" rx="42" fill="#1b1a22" stroke="${gold}" stroke-width="8" filter="url(#softShadow)"/>
<circle cx="128" cy="128" r="76" fill="${hue}" fill-opacity=".2" stroke="${hue}" stroke-width="6"/>
${isCrown ? `<path d="M70 150 L86 82 L118 122 L150 82 L186 150 Z" fill="${gold2}" stroke="${gold}" stroke-width="6"/>` : ""}
${isGourd ? `<path d="M128 58 C156 72 154 104 138 118 C176 128 190 178 160 204 C140 222 102 222 84 204 C54 178 70 128 108 118 C92 104 100 72 128 58 Z" fill="${gold2}" stroke="${gold}" stroke-width="6"/>` : ""}
${isScepter ? `<path d="M128 54 L154 96 L128 138 L102 96 Z M128 134 L128 206" stroke="${gold2}" stroke-width="14" stroke-linecap="round" fill="none"/>` : ""}
${!isCrown && !isGourd && !isScepter ? `<path d="M128 56 L178 128 L128 200 L78 128 Z" fill="${gold2}" stroke="${gold}" stroke-width="6"/>` : ""}
`));
}
const categories = ["suit", "weapon", "defense", "economy", "map", "curse", "upgrade", "focus", "consume", "poker"];
for (const id of categories) save(`assets/relics/category-${id}.svg`, svg(256, 256, `
<rect x="24" y="24" width="208" height="208" rx="40" fill="#1d1d25" stroke="${gold}" stroke-width="7"/>
<circle cx="128" cy="128" r="72" fill="${purple}" fill-opacity=".18" stroke="${gold2}" stroke-width="5"/>
<path d="M128 58 L182 128 L128 198 L74 128 Z" fill="${gold2}" fill-opacity=".9"/>
<circle cx="128" cy="128" r="22" fill="#1d1d25"/>
`));

const statuses = ["attack-up", "attack-down", "defense-up", "defense-down", "speed-up", "speed-down", "silence", "charge", "shield", "vulnerable", "reduction", "pierce"];
for (const id of statuses) save(`assets/status/${id}.svg`, svg(128, 128, `
<rect x="10" y="10" width="108" height="108" rx="28" fill="#202029" stroke="${gold}" stroke-width="5"/>
<circle cx="64" cy="64" r="34" fill="${id.includes("down") || id === "vulnerable" ? red : id === "shield" || id === "defense-up" ? blue : gold}" fill-opacity=".25"/>
<text x="64" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#fff1c7">${id.includes("down") ? "↓" : id.includes("up") ? "↑" : id === "silence" ? "×" : id === "charge" ? "↯" : id === "shield" ? "▰" : id === "pierce" ? "◇" : "!"}</text>
`));

const intents = [
  ["attack", red, "⚔"],
  ["multi-attack", red, "×"],
  ["aoe", "#c96a43", "✸"],
  ["guard", blue, "▰"],
  ["heal", green, "✚"],
  ["summon", purple, "♟"],
  ["buff", gold, "↑"],
  ["debuff", red, "↓"],
  ["cleanse", "#d8e4ff", "✦"],
  ["special", purple, "?"],
  ["skip", "#6f737e", "×"],
];
for (const [id, color, mark] of intents) save(`assets/intents/${id}.svg`, svg(128, 128, `
<rect x="10" y="10" width="108" height="108" rx="30" fill="#1d1d25" stroke="${color}" stroke-width="6"/>
<circle cx="64" cy="64" r="36" fill="${color}" fill-opacity=".2"/>
<text x="64" y="80" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="800" fill="#fff4c7">${mark}</text>
`));

function scene(name, primary, secondary, mark, body) {
  save(`assets/scenes/${name}.svg`, svg(960, 260, `
<rect width="960" height="260" rx="34" fill="#12131a"/>
<rect x="8" y="8" width="944" height="244" rx="28" fill="url(#scene)" stroke="${gold}" stroke-opacity=".32" stroke-width="3"/>
<path d="M0 200 C160 148 260 240 420 182 C590 122 730 162 960 88 V260 H0 Z" fill="${primary}" fill-opacity=".16"/>
<path d="M56 44 H904" stroke="${gold2}" stroke-opacity=".2" stroke-width="3" stroke-dasharray="14 16"/>
<circle cx="768" cy="112" r="76" fill="${secondary}" fill-opacity=".18" stroke="${secondary}" stroke-opacity=".45" stroke-width="6"/>
<text x="768" y="142" text-anchor="middle" font-family="Georgia, serif" font-size="88" font-weight="800" fill="#fff2c7" opacity=".9">${mark}</text>
${body}
`, `<linearGradient id="scene" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${primary}"/><stop offset=".54" stop-color="#23232e"/><stop offset="1" stop-color="${secondary}"/></linearGradient>`));
}

scene("event-table", "#252234", "#876e39", "?", `
<path d="M116 176 H468 L508 226 H78 Z" fill="#171820" stroke="${gold}" stroke-opacity=".55" stroke-width="5"/>
<rect x="158" y="84" width="86" height="124" rx="12" fill="#efe4d5" stroke="${gold}" stroke-width="4" transform="rotate(-8 201 146)"/>
<rect x="250" y="74" width="86" height="124" rx="12" fill="#efe4d5" stroke="${red}" stroke-width="4" transform="rotate(5 293 136)"/>
<rect x="342" y="88" width="86" height="124" rx="12" fill="#efe4d5" stroke="${blue}" stroke-width="4" transform="rotate(12 385 150)"/>
`);

scene("shop-counter", "#1f2c27", "#6d5434", "$", `
<path d="M92 164 H514 L554 224 H52 Z" fill="#171820" stroke="${green}" stroke-opacity=".55" stroke-width="5"/>
<rect x="130" y="74" width="104" height="92" rx="14" fill="${gold}" fill-opacity=".18" stroke="${gold2}" stroke-width="5"/>
<rect x="270" y="92" width="78" height="78" rx="18" fill="${purple}" fill-opacity=".2" stroke="${purple}" stroke-width="5"/>
<path d="M408 82 H482 L498 168 H392 Z" fill="${blue}" fill-opacity=".18" stroke="${blue}" stroke-width="5"/>
`);

scene("upgrade-room", "#1f2a37", "#4a3d6d", "A", `
<path d="M114 200 L230 68 L346 200 Z" fill="${blue}" fill-opacity=".18" stroke="${blue}" stroke-width="6"/>
<path d="M118 200 H500" stroke="${gold}" stroke-opacity=".45" stroke-width="6"/>
<rect x="384" y="86" width="92" height="122" rx="15" fill="#efe4d5" stroke="${gold}" stroke-width="5"/>
<path d="M430 112 L464 172 H396 Z" fill="${red}" fill-opacity=".75"/>
`);

function bg(name, c1, c2, c3) {
  save(`assets/backgrounds/${name}.svg`, svg(1920, 1080, `
<rect width="1920" height="1080" fill="url(#bg)"/>
<path d="M0 760 C300 680 520 880 840 760 C1140 648 1400 720 1920 590 L1920 1080 L0 1080 Z" fill="#090a0f" fill-opacity=".45"/>
<g opacity=".28">${Array.from({ length: 16 }, (_, i) => `<circle cx="${120 + i * 120}" cy="${120 + (i % 5) * 110}" r="${60 + (i % 3) * 24}" fill="none" stroke="${gold}" stroke-width="2"/>`).join("")}</g>
<path d="M240 220 L420 160 L520 280 L360 360 Z M1400 220 L1650 190 L1720 360 L1480 410 Z" fill="${gold}" fill-opacity=".08"/>
`, `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>`));
}
bg("layer-1-rabbit-hole", "#1b1d2b", "#243040", "#100f16");
bg("layer-2-tea-table", "#271d25", "#443028", "#121116");
bg("layer-3-heart-garden", "#211a25", "#4a2430", "#10151a");
bg("layer-4-mirror-board", "#171c28", "#2b3343", "#0d0e13");
bg("layer-5-trial-court", "#201824", "#3b2c33", "#0d0b11");
bg("battle-common", "#171923", "#252630", "#0b0c11");
bg("battle-boss", "#22141b", "#3a2434", "#08070b");

save("assets/ui/panel-texture.svg", svg(1024, 1024, `
<rect width="1024" height="1024" fill="#22222a"/>
<g opacity=".12">${Array.from({ length: 80 }, (_, i) => `<path d="M${(i * 97) % 1024} 0 L${((i * 97) % 1024) + 240} 1024" stroke="${i % 2 ? gold : "#ffffff"}" stroke-width="2"/>`).join("")}</g>
`));

function slug(name) {
  const slugs = {
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
  if (slugs[name]) return slugs[name];
  return name.toLowerCase()
    .replace(/[：·]/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hash(text) {
  let h = 2166136261;
  for (const ch of text) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function portrait(path, name, role, palette, scale = 1) {
  const h = hash(name);
  const accent = palette[h % palette.length];
  const accent2 = palette[(h >> 3) % palette.length];
  const crown = role === "boss" ? `<path d="M210 214 L250 132 L300 202 L356 126 L406 214 Z" fill="${gold2}" stroke="${gold}" stroke-width="10"/>` : "";
  const shoulders = role === "hero" ? "#2d2633" : role === "boss" ? "#261620" : "#20232d";
  const mark = role === "hero" ? "A" : role === "boss" ? "♛" : role === "elite" ? "◆" : "♟";
  save(path, svg(768, 1024, `
<rect width="768" height="1024" fill="none"/>
<ellipse cx="384" cy="900" rx="${220 * scale}" ry="54" fill="#050509" fill-opacity=".36"/>
<path d="M198 840 C220 650 278 552 384 552 C490 552 548 650 570 840 Z" fill="${shoulders}" stroke="${gold}" stroke-width="10" filter="url(#softShadow)"/>
<path d="M252 604 C286 514 318 480 384 480 C450 480 482 514 516 604 C486 646 440 668 384 668 C328 668 282 646 252 604 Z" fill="${accent}" fill-opacity=".8" stroke="${gold2}" stroke-width="8"/>
<path d="M272 438 C286 292 322 214 384 214 C446 214 482 292 496 438 C468 510 430 544 384 544 C338 544 300 510 272 438 Z" fill="${accent2}" fill-opacity=".92" stroke="${gold}" stroke-width="10"/>
${crown}
<circle cx="334" cy="396" r="14" fill="#fff4c7"/>
<circle cx="434" cy="396" r="14" fill="#fff4c7"/>
<path d="M330 462 Q384 500 438 462" stroke="#fff4c7" stroke-width="10" stroke-linecap="round"/>
<path d="M190 290 C270 218 498 218 578 290" stroke="${gold}" stroke-opacity=".32" stroke-width="8"/>
<path d="M178 808 C290 754 478 754 590 808" stroke="${accent}" stroke-width="8" stroke-opacity=".45"/>
<circle cx="384" cy="716" r="74" fill="#111018" stroke="${gold2}" stroke-width="8"/>
<text x="384" y="742" text-anchor="middle" font-family="Georgia, serif" font-size="76" font-weight="700" fill="#fff4c7">${mark}</text>
<text x="384" y="944" text-anchor="middle" font-family="Georgia, serif" font-size="38" font-weight="700" fill="${gold2}">${name.slice(0, 8)}</text>
`));
}

portrait("assets/characters/holder-hero.svg", "持牌人", "hero", [red, blue, purple, green], 1);
portrait("assets/characters/holder-avatar.svg", "持牌人", "hero", [red, blue, purple, green], .85);

const ordinary = ["纸牌哨兵", "三连剪影", "战鼓旗手", "涂色守卫", "红墨医师", "重铠牌兵", "滞速纸偶", "护牌侍从", "镜面甲虫", "催牌小丑", "吸墨影", "清场管家", "封套术士", "纸牌幼体"];
const elites = ["双面审查官", "生命档案员", "迟滞档案员", "加冕骑士", "裂段主教", "回声铁箱", "快手庄家", "召牌主教", "印章吞食者"];
const bosses = ["铁壁守卫", "迅捷术士", "召唤母体", "赌局审判者", "王冠吞噬者", "终局庄家"];

for (const name of ordinary) portrait(`assets/enemies/${slug(name)}.svg`, name, "enemy", ["#66707f", "#7a4d54", "#576d5a", "#6b5b7a"], .92);
for (const name of elites) portrait(`assets/enemies/${slug(name)}.svg`, name, "elite", ["#8a4d57", "#4d687d", "#776047", "#5f4d7d"], 1);
for (const name of bosses) portrait(`assets/bosses/${slug(name)}.svg`, name, "boss", ["#9b3648", "#7d324f", "#4d314f", "#8a6232"], 1.08);
