import { ArtFrame } from "./primitives";

type TopbarViewProps = {
  visible: boolean;
  seed: string;
  layer: number;
  nodeCount: number;
  stats: { label: string; value: string | number }[];
  onOpenGuide: () => void;
  onSave: () => void;
};

type SideViewProps = {
  runActive: boolean;
  startStats: { label: string; value: number }[];
  hero?: {
    avatarSrc: string;
    hpText: string;
    attack: number;
    defense: number;
    speed: number;
    levelText: string;
    expText: string;
    joker: number;
    packs: number;
    albumText: string;
  };
  canUseOutgameInventory: boolean;
  packTags: { id: string; label: string }[];
  relicTags: { id: string; name: string; title: string }[];
  logEntries: string[];
  onOpenGuide: () => void;
  onNewRun: () => void;
  onOpenBackpack: () => void;
  onOpenPacks: () => void;
  onOpenPack: (packId: string) => void;
  onDetailRelic: (relicId: string) => void;
};

export function TopbarView({ visible, seed, layer, nodeCount, stats, onOpenGuide, onSave }: TopbarViewProps) {
  if (!visible) return null;
  return (
    <header className="topbar">
      <div className="title">
        <h1>梦境牌国：持牌人原型</h1>
        <div className="subtitle">Seed {seed} · 第{layer}层 · 节点 {nodeCount}</div>
      </div>
      <div className="stats">
        {stats.map((stat) => <span key={stat.label} className="pill">{stat.label} <strong>{stat.value}</strong></span>)}
        <button data-open-guide onClick={onOpenGuide}>规则速览</button>
        <button data-save onClick={onSave}>保存</button>
      </div>
    </header>
  );
}

export function SideView({
  runActive,
  startStats,
  hero,
  canUseOutgameInventory,
  packTags,
  relicTags,
  logEntries,
  onOpenGuide,
  onNewRun,
  onOpenBackpack,
  onOpenPacks,
  onOpenPack,
  onDetailRelic,
}: SideViewProps) {
  if (!runActive) {
    return (
      <div className="start-side">
        <h3>项目展示点</h3>
        <p className="small">这是一个无需后端的 Vite 静态网页游戏，适合部署到 GitHub Pages。</p>
        <div className="side-summary">
          <strong>系统规模</strong>
          {startStats.map((stat) => <span key={stat.label}>{stat.label} {stat.value}</span>)}
        </div>
        <button data-open-guide onClick={onOpenGuide}>规则速览</button>
        <button data-new-run onClick={onNewRun}>随机 Seed 开始</button>
      </div>
    );
  }
  if (!hero) return null;
  return (
    <>
      <div className="side-summary">
        <ArtFrame src={hero.avatarSrc} className="side-avatar-frame" imageClassName="side-hero-avatar" fit="cover" />
        <strong>持牌人</strong>
        <span>♥ {hero.hpText}</span>
        <span>⚔ {hero.attack}</span>
        <span>🛡 {hero.defense}</span>
        <span>👢 {hero.speed}</span>
        <span>{hero.levelText}</span>
        <span>EXP {hero.expText}</span>
        <span>💰 {hero.joker}</span>
        <span>📦 {hero.packs}</span>
      </div>
      <div className="side-section-head">
        <h3>资源</h3>
        <span>{canUseOutgameInventory ? "战斗外可整理" : "战斗中锁定"}</span>
      </div>
      <div className="screen-actions side-actions">
        <button data-open-backpack disabled={!canUseOutgameInventory} onClick={onOpenBackpack}>背包 {hero.albumText}</button>
        <button data-open-packs disabled={!canUseOutgameInventory} onClick={onOpenPacks}>卡包 {hero.packs}</button>
        <button data-open-guide onClick={onOpenGuide}>规则</button>
      </div>
      <div className="inventory-list">
        {packTags.length ? packTags.map((pack) => (
          <button key={pack.id} className="tag" data-open-pack={pack.id} disabled={!canUseOutgameInventory} onClick={() => onOpenPack(pack.id)}>
            {pack.label}
          </button>
        )) : <span className="small">暂无卡包</span>}
      </div>
      <div className="side-section-head">
        <h3>藏品</h3>
        <span>{relicTags.length}</span>
      </div>
      <div className="relic-list">
        {relicTags.length ? relicTags.map((relic) => (
          <button key={relic.id} className="tag" data-detail-relic={relic.id} title={relic.title} onClick={() => onDetailRelic(relic.id)}>
            {relic.name}
          </button>
        )) : <span className="small">暂无藏品</span>}
      </div>
      <div className="side-section-head">
        <h3>日志</h3>
        <span>最近 {Math.min(logEntries.length, 80)} 条</span>
      </div>
      <div className="log">{logEntries.map((entry, index) => <p key={`${entry}-${index}`} className={index === 0 ? "latest" : ""}>{entry}</p>)}</div>
    </>
  );
}
