import { ArtFrame } from "./primitives";

type RewardLootView = {
  className: string;
  artSrc: string;
  icon: string;
  title: string;
  text: string;
};

type RewardUpgradeView = {
  level: number;
  rewards: string[];
};

type RewardViewProps = {
  title: string;
  lootCount: number;
  upgradeCount: number;
  lineCount: number;
  loot: RewardLootView[];
  upgrades: RewardUpgradeView[];
  lines: string[];
  continueText: string;
  onContinue: () => void;
};

export function RewardView({
  title,
  lootCount,
  upgradeCount,
  lineCount,
  loot,
  upgrades,
  lines,
  continueText,
  onContinue,
}: RewardViewProps) {
  const latest = upgrades[upgrades.length - 1];
  return (
    <section className="panel outgame-panel reward-panel">
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          <p className="small">本节点获得的资源、升级和额外效果会在这里统一确认。</p>
        </div>
        <div className="page-resources">
          <span>战利品 {lootCount}</span>
          <span>升级 {upgradeCount}</span>
          <span>记录 {lineCount}</span>
        </div>
      </div>
      {loot.length ? <RewardLoot loot={loot} /> : null}
      {latest ? (
        <>
          <div className="level-up-popover" role="status" aria-live="polite">
            <div className="level-burst">Lv.{latest.level}</div>
            <div>
              <strong>等级提升</strong>
              <span>{latest.rewards.join(" · ")}</span>
            </div>
          </div>
          <RewardUpgrades upgrades={upgrades} />
        </>
      ) : null}
      {lines.length ? <RewardLines lines={lines} /> : null}
      <div className="screen-actions">
        <button className="primary-action" data-continue onClick={onContinue}>{continueText}</button>
      </div>
    </section>
  );
}

function RewardLoot({ loot }: { loot: RewardLootView[] }) {
  return (
    <>
      <div className="section-head"><h3>战利品</h3><span>{loot.length}项</span></div>
      <div className="settlement-grid">
        {loot.map((item, index) => (
          <div key={`${item.title}-${index}`} className={`settlement-card ${item.className}`}>
            {item.artSrc ? (
              <ArtFrame src={item.artSrc} className="settlement-art-frame" />
            ) : (
              <span className="settlement-icon">{item.icon || "•"}</span>
            )}
            <strong>{item.title}</strong>
            <small>{item.text}</small>
          </div>
        ))}
      </div>
    </>
  );
}

function RewardUpgrades({ upgrades }: { upgrades: RewardUpgradeView[] }) {
  return (
    <>
      <div className="section-head"><h3>升级</h3><span>{upgrades.length}级</span></div>
      <div className="upgrade-summary">
        {upgrades.map((upgrade) => (
          <div key={upgrade.level} className="upgrade-row">
            <strong>Lv.{upgrade.level}</strong>
            <span>{upgrade.rewards.join(" · ")}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function RewardLines({ lines }: { lines: string[] }) {
  return (
    <>
      <div className="section-head"><h3>记录</h3></div>
      {lines.map((line, index) => <div key={`${line}-${index}`} className="reward-card">{line}</div>)}
    </>
  );
}
