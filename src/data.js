export const SUITS = [
  { id: "heart", label: "红桃", symbol: "♥", color: "red" },
  { id: "spade", label: "黑桃", symbol: "♠", color: "black" },
  { id: "diamond", label: "方片", symbol: "♦", color: "red" },
  { id: "club", label: "梅花", symbol: "♣", color: "black" },
];

export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
export const RANK_ORDER = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13, A: 14 };
export const RANK_VALUE = { A: 10, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, J: 10, Q: 10, K: 10 };
export const HAND_ORDER = ["高牌", "一对", "两对", "三条", "顺子", "同花", "葫芦", "四条", "同花顺", "皇家同花顺"];

export const RELICS = [
  { id: "heart-crown", name: "红桃皇冠", rarity: "common", text: "打出的牌型包含3张及以上红桃时，额外获得3×当前层数点护盾。" },
  { id: "heart-scepter", name: "红桃权杖", rarity: "rare", text: "非完整红桃花色且打出的5张牌含有4张红桃时，视为触发红桃完整花色效果，但不额外重复触发。" },
  { id: "spade-crown", name: "黑桃皇冠", rarity: "common", text: "打出的牌型包含3张及以上黑桃时，获得速度+1的增益状态，战斗内永久生效，可清除，可叠层。" },
  { id: "spade-scepter", name: "黑桃权杖", rarity: "rare", text: "非完整黑桃花色且打出的5张牌含有4张黑桃时，视为触发黑桃完整花色效果，但不额外重复触发。" },
  { id: "diamond-crown", name: "方片皇冠", rarity: "rare", text: "打出的牌型包含3张及以上方片时，恢复1点调度点。每场战斗最多触发2次。" },
  { id: "diamond-scepter", name: "方片权杖", rarity: "rare", text: "非完整方片花色且打出的5张牌含有4张方片时，视为触发方片完整花色效果，但不额外重复触发。" },
  { id: "club-crown", name: "梅花皇冠", rarity: "rare", text: "打出的牌型包含3张及以上梅花时，下回合第一次对主目标造成牌型攻击伤害后，额外造成其最大生命值10%的固定伤害。" },
  { id: "club-scepter", name: "梅花权杖", rarity: "rare", text: "非完整梅花花色且打出的5张牌含有4张梅花时，视为触发梅花完整花色效果，但不额外重复触发。" },
  { id: "sage-heart", name: "贤者之心", rarity: "epic", text: "每进入1个非战斗节点，获得1个随机品质卡包。" },
  { id: "a-power", name: "A之力", rarity: "rare", text: "战斗时，每打出1张A，本场战斗攻击力+1，最多叠加10层。" },
  { id: "spartan-boots", name: "斯巴达战靴", rarity: "epic", effects: [{ trigger: "gain", type: "stat", stat: "speed", amount: 10 }], text: "角色速度+10。" },
  { id: "angel-kiss", name: "天使之吻", rarity: "common", text: "每通过1个节点，回复2点生命值。" },
  { id: "bloodthirsty-saber", name: "渴血弯刀", rarity: "legendary", text: "每经过1个精英战斗节点，角色攻击力+2，最多叠加10层。" },
  { id: "wild-card", name: "万能牌", rarity: "epic", text: "在制牌室中，每次升级可以少消耗1张同名重复牌。每个制牌室最多触发3次。" },
  { id: "silver-gourd", name: "银葫芦", rarity: "epic", text: "战斗中打出葫芦时，对敌方全体未行动单位施加本回合沉默。" },
  { id: "gold-gourd", name: "金葫芦", rarity: "epic", text: "战斗中打出葫芦时，葫芦造成的伤害+50%。同时拥有银葫芦时追加6段3点固定伤害。" },
  { id: "ladder", name: "天梯", rarity: "rare", text: "战斗中打出顺子时，获得2层蓄势。" },
  { id: "curse-doll", name: "诅咒娃娃", rarity: "common", text: "打出高牌时角色受到1点固定伤害；非高牌时本次牌型攻击每段伤害+1。" },
  { id: "cloud-ladder", name: "云梯", rarity: "rare", text: "打出顺子时，可以从弃牌堆或抽牌堆中选择最多2张2/3/4点数牌，与等量手牌交换。" },
  { id: "yin-yang-charm", name: "阴阳符咒", rarity: "common", text: "战斗中打出一对时，角色速度+1，下回合开始生效，战斗内永久生效，可清除，可叠层。" },
  { id: "sword-in-stone", name: "石中剑", rarity: "epic", text: "牌型攻击造成溢出伤害时，溢出伤害的50%转移给随机其他敌人。" },
  { id: "rattan-armor", name: "藤甲", rarity: "common", effects: [{ trigger: "gain", type: "stat", stat: "defense", amount: 20 }], text: "角色防御力+20。" },
  { id: "double-blades", name: "双刀", rarity: "rare", text: "战斗中打出一对时，获得攻击力+10的增益状态，本回合生效，持续1回合。" },
  { id: "red-knight-contract", name: "红骑士的契约", rarity: "epic", text: "连续2回合打出顺子时，对敌方全体施加防御力-30%，持续2回合，可清除，可叠加，最多2层。" },
  { id: "black-knight-contract", name: "黑骑士的契约", rarity: "rare", text: "每累计2回合打出低于顺子的牌型时，获得防御力+20，持续2回合。" },
  { id: "broken-beast-bone", name: "破损的兽骨", rarity: "rare", text: "精英战斗结束后，额外获得1个随机品质卡包。" },
  { id: "knight-lance", name: "骑士长枪", rarity: "common", text: "每场战斗首回合造成的牌型攻击伤害+20%。" },
  { id: "clearance-doc", name: "通关文书", rarity: "common", text: "进入商店节点时，获得3 Joker。" },
  { id: "legendary-banknote", name: "传说的银票", rarity: "legendary", text: "商店购买商品时价格减半，向上取整。" },
  { id: "knight-sword", name: "骑士长剑", rarity: "common", text: "每场战斗首回合获得速度+10的增益状态，持续1回合。" },
  { id: "twins-photo", name: "双胞胎的照片", rarity: "common", text: "战斗中打出两对后，下回合受到伤害-50%，持续1回合。" },
  { id: "burning-candle", name: "燃烧的蜡烛", rarity: "common", text: "如果战斗节点在5回合内结束，战斗结束后获得1 Joker。" },
  { id: "balloon", name: "气球", rarity: "common", text: "每场战斗首次受到的伤害-20%。" },
  { id: "shield-spring", name: "发条", rarity: "common", text: "每回合开始时，获得5点护盾。" },
  { id: "knight-dagger", name: "骑士短剑", rarity: "rare", text: "每场战斗首回合造成的牌型攻击会对目标施加本回合沉默。" },
  { id: "black-shield", name: "漆黑的盾", rarity: "common", text: "每次获得护盾时，额外获得2点护盾。" },
  { id: "echo-shield", name: "回声盾纹", rarity: "epic", text: "每次获得护盾时，获得1层蓄势。" },
  { id: "angel-wings", name: "天使的翅膀", rarity: "common", text: "战斗中打出一对时，随机1个敌人速度-5，持续2回合。" },
  { id: "paper-money", name: "纸钱", rarity: "legendary", text: "战斗中受到致命伤害后，保留1点生命值。全局只能触发1次。" },
  { id: "five-color-stone", name: "五色石", rarity: "rare", text: "打出的牌型含有四种花色时，清除自身全部可清除负面状态。" },
  { id: "umbrella", name: "雨伞", rarity: "common", text: "每受到1段伤害，下回合开始时获得2点护盾。" },
  { id: "pack-knife", name: "传国玉玺", rarity: "epic", text: "使用卡包时，额外获得1张随机扑克牌。" },
  { id: "knight-medal", name: "骑士勋章", rarity: "rare", text: "每场战斗首回合造成的牌型攻击无视敌人50%防御。" },
  { id: "phonograph", name: "留声机", rarity: "rare", text: "战斗中打出四条时，战斗结束后随机获得1张该四条点数的扑克牌。每场战斗最多触发1次。" },
  { id: "flashlight", name: "手电筒", rarity: "rare", text: "地图界面可以看到当前节点两步内可抵达的所有节点。" },
  { id: "scissors", name: "剪刀", rarity: "common", text: "每次打出牌型后，额外对主目标造成等于本次牌型中单牌最高点数的固定伤害。" },
  { id: "small-mirror", name: "小镜子", rarity: "epic", text: "每场战斗首次造成牌型攻击伤害后，获得等同于该次最终伤害数值的护盾，下回合开始扣除同等护盾。" },
  { id: "royal-coin", name: "皇室金币", rarity: "rare", text: "每场战斗中，每累计打出2次顺子，获得1 Joker。每场最多触发2次。" },
  { id: "crayon", name: "蜡笔", rarity: "rare", text: "打出同花时，清除敌方全体各1层随机可清除增益状态。" },
  { id: "paper-cup", name: "纸杯", rarity: "common", text: "每有1回合没有打出一对，积攒10点纸杯伤害，最多50点；打出一对时释放。" },
  { id: "clock", name: "闹钟", rarity: "rare", text: "每进入下一层，获得3 Joker。" },
  { id: "compass", name: "调度罗盘", rarity: "common", text: "每场战斗开始时，调度点+1。" },
  { id: "old-deal-box", name: "旧发牌盒", rarity: "rare", text: "每场战斗首次重抽不消耗调度点。" },
  { id: "shuffle-gloves", name: "洗牌手套", rarity: "rare", text: "每次重抽后，下一次牌型攻击伤害+10%。" },
  { id: "blank-contract", name: "空白契约", rarity: "epic", text: "每场战斗可以额外使用1次一次性消耗补牌。" },
  { id: "broken-red-thread", name: "断裂红线", rarity: "common", text: "触发红桃弱花色效果时，额外获得8点护盾。" },
  { id: "obsidian-seal", name: "黑曜印章", rarity: "rare", text: "触发黑桃弱花色效果时，使敌方全体下回合造成伤害-10%，持续1回合，可清除，不叠加。" },
  { id: "diamond-gear", name: "方片齿轮", rarity: "rare", text: "触发方片弱花色效果时，获得1次免费临时补牌：下次一次性消耗补牌不会永久消耗大背包卡牌。" },
  { id: "club-seal", name: "梅花火漆", rarity: "common", text: "触发梅花弱花色效果时，使敌方全体下回合第一次受到牌型攻击伤害+10%，持续1回合，可清除，不叠加。" },
  { id: "armor-piercer", name: "破甲锥", rarity: "rare", text: "每次打出包含A的牌型时，对主目标施加防御力降低5%的负面状态，持续2回合，最多叠加3层。" },
  { id: "throne-shard", name: "王座碎片", rarity: "epic", text: "Lv.6 A施加破防时，破防层数额外+1，并使目标本回合受到的下一次牌型攻击伤害+25%。" },
  { id: "joker-ledger", name: "小丑账本", rarity: "common", text: "每在制牌室完成3次升级，获得1 Joker。" },
  { id: "side-card-holder", name: "副牌夹", rarity: "rare", text: "每场战斗第一次使用一次性消耗补牌时，该牌不会永久失去，战斗结束后放回大背包。" },
  { id: "side-route-map", name: "侧路地图", rarity: "rare", text: "每层首次并行穿行不消耗卡包。" },
  { id: "worn-backpack", name: "破旧背包", rarity: "common", text: "每层第一次出售卡包时，额外获得1 Joker。" },
  { id: "tactical-hourglass", name: "战术沙漏", rarity: "epic", text: "如果本回合角色后手行动，本次牌型攻击伤害+25%。" },
  { id: "silencing-dagger", name: "消音匕首", rarity: "rare", text: "对已行动敌人施加沉默时，改为使其下回合攻击力-20%，持续1回合。" },
  { id: "judgement-frame", name: "断罪牌框", rarity: "epic", text: "每场战斗首次打出四条时，额外对敌方全体施加防御力降低20%，持续2回合。" },
  { id: "table-trapdoor", name: "牌桌暗门", rarity: "rare", text: "每进入1个制牌室，可以打开1个随机品质卡包。" },
  { id: "tail-rope", name: "断尾绳", rarity: "common", text: "每场战斗第一次生命值低于30%时，获得15点护盾，并清除自身1层随机可清除负面状态。" },
  { id: "dealer-chip", name: "庄家筹码", rarity: "rare", text: "每场战斗第一次打出同花时，获得1 Joker；第一次打出同花顺或皇家同花顺时，获得3 Joker。两项可各触发1次。" },
  { id: "cursed-contract", name: "血色牌契", rarity: "epic", text: "打出葫芦或四条时，本场战斗一次性消耗补牌次数+1，并获得1层血契负面状态。每场最多触发2次。" },
];

