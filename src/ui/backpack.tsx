type SuitSummaryView = {
  id: string;
  symbol: string;
  color: string;
  count: number;
};

type BackpackCardView = {
  id: string;
  rank: string;
  symbol: string;
  color: string;
  count: number;
  level: number;
  power: number;
  inAlbum: boolean;
  disabled: boolean;
  hint: string;
};

type BackpackViewProps = {
  resources: string[];
  valid: boolean;
  summary: {
    ownedKinds: number;
    duplicateKinds: number;
    upgradedKinds: number;
    inAlbum: number;
    inAlbumPower: number;
  };
  suits: SuitSummaryView[];
  cards: BackpackCardView[];
  onOpenPacks: () => void;
  onClose: () => void;
  onToggleCard: (cardId: string) => void;
};

export function BackpackView({
  resources,
  valid,
  summary,
  suits,
  cards,
  onOpenPacks,
  onClose,
  onToggleCard,
}: BackpackViewProps) {
  return (
    <section className="panel outgame-panel">
      <div className="page-head">
        <div>
          <h2>大背包</h2>
          <p className="small">查看扑克牌数量、等级和牌力；点击卡牌即可装入或移出战斗卡册。</p>
        </div>
        <div className="page-resources">
          {resources.map((text) => <span key={text}>{text}</span>)}
        </div>
      </div>
      <div className={`outgame-summary album-state ${valid ? "ready" : "blocked"}`}>
        <span><strong>{summary.ownedKinds}</strong> / 52 种已拥有</span>
        <span><strong>{summary.duplicateKinds}</strong> 种有重复</span>
        <span><strong>{summary.upgradedKinds}</strong> 种已升级</span>
        <span><strong>{summary.inAlbum}</strong> / 26 卡册容量</span>
        <span><strong>{summary.inAlbumPower}</strong> 卡册总牌力</span>
      </div>
      <div className="suit-summary">
        {suits.map((suit) => (
          <span key={suit.id} className={suit.color}><strong>{suit.symbol}</strong>{suit.count}</span>
        ))}
      </div>
      <div className="screen-actions">
        <button data-open-packs onClick={onOpenPacks}>打开卡包</button>
        <button data-map onClick={onClose}>关闭背包</button>
      </div>
      <div className="backpack-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`mini-card ${card.color} ${card.inAlbum ? "in-album" : ""}`}
            data-album-toggle={card.id}
            disabled={card.disabled}
            onClick={() => onToggleCard(card.id)}
          >
            <strong>{card.rank}{card.symbol}</strong>
            <span className="card-count">x{card.count}</span>
            <span>Lv.{card.level} · 牌力{card.power}</span>
            <small>{card.hint}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
