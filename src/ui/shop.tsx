import { ArtFrame, SceneBanner } from "./primitives";

type ShopRelicSlotView = {
  index: number;
  sold: boolean;
  name: string;
  text: string;
  price: number;
  artSrc: string;
  disabledReason: string;
  disabled: boolean;
};

type ShopPackSlotView = {
  index: number;
  sold: boolean;
  label: string;
  description: string;
  price: number;
  artSrc: string;
  disabledReason: string;
  disabled: boolean;
};

type SellPackView = {
  id: string;
  label: string;
};

type ShopViewProps = {
  joker: number;
  relicAvailableCount: number;
  packAvailableCount: number;
  sellablePackCount: number;
  sceneSrc: string;
  relics: ShopRelicSlotView[];
  packs: ShopPackSlotView[];
  sellablePacks: SellPackView[];
  refreshText: string;
  canRefresh: boolean;
  onRefresh: () => void;
  onLeave: () => void;
  onBuyRelic: (index: number) => void;
  onBuyPack: (index: number) => void;
  onSellPack: (packId: string) => void;
};

export function ShopView({
  joker,
  relicAvailableCount,
  packAvailableCount,
  sellablePackCount,
  sceneSrc,
  relics,
  packs,
  sellablePacks,
  refreshText,
  canRefresh,
  onRefresh,
  onLeave,
  onBuyRelic,
  onBuyPack,
  onSellPack,
}: ShopViewProps) {
  return (
    <section className="panel outgame-panel">
      <div className="page-head">
        <div>
          <h2>商店</h2>
          <p className="small">购买藏品和卡包，或出售未开卡包。重复牌在制牌室中消耗。</p>
        </div>
        <div className="page-resources">
          <span>💰 {joker}</span>
        </div>
      </div>
      <div className="outgame-summary">
        <span><strong>{relicAvailableCount}</strong> 件藏品可购</span>
        <span><strong>{packAvailableCount}</strong> 个卡包栏</span>
        <span><strong>{sellablePackCount}</strong> 个卡包可售</span>
      </div>
      <SceneBanner src={sceneSrc} compact />
      <div className="section-head"><h3>藏品栏</h3><span>5 个栏位</span></div>
      <div className="shop-grid">
        {relics.length ? relics.map((slot) => (
          <button
            key={slot.index}
            className="shop-slot"
            data-buy-relic={slot.index}
            disabled={slot.disabled}
            onClick={() => onBuyRelic(slot.index)}
          >
            <ArtFrame src={slot.artSrc} className="relic-art-frame" imageClassName="relic-art" />
            <strong>{slot.sold ? "已售出" : slot.name}</strong>
            <span>{slot.text}</span>
            <em>{slot.price} Joker</em>
            <small>{slot.disabledReason}</small>
          </button>
        )) : <p className="small">藏品池已售空。</p>}
      </div>
      <div className="section-head"><h3>卡包栏</h3><span>2 个栏位</span></div>
      <div className="shop-grid pack-shop">
        {packs.map((slot) => (
          <button
            key={slot.index}
            className="shop-slot"
            data-buy-pack={slot.index}
            disabled={slot.disabled}
            onClick={() => onBuyPack(slot.index)}
          >
            <ArtFrame src={slot.artSrc} className="pack-art-frame small-art-frame" imageClassName="pack-art small-art" />
            <strong>{slot.sold ? "已售出" : slot.label}</strong>
            <span>{slot.description}</span>
            <em>{slot.price} Joker</em>
            <small>{slot.disabledReason}</small>
          </button>
        ))}
      </div>
      <div className="screen-actions">
        <button data-refresh-shop disabled={!canRefresh} onClick={onRefresh}>{refreshText}</button>
        <button data-continue onClick={onLeave}>离开</button>
      </div>
      <div className="section-head"><h3>出售未开卡包</h3><span>统一 +1 Joker</span></div>
      <div className="shop-grid pack-shop">
        {sellablePacks.length ? sellablePacks.map((pack) => (
          <button key={pack.id} className="shop-slot" data-sell-pack={pack.id} onClick={() => onSellPack(pack.id)}>
            <strong>{pack.label}</strong>
            <span>出售未开卡包</span>
            <em>+1 Joker</em>
          </button>
        )) : <p className="small">暂无可出售卡包。</p>}
      </div>
    </section>
  );
}