export const MONSTERS = [
  { name: "纸牌哨兵", hp: [10, 15], atk: [4, 5], def: [0, 0], speed: 3, skills: [{ type: "attack" }] },
  { name: "三连剪影", hp: [8, 10], atk: [4, 5], def: [0, 0], speed: 3, skills: [{ type: "multiAttack", hits: 3 }, { type: "guardAttackBuff", reduction: 0.5, attackRatio: 0.5 }] },
  { name: "战鼓旗手", hp: [30, 35], atk: [2, 3], def: [10, 10], speed: 3, skills: [{ type: "defenseStance", reduction: 0.6 }, { type: "teamAttackBuffFlat" }, { type: "weakenAttack", amount: 2 }] },
  { name: "涂色守卫", hp: [15, 18], atk: [5, 6], def: [30, 30], speed: 3, skills: [{ type: "attack" }, { type: "growDefense", ratio: 0.5 }, { type: "healSelfMax", ratio: 0.2 }] },
  { name: "红墨医师", hp: [10, 15], atk: [5, 6], def: [0, 0], speed: 3, skills: [{ type: "healAllyByAttack" }] },
  { name: "重铠牌兵", hp: [40, 45], atk: [2, 3], def: [20, 20], speed: 2, skills: [{ type: "attack" }] },
  { name: "滞速纸偶", hp: [12, 16], atk: [3, 4], def: [5, 5], speed: 3, skills: [{ type: "attackSlow", amount: -1, duration: 1 }, { type: "chargedAttack", multiplier: 2.5 }] },
  { name: "护牌侍从", hp: [18, 22], atk: [2, 3], def: [15, 15], speed: 2, skills: [{ type: "attack" }, { type: "guardLowest", shieldByDef: 0.5 }, { type: "defenseStance", reduction: 0.5 }] },
  { name: "镜面甲虫", hp: [25, 30], atk: [1, 2], def: [20, 20], speed: 3, traits: [{ type: "gainAttackOnHit", amount: 1 }], skills: [{ type: "attack" }, { type: "defenseStance", reduction: 0.6 }] },
  { name: "催牌小丑", hp: [14, 18], atk: [4, 5], def: [5, 5], speed: 3, skills: [{ type: "attack" }, { type: "allyAttackBuffHalf" }] },
  { name: "吸墨影", hp: [16, 20], atk: [6, 7], def: [10, 10], speed: 2, skills: [{ type: "drain", ratio: 0.5 }, { type: "healSelfMax", ratio: 0.2 }] },
  { name: "清场管家", hp: [18, 22], atk: [3, 4], def: [10, 10], speed: 2, skills: [{ type: "attack" }, { type: "cleanseSelfShield", shieldByDef: 0.3 }] },
  { name: "封套术士", hp: [12, 16], atk: [4, 5], def: [5, 5], speed: 4, skills: [{ type: "attackWeakenDefenseByAttack", ratio: 0.5, duration: 2 }, { type: "rerollTaxNext" }] },
];

