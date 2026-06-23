import { ArtFrame } from "./primitives";

type PackGroupView = {
  quality: string;
  firstId: string;
  label: string;
  count: number;
  description: string;
  artSrc: string;
};

type PackSummaryView = {
  quality: string;
  label: string;
  count: number;
};

type PackManagerViewProps = {
  unopenedCount: number;
  joker: number;
  summaries: PackSummaryView[];
  groups: PackGroupView[];
  showBackpackButton: boolean;
  onOpenPack: (packId: string) => void;
  onBackpack: () => void;
  onClose: () => void;
};

export function PackManagerView({
  unopenedCount,
  joker,
  summaries,
  groups,
  showBackpackButton,
  onOpenPack,
  onBackpack,
  onClose,
}: PackManagerViewProps) {
  return (
    <section className="panel outgame-panel">
      <div className="page-head">
        <div>
          <h2>卡包管理</h2>
          <p className="small">战斗外随时可以打开卡包。每包开出4张牌，10%概率额外获得1 Joker。</p>
        </div>
        <div className="page-resources">
          <span>未开 {unopenedCount}</span>
          <span>💰 {joker}</span>
        </div>
      </div>
      <div className="outgame-summary">
        {summaries.map((summary) => (
          <span key={summary.quality}><strong>{summary.count}</strong> {summary.label}</span>
        ))}
      </div>
      <div className="pack-grid">
        {groups.length ? groups.map((group) => (
          <button key={group.quality} className="pack-card" data-open-pack={group.firstId} onClick={() => onOpenPack(group.firstId)}>
            <ArtFrame src={group.artSrc} className="pack-card-art-frame" imageClassName="pack-art" />
            <strong>{group.label}</strong>
            <span>x{group.count}</span>
            <em>{group.description}</em>
          </button>
        )) : <p className="small">暂无未打开卡包。</p>}
      </div>
      <div className="pack-rules">
        <strong>品质倾向</strong>
        <span>一级：84% 出 2/3/4；二级：84% 出 5/6/7；三级：84% 出 8/9/10；四级：84% 出 J/Q/K；五级：84% 出 A；剩余概率从其他点数随机。</span>
      </div>
      <div className="screen-actions">
        {showBackpackButton ? <button data-open-backpack onClick={onBackpack}>返回背包</button> : null}
        <button data-close-packs onClick={onClose}>关闭卡包</button>
      </div>
    </section>
  );
}
