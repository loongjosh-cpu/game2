import { SceneBanner } from "./primitives";

type CraftCardView = {
  id: string;
  label: string;
  color: string;
  available: number;
  chosen: number;
  disabled: boolean;
};

type UpgradeCardView = {
  id: string;
  label: string;
  color: string;
  level: number;
  nextLevel: number;
  maxLevel: number;
  count: number;
  cost: number;
};

type UpgradeViewProps = {
  upgradeableCount: number;
  selectedCount: number;
  upRanksText: string;
  sceneSrc: string;
  craftCards: CraftCardView[];
  upgradeCards: UpgradeCardView[];
  canCraft: boolean;
  onToggleCraft: (cardId: string) => void;
  onCraft: () => void;
  onUpgrade: (cardId: string) => void;
  onLeave: () => void;
};

export function UpgradeView({
  upgradeableCount,
  selectedCount,
  upRanksText,
  sceneSrc,
  craftCards,
  upgradeCards,
  canCraft,
  onToggleCraft,
  onCraft,
  onUpgrade,
  onLeave,
}: UpgradeViewProps) {
  return (
    <section className="panel outgame-panel">
      <div className="page-head">
        <div>
          <h2>制牌室</h2>
          <p className="small">升级卡牌，或消耗3张多余牌制作1张当前层UP牌。</p>
        </div>
        <div className="page-resources">
          <span>可升级 {upgradeableCount}</span>
          <span>制牌 {selectedCount}/3</span>
        </div>
      </div>
      <SceneBanner src={sceneSrc} compact />
      <div className="section-head"><h3>制牌</h3><span>本层UP：{upRanksText}</span></div>
      <p className="small">每次选择3张多余牌，随机获得1张本层UP点数牌。卡册基础牌会保留最后1张，不会被消耗。</p>
      <div className="cardbook outgame-cardbook">
        {craftCards.length ? craftCards.map((card) => (
          <button
            key={card.id}
            className={`mini-card ${card.color} ${card.chosen ? "selected" : ""}`}
            data-craft-card={card.id}
            disabled={card.disabled}
            onClick={() => onToggleCraft(card.id)}
          >
            <strong>{card.label}</strong>
            <span>可用 {card.available} · 已选 {card.chosen}</span>
            <span>点击{card.chosen ? "取消" : "选择"}</span>
          </button>
        )) : <p>暂无可用于制牌的多余牌。</p>}
      </div>
      <div className="screen-actions">
        <button data-craft-up-card disabled={!canCraft} onClick={onCraft}>消耗3张制牌</button>
      </div>
      <div className="section-head"><h3>升级</h3><span>消耗同名重复牌</span></div>
      <div className="cardbook outgame-cardbook">
        {upgradeCards.length ? upgradeCards.map((card) => (
          <button key={card.id} className={`mini-card ${card.color}`} data-upgrade={card.id} onClick={() => onUpgrade(card.id)}>
            <strong>{card.label}</strong>
            <span>Lv.{card.level} → Lv.{card.nextLevel}/{card.maxLevel}</span>
            <span>数量 {card.count} · 消耗 {card.cost}</span>
          </button>
        )) : <p>暂无可升级牌。</p>}
      </div>
      <div className="screen-actions"><button data-continue onClick={onLeave}>离开</button></div>
    </section>
  );
}