export const ELITES = [
  { name: "双面审查官", hp: [20, 25], atk: [10, 11], def: [0, 0], speed: 4, traits: [{ type: "roundEndAttack", amount: 1 }], skills: [{ type: "multiAttack", hits: 2, multiplier: 1.2 }, { type: "drain", ratio: 0.5 }] },
  { name: "生命档案员", hp: [50, 60], atk: [1, 2], def: [30, 30], speed: 2, traits: [{ type: "roundEndHeal", ratio: 0.2 }], skills: [{ type: "hpScaledAttack", ratio: 0.1 }, { type: "growMaxHpAndDefense", hpByAtk: 2.5, defByAtk: 5 }] },
  { name: "迟滞档案员", hp: [30, 35], atk: [5, 6], def: [20, 20], speed: 3, traits: [{ type: "roundStartHeroAttackDown", amount: 2 }], skills: [{ type: "heavyAttack", multiplier: 2 }, { type: "defenseAttack", ratio: 1 }] },
  { name: "加冕骑士", hp: [30, 35], atk: [5, 6], def: [30, 30], speed: 3, traits: [{ type: "roundEndTeamDefenseByAttack" }], skills: [{ type: "healAllByDefense", ratio: 0.5 }, { type: "attackBuffByDefense", ratio: 0.2, duration: 2 }] },
  { name: "裂段主教", hp: [40, 50], atk: [5, 6], def: [15, 15], speed: 4, traits: [{ type: "multiHitReduction", reduction: 0.3 }], skills: [{ type: "multiAttack", hits: 2 }, { type: "speedHeavyAttack", speed: 2, multiplier: 1.5 }] },
  { name: "回声铁箱", hp: [55, 65], atk: [3, 4], def: [25, 25], speed: 2, traits: [{ type: "roundStartShieldByDefense", ratio: 0.3 }], skills: [{ type: "defenseAttack", ratio: 0.5 }, { type: "growDefenseByAttack", ratio: 3 }] },
  { name: "快手庄家", hp: [35, 42], atk: [10, 11], def: [10, 10], speed: 7, traits: [{ type: "fastPressure", bonus: 0.3 }], skills: [{ type: "attack" }, { type: "slowHero", amount: -2, duration: 2 }] },
  { name: "召牌主教", hp: [45, 55], atk: [4, 5], def: [20, 20], speed: 3, traits: [{ type: "allyDeathHealBuff", healRatio: 0.2, attackRatio: 0.5 }], skills: [{ type: "attack" }, { type: "summon", name: "纸牌哨兵", hpRatio: 0.5, attackRatio: 0.5, speed: 3, limit: 3 }] },
  { name: "印章吞食者", hp: [45, 55], atk: [6, 7], def: [15, 15], speed: 4, traits: [{ type: "roundStartShieldIfDebuffed", ratio: 0.5 }], skills: [{ type: "attackCleanseHeroBuff" }, { type: "cleanseSelfAllDefenseStance", reduction: 0.5 }, { type: "attackWeakenDefenseByAttack", ratio: 1, duration: 2 }] },
];

export const BOSSES = {
  3: [
    { name: "铁壁守卫", hp: [240, 280], atk: [18, 22], def: [70, 85], speed: 2, traits: [{ type: "roundStartShieldByDefense", ratio: 0.2 }, { type: "dullArmor", thresholdRatio: 0.5, reduction: 0.2 }], skills: [{ type: "defenseAttack", ratio: 0.4 }, { type: "growDefense", amount: 30 }, { type: "attackSlow", amount: -1, duration: 1, multiplier: 1.5 }, { type: "defenseStance", reduction: 0.5 }] },
    { name: "迅捷术士", hp: [190, 230], atk: [22, 26], def: [20, 30], speed: 9, traits: [{ type: "swiftCaster" }], skills: [{ type: "multiAttack", hits: 2 }, { type: "slowHero", amount: -2, duration: 2 }, { type: "vulnerableHero", bonus: 0.3, duration: 1 }, { type: "selfShieldMax", ratio: 0.2, cleanse: true }] },
    { name: "召唤母体", hp: [220, 260], atk: [18, 22], def: [35, 45], speed: 3, traits: [{ type: "summonDeathHeal", ratio: 0.1 }], skills: [{ type: "summon", name: "纸牌幼体", hpRatio: 0.15, attackRatio: 0.5, speed: 4, limit: 3 }, { type: "healAlly", flatByAttack: 1 }, { type: "drain", ratio: 0.5 }, { type: "buffSummons", attackRatio: 0.5 }] },
  ],
  5: [
    { name: "赌局审判者", hp: [520, 600], atk: [42, 48], def: [45, 60], speed: 5, skills: [{ type: "attack" }, { type: "sealLastHand" }, { type: "attackBuff", amountRatio: 0.3, duration: 2 }, { type: "executeDebuff", multiplier: 2 }] },
    { name: "王冠吞噬者", hp: [560, 640], atk: [38, 45], def: [65, 80], speed: 4, traits: [{ type: "devourHeroBuffStart" }, { type: "shieldOnDebuff", ratio: 0.2 }], skills: [{ type: "attack" }, { type: "clearHeroBuff", healRatio: 0.1 }, { type: "attackWeakenDefenseByAttack", ratio: 1, duration: 2 }, { type: "selfShieldMax", ratioByDefense: 0.5, cleanseAll: true }] },
    { name: "终局庄家", hp: [600, 700], atk: [45, 55], def: [50, 65], speed: 6, traits: [{ type: "shuffleRound" }, { type: "shieldOnStraightFlush", ratio: 0.15 }], skills: [{ type: "multiAttack", hits: 2 }, { type: "vulnerableHero", bonus: 0.3, duration: 1 }, { type: "focusTax" }, { type: "attackBuff", amountRatio: 0.5, duration: 2 }, { type: "heavyAttack", multiplier: 2.5, cooldown: 4 }] },
  ],
};

export const EVENTS = [
  { id: "empty-seat", minLayer: 2, maxLayer: 2, title: "长桌空位", text: "长桌上永远多出一个空位，椅背写着你的名字。", options: [
    { label: "支付 1 Joker", result: "获得 1 个随机藏品", requires: [{ type: "jokerAtLeast", amount: 1 }], effects: [{ type: "joker", amount: -1 }, { type: "relic" }] },
    { label: "支付 3 Joker", result: "获得 2 个随机藏品", requires: [{ type: "jokerAtLeast", amount: 3 }], effects: [{ type: "joker", amount: -3 }, { type: "relic" }, { type: "relic" }] },
    { label: "坐到空位上", result: "获得 5 Joker", effects: [{ type: "joker", amount: 5 }] },
  ] },
  { id: "sugar-jar", minLayer: 2, maxLayer: 2, title: "糖罐交易", text: "糖罐里没有糖，只有一叠折得很整齐的牌。", options: [
    { label: "支付 5 点生命", result: "获得 2 个随机藏品", requires: [{ type: "hpGreaterThan", amount: 5 }], effects: [{ type: "hp", amount: -5 }, { type: "relic" }, { type: "relic" }] },
    { label: "投入 1 个未打开卡包", result: "获得 6 Joker", requires: [{ type: "packAtLeast", amount: 1 }], effects: [{ type: "spendPacks", amount: 1 }, { type: "joker", amount: 6 }] },
  ] },
  { id: "smiling-door", minLayer: 2, maxLayer: 2, title: "微笑的门", text: "一扇门没有墙，却笑着要求你支付入场费。", options: [
    { label: "强行通过", result: "进入特殊战斗【门后收费站】，胜利后获得精英战斗基础奖励，并额外获得 5 Joker", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["快手庄家", "迟滞档案员"], rules: [{ type: "enemySpeed", amount: 1 }], rewards: [{ type: "joker", amount: 5 }] }] },
    { label: "绕开门缝", result: "获得 2 Joker", effects: [{ type: "joker", amount: 2 }] },
  ] },
  { id: "folded-card", minLayer: 2, maxLayer: 2, title: "折角纸牌", text: "一张折角的纸牌问你是否愿意替它找一个新身份。", options: [
    { label: "把折角压平", result: "失去 5 点生命，攻击力 +1，最大生命值 +5", requires: [{ type: "hpGreaterThan", amount: 5 }], effects: [{ type: "hp", amount: -5 }, { type: "stat", stat: "attack", amount: 1 }, { type: "stat", stat: "maxHp", amount: 5 }] },
    { label: "沿折痕重写", result: "支付 2 Joker，指定大背包中 3 张牌，每张各复制 2 张", requires: [{ type: "jokerAtLeast", amount: 2 }], effects: [{ type: "joker", amount: -2 }, { type: "chooseCard", action: "duplicate", title: "折角纸牌", picks: 3, copies: 2 }] },
    { label: "交给牌匠修补", result: "支付 1 个未打开卡包，防御力 +5，并获得 1 个随机藏品", requires: [{ type: "packAtLeast", amount: 1 }], effects: [{ type: "spendPacks", amount: 1 }, { type: "stat", stat: "defense", amount: 5 }, { type: "relic" }] },
  ] },
  { id: "painted-garden", minLayer: 3, maxLayer: 3, title: "涂色花园", text: "花园里的花被涂成错误的颜色，牌兵们急得团团转。", options: [
    { label: "故意涂错", result: "从红桃皇冠、黑桃皇冠、方片皇冠、梅花皇冠中选择 1 个获得。下一场战斗敌方全体速度 +1", effects: [{ type: "relicChoiceFixed", ids: ["heart-crown", "spade-crown", "diamond-crown", "club-crown"], title: "涂色花园" }, { type: "nextBattleEnemySpeed", amount: 1 }] },
    { label: "把颜料收走", result: "获得 8 Joker。下一场战斗开始时，敌方全体获得 10 护盾", effects: [{ type: "joker", amount: 8 }, { type: "nextBattleEnemyShield", amount: 10 }] },
  ] },
  { id: "garden-inquest", minLayer: 3, maxLayer: 3, title: "花园审问", text: "一张卷轴宣称你犯下携带过多命运的罪。", options: [
    { label: "拒绝审问", result: "进入特殊战斗【卷轴审判庭】，胜利后获得精英战斗基础奖励，并额外获得固定藏品五色石；若已拥有则获得 2 个随机藏品", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["印章吞食者", "迟滞档案员"], rules: [{ type: "heroVulnerable", amount: 0.1, duration: 2, name: "卷轴审判庭" }], rewards: [{ type: "fixedRelic", id: "five-color-stone", fallback: "twoRelics" }] }] },
    { label: "承认证词", result: "获得 1 个随机藏品，下一场战斗开始时获得 25 护盾", effects: [{ type: "relic" }, { type: "nextBattleShield", amount: 25 }] },
  ] },
  { id: "heart-fountain", minLayer: 3, maxLayer: 3, title: "红心喷泉", text: "喷泉流出的不是水，而是发光的红色墨水。", options: [
    { label: "饮用墨水", result: "最大生命值 +10，并回复 25% 最大生命值 + 8 生命", effects: [{ type: "stat", stat: "maxHp", amount: 10 }, { type: "heal", ratio: 0.25, flat: 8 }] },
    { label: "浸泡双手", result: "下一场 Boss 或精英战斗开始时获得 75 护盾；下一场战斗中第一次获得护盾时，额外获得 2 层蓄势", effects: [{ type: "nextEliteBossShield", amount: 75 }, { type: "nextBattleFirstShieldCharge", amount: 2 }] },
  ] },
  { id: "fate-game", minLayer: 3, maxLayer: 3, title: "命运牌局", text: "一张没有庄家的牌桌邀请你下注，桌面上只有四张背面朝上的牌。", options: [
    { label: "小注", result: "支付 2 Joker，翻开 1 张命运牌", requires: [{ type: "jokerAtLeast", amount: 2 }], effects: [{ type: "joker", amount: -2 }, { type: "fateCard", stake: "small" }] },
    { label: "大注", result: "支付 5 Joker，翻开 1 张命运牌", requires: [{ type: "jokerAtLeast", amount: 5 }], effects: [{ type: "joker", amount: -5 }, { type: "fateCard", stake: "large" }] },
    { label: "出千", result: "获得 1 个随机藏品和 8 Joker；下一场战斗开始时，角色获得 2 层随机负面状态，敌方全体攻击力 +10%", effects: [{ type: "relic" }, { type: "joker", amount: 8 }, { type: "nextBattleRandomDebuffs", amount: 2 }, { type: "nextBattleEnemyAttackMultiplier", amount: 0.1 }] },
  ] },
  { id: "mirror-merchant", minLayer: 4, maxLayer: 4, title: "镜中商人", text: "镜子里的商人比你晚半拍开口，但价格已经写好了。", options: [
    { label: "打碎镜面", result: "进入特殊战斗【镜面交易】，胜利后获得精英战斗基础奖励，并额外获得 1 个传奇价格随机藏品", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["双面审查官", "生命档案员"], rules: [{ type: "enemyMaxHpMultiplier", amount: 0.2 }], rewards: [{ type: "relicRarity", rarity: "legendary" }] }] },
    { label: "接受报价", result: "交出 2 个未打开卡包，获得 12 Joker", requires: [{ type: "packAtLeast", amount: 2 }], effects: [{ type: "spendPacks", amount: 2 }, { type: "joker", amount: 12 }] },
  ] },
  { id: "reflection-table", minLayer: 4, maxLayer: 4, title: "倒影牌桌", text: "牌桌上的倒影正在打一局与你相同的牌。", options: [
    { label: "推翻牌桌", result: "进入特殊战斗【倒影牌局】，胜利后获得精英战斗基础奖励，并额外获得固定藏品天梯；若已拥有则获得 2 个随机藏品", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["双面审查官", "快手庄家"], rules: [{ type: "enemySpeed", amount: 1 }, { type: "enemyAttackMultiplier", amount: 0.1 }], rewards: [{ type: "fixedRelic", id: "ladder", fallback: "twoRelics" }] }] },
    { label: "观看倒影", result: "获得 22 点经验，并获得 1 个随机稀有价格藏品", effects: [{ type: "exp", amount: 22 }, { type: "relicRarity", rarity: "rare" }] },
  ] },
  { id: "cracked-corridor", minLayer: 4, maxLayer: 4, title: "裂缝门廊", text: "门廊裂开一条缝，缝隙里能看见另一条路线。", options: [
    { label: "穿过裂缝", result: "接下来 2 次并行穿行免费，并获得 1 个随机品质卡包", effects: [{ type: "freeTraverse", amount: 2 }, { type: "gainPack", quality: "reward" }] },
    { label: "扩张裂缝", result: "失去 6 点生命，获得固定藏品「侧路地图」和 5 Joker；若已拥有藏品「侧路地图」则改为获得 1 个随机稀有价格藏品", requires: [{ type: "hpGreaterThan", amount: 6 }], effects: [{ type: "hp", amount: -6 }, { type: "fixedRelicOrRarity", id: "side-route-map", rarity: "rare" }, { type: "joker", amount: 5 }] },
    { label: "封住裂缝", result: "获得 9 Joker", effects: [{ type: "joker", amount: 9 }] },
  ] },
  { id: "trial-eve", minLayer: 5, maxLayer: 5, title: "终审前夜", text: "审判庭外没有风，所有旗帜却同时指向你。", options: [
    { label: "整理卡册", result: "下一场 Boss 战开始时获得 90 护盾，并获得 5 Joker", effects: [{ type: "nextBossShield", amount: 90 }, { type: "joker", amount: 5 }] },
    { label: "献上葫芦牌局", result: "进入特殊战斗【葫芦献祭】，胜利后获得精英战斗基础奖励，并额外获得固定藏品金葫芦；若已拥有则获得 2 个随机藏品", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["回声铁箱", "生命档案员"], rules: [{ type: "enemyDefenseMultiplier", amount: 0.2 }], rewards: [{ type: "fixedRelic", id: "gold-gourd", fallback: "twoRelics" }] }] },
  ] },
  { id: "evidence-box", minLayer: 5, maxLayer: 5, title: "证物箱", text: "箱子里装着你一路打出的牌型记录，每一张证物都在等待被重新解释。", options: [
    { label: "提交证物", result: "下一场 Boss 战开始时，Boss 防御力 -20%，持续 2 回合；获得 1 个五级卡包", effects: [{ type: "nextBossEnemyDefenseMultiplier", amount: -0.2, duration: 2 }, { type: "gainPack", quality: 5 }] },
    { label: "篡改证物", result: "获得 2 个随机藏品；下一场战斗开始时，角色受到伤害 +10%，持续 2 回合", effects: [{ type: "relic" }, { type: "relic" }, { type: "nextBattleVulnerable", amount: 0.1, duration: 2 }] },
    { label: "烧毁证物", result: "获得 12 Joker；下一场 Boss 战开始时，角色造成伤害 +20%，持续 1 回合", effects: [{ type: "joker", amount: 12 }, { type: "nextBossDamageDealt", amount: 0.2, duration: 1 }] },
  ] },
  { id: "nameless-jury", minLayer: 5, maxLayer: 5, title: "无名陪审团", text: "陪审席上坐满没有脸的人，他们要求你证明自己不是一张牌。", options: [
    { label: "接受裁决", result: "进入特殊战斗【无面裁决】，胜利后获得精英战斗基础奖励，并额外获得 2 个随机藏品", effects: [{ type: "specialBattle", battleType: "elite", enemies: ["印章吞食者", "召牌主教", "护牌侍从"], rules: [{ type: "heroVulnerable", amount: 0.1, duration: 2, name: "无面裁决" }], rewards: [{ type: "relic" }, { type: "relic" }] }] },
    { label: "贿赂书记员", result: "获得 2 Joker 和 1 个五级卡包", effects: [{ type: "joker", amount: 2 }, { type: "gainPack", quality: 5 }] },
  ] },
  { id: "last-tea", minLayer: 5, maxLayer: 5, title: "最后一杯茶", text: "茶已经凉了，但杯沿仍冒着梦一样的雾。", options: [
    { label: "喝下它", result: "最大生命值 +15，并回复 40% 最大生命值 +10 生命", effects: [{ type: "stat", stat: "maxHp", amount: 15 }, { type: "heal", ratio: 0.4, flat: 10 }] },
    { label: "倒掉它", result: "下一场 Boss 战开始时，敌方全体速度 -3，持续 1 回合", effects: [{ type: "nextBossEnemySpeedStatus", amount: -3, duration: 1 }] },
    { label: "带走它", result: "下一场 Boss 战开始时获得 1 次额外一次性补牌次数；获得 1 个五级卡包", effects: [{ type: "nextBossExtraConsume", amount: 1 }, { type: "gainPack", quality: 5 }] },
  ] },
  { id: "pardon-order", minLayer: 5, maxLayer: 5, title: "牌国赦令", text: "一份赦令落在地上，上面只缺你的签名。", options: [
    { label: "签名", result: "获得 1 个传奇价格随机藏品和 5 Joker", effects: [{ type: "relicRarity", rarity: "legendary" }, { type: "joker", amount: 5 }] },
    { label: "拒签", result: "获得 16 Joker", effects: [{ type: "joker", amount: 16 }] },
    { label: "撕毁赦令", result: "下一场 Boss 战开始时，角色造成伤害 +25%，持续 2 回合，并获得 1 个随机藏品", effects: [{ type: "nextBossDamageDealt", amount: 0.25, duration: 2 }, { type: "relic" }] },
  ] },
];
