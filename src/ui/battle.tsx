import { ArtFrame } from "./primitives";

type BattleViewProps = {
  title: string;
  subtitle: string;
  deck: {
    draw: number;
    discard: number;
    focus: number;
    extraConsume: number;
  };
  tactical: {
    speedOrderHtml: string;
    targetName: string;
    rerollCostText: string;
    keepCardText: string;
  };
  combatSummaryHtml: string;
  stage: BattleStageProps;
  cards: BattleCardsProps;
  control: BattleControlPanelProps;
};

export function BattleView({
  title,
  subtitle,
  deck,
  tactical,
  combatSummaryHtml,
  stage,
  cards,
  control,
}: BattleViewProps) {
  return (
    <section className="panel battlefield">
      <div className="battle-header">
        <div>
          <h2>{title}</h2>
          <p className="small">{subtitle}</p>
        </div>
        <div className="deck-status">
          <span>抽牌 <strong>{deck.draw}</strong></span>
          <span>弃牌 <strong>{deck.discard}</strong></span>
          <span>调度 <FocusDots count={deck.focus} /></span>
          <span>补牌 <strong>{deck.extraConsume}</strong></span>
        </div>
      </div>
      <div className="battle-tacticalbar">
        <span>行动顺序：<span dangerouslySetInnerHTML={{ __html: tactical.speedOrderHtml }} /></span>
        <span>主目标：{tactical.targetName}</span>
        <span>重抽费用：{tactical.rerollCostText}</span>
        <span>保留牌：{tactical.keepCardText}</span>
      </div>
      <div className="battle-stage">
        <BattleStage {...stage} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: combatSummaryHtml }} />
      <BattleCards {...cards} />
      <BattleControlPanel {...control} />
    </section>
  );
}

function FocusDots({ count }: { count: number }) {
  const max = Math.max(count, 3);
  return (
    <>
      {Array.from({ length: max }, (_, index) => <i key={index} className={index < count ? "on" : ""} />)}
    </>
  );
}

type HeroPanelProps = {
  artSrc: string;
  levelText: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  shield: number;
  recentHit: boolean;
  statusHtml: string;
  onShowStatus: () => void;
};

export function HeroPanel({
  artSrc,
  levelText,
  hp,
  maxHp,
  attack,
  defense,
  speed,
  shield,
  recentHit,
  statusHtml,
  onShowStatus,
}: HeroPanelProps) {
  return (
    <div className={`hero-panel ${recentHit ? "recent-hit" : ""}`}>
      <div className="hero-content">
        <div className="hero-title">
          <span>♚ 持牌人</span>
          <span>{levelText}</span>
        </div>
        <div className="hero-hp">
          <div className="bar">
            <i style={{ width: `${Math.max(0, (hp / maxHp) * 100)}%` }} />
          </div>
          <span>♥ {hp}/{maxHp}</span>
        </div>
        <div className="hero-stats">
          <span>⚔ {attack}</span>
          <span>🛡 {defense}</span>
          <span>👢 {speed}</span>
          <span>护盾 {shield}</span>
        </div>
        <div onClick={onShowStatus} dangerouslySetInnerHTML={{ __html: statusHtml }} />
      </div>
      <ArtFrame src={artSrc} className="hero-art-frame" imageClassName="hero-art" fit="cover" />
    </div>
  );
}

type EnemyCardProps = {
  id: string;
  name: string;
  artSrc: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  shield: number;
  speed: number;
  selected: boolean;
  boss: boolean;
  elite: boolean;
  dead: boolean;
  statusHtml: string;
  intentTypeLabel: string;
  intentDetail: string;
  intentIconHtml: string;
  traitSummary: string;
  onSelect: () => void;
  onShowIntent: () => void;
  onShowTrait: () => void;
  onShowStatus: () => void;
};

export function EnemyCard({
  id,
  name,
  artSrc,
  hp,
  maxHp,
  attack,
  defense,
  shield,
  speed,
  selected,
  boss,
  elite,
  dead,
  statusHtml,
  intentTypeLabel,
  intentDetail,
  intentIconHtml,
  traitSummary,
  onSelect,
  onShowIntent,
  onShowTrait,
  onShowStatus,
}: EnemyCardProps) {
  return (
    <div
      className={`enemy ${boss ? "boss" : ""} ${elite ? "elite" : ""} ${dead ? "dead" : ""} ${selected ? "targeted" : ""}`}
      data-target-enemy-card={id}
      onClick={() => {
        if (!dead) onSelect();
      }}
    >
      <div className="enemy-main">
        <div className="enemy-content">
          <div className="enemy-name">
            <button
              className="enemy-focus"
              data-target-enemy={id}
              disabled={dead}
              onClick={(event) => {
                event.stopPropagation();
                if (!dead) onSelect();
              }}
            >
              {name}
            </button>
            <span>{selected ? "主目标 · " : ""}速{speed}</span>
          </div>
          <div className="enemy-vitals">
            <button
              className="intent-icon"
              data-detail-intent={id}
              disabled={dead}
              onClick={(event) => {
                event.stopPropagation();
                if (!dead) onShowIntent();
              }}
              dangerouslySetInnerHTML={{ __html: intentIconHtml }}
            />
            <div className="bar">
              <i style={{ width: `${Math.max(0, (hp / maxHp) * 100)}%` }} />
            </div>
            {shield > 0 ? <span className="shield-chip">护{shield}</span> : null}
          </div>
          <div className="small">HP {hp}/{maxHp} · 攻{attack} · 防{defense}{selected ? " · 主目标" : ""}</div>
          <div
            onClick={(event) => {
              event.stopPropagation();
              onShowStatus();
            }}
            dangerouslySetInnerHTML={{ __html: statusHtml }}
          />
        </div>
        <ArtFrame src={artSrc} className="enemy-art-frame" imageClassName="enemy-art" fit="cover" />
      </div>
      <div className="intent enemy-intent">
        <strong>{intentTypeLabel}</strong>
        <span>{intentDetail}</span>
      </div>
      <div className="intent enemy-trait">
        <strong>
          特性
          {traitSummary ? (
            <button
              data-detail-trait={id}
              onClick={(event) => {
                event.stopPropagation();
                onShowTrait();
              }}
            >
              详情
            </button>
          ) : null}
        </strong>
        <span>{traitSummary || "无特殊特性"}</span>
      </div>
    </div>
  );
}

type BattleStageProps = {
  hero: HeroPanelProps;
  enemies: EnemyCardProps[];
};

export function BattleStage({ hero, enemies }: BattleStageProps) {
  return (
    <>
      <HeroPanel {...hero} />
      <div className="enemy-grid">
        {enemies.map((enemy) => <EnemyCard key={enemy.id} {...enemy} />)}
      </div>
    </>
  );
}

type BattleCardView = {
  uid: string;
  rank: string;
  symbol: string;
  color: string;
  level: number;
  power: number;
  selectedIndex: number;
};

type BattleCardsProps = {
  frameSrc: string;
  selectedCards: BattleCardView[];
  handCards: BattleCardView[];
  selectedCount: number;
  onToggleCard: (uid: string) => void;
};

export function BattleCards({
  frameSrc,
  selectedCards,
  handCards,
  selectedCount,
  onToggleCard,
}: BattleCardsProps) {
  return (
    <>
      <JudgeSlots cards={selectedCards} onToggleCard={onToggleCard} />
      <div className="battle-hand-title">
        <span>手牌区</span>
        <span className="small">已选 {selectedCount}/5</span>
      </div>
      <div className="hand">
        {handCards.map((card) => <HandCard key={card.uid} card={card} frameSrc={frameSrc} onToggleCard={onToggleCard} />)}
      </div>
    </>
  );
}

type JudgeSlotsProps = {
  cards: BattleCardView[];
  onToggleCard: (uid: string) => void;
};

function JudgeSlots({ cards, onToggleCard }: JudgeSlotsProps) {
  const slots = Array.from({ length: 5 }, (_, index) => cards[index] || null);
  return (
    <div className="judgement">
      {slots.map((card, index) => (
        <button
          key={card?.uid || `slot-${index}`}
          className={`judge-slot ${index === 0 ? "keep" : ""} ${card ? "filled" : ""}`}
          data-card={card?.uid}
          disabled={!card}
          onClick={() => {
            if (card) onToggleCard(card.uid);
          }}
        >
          {card ? (
            <>
              <span className={card.color}>{card.rank}{card.symbol}</span>
              <small>{index === 0 ? "保留" : `第${index + 1}张`}</small>
            </>
          ) : (
            <>
              <span>{index === 0 ? "★" : index + 1}</span>
              <small>{index === 0 ? "保留位" : "待选"}</small>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

type HandCardProps = {
  card: BattleCardView;
  frameSrc: string;
  onToggleCard: (uid: string) => void;
};

function HandCard({ card, frameSrc, onToggleCard }: HandCardProps) {
  return (
    <button
      className={`card ${card.color} ${card.selectedIndex >= 0 ? "selected" : ""}`}
      data-card={card.uid}
      onClick={() => onToggleCard(card.uid)}
    >
      <img className="card-frame-art" src={frameSrc} alt="" aria-hidden="true" />
      {card.selectedIndex >= 0 ? <span className="selected-order">{card.selectedIndex + 1}</span> : null}
      {card.selectedIndex === 0 ? <span className="keep-badge">保留</span> : null}
      <span className="rank">{card.rank}</span>
      <span className="suit">{card.symbol}</span>
      <span className="card-meta">Lv.{card.level} · 牌力{card.power}</span>
    </button>
  );
}

type PreviewRuleGroup = {
  title: string;
  lines: string[];
};

type BattlePreviewProps = {
  ready: boolean;
  suggestionText: string;
  handName?: string;
  handDetail?: string;
  targetText?: string;
  targetDamage?: string | number;
  damageText?: string;
  piercePercent?: number;
  pierceText?: string;
  suitState?: string;
  suitText?: string;
  keepCard?: string;
  discardText?: string;
  ruleGroups?: PreviewRuleGroup[];
  relicTriggers?: string[];
};

type BattleActionsProps = {
  canPlay: boolean;
  canReroll: boolean;
  canTempConsume: boolean;
  tempHint: string;
  onPlay: () => void;
  onPickSuggestion: () => void;
  onReroll: () => void;
  onOpenTempConsume: () => void;
  onClear: () => void;
};

type BattleControlPanelProps = {
  preview: BattlePreviewProps;
  actions: BattleActionsProps;
};

export function BattleControlPanel({ preview, actions }: BattleControlPanelProps) {
  return (
    <>
      <BattlePreview {...preview} />
      <BattleActions {...actions} />
    </>
  );
}

function BattlePreview({
  ready,
  suggestionText,
  handName,
  handDetail,
  targetText,
  targetDamage,
  damageText,
  piercePercent,
  pierceText,
  suitState,
  suitText,
  keepCard,
  discardText,
  ruleGroups = [],
  relicTriggers = [],
}: BattlePreviewProps) {
  if (!ready) {
    return (
      <div className="battle-preview muted">
        <div className="preview-main">
          <strong>牌型预览</strong>
          <span>选择5张牌后显示倍率、花色、牌力穿甲和预估伤害。</span>
          <em>第1张牌会保留回手</em>
        </div>
        <div className="preview-advice">
          <strong>建议</strong>
          <span>{suggestionText}</span>
          <em>点击“选择建议”可自动填入判定区</em>
        </div>
      </div>
    );
  }

  return (
    <div className="battle-preview detailed">
      <div className="preview-main">
        <small>牌型</small>
        <strong>{handName}</strong>
        <span>{handDetail}</span>
        <em>目标：{targetText}</em>
      </div>
      <div className="preview-metric major">
        <small>主目标预估</small>
        <strong>{targetDamage || "-"}</strong>
        <span>{damageText}</span>
      </div>
      <div className="preview-metric">
        <small>牌力穿甲</small>
        <strong>{piercePercent}%</strong>
        <span>{pierceText}</span>
      </div>
      <div className="preview-metric">
        <small>花色</small>
        <strong>{suitState}</strong>
        <span>{suitText}</span>
      </div>
      <div className="preview-metric keep-plan">
        <small>保留/弃牌</small>
        <strong>{keepCard}</strong>
        <span>{discardText}</span>
      </div>
      {ruleGroups.map((group) => (
        <div className="preview-rules" key={group.title}>
          <strong>{group.title}</strong>
          <span>{group.lines.length ? group.lines.map((line) => <b key={line}>{line}</b>) : <b>未触发花色效果</b>}</span>
        </div>
      ))}
      <div className="preview-relics">
        <strong>本次可能触发</strong>
        <span>{relicTriggers.length ? relicTriggers.map((name) => <b key={name}>{name}</b>) : "无藏品触发"}</span>
      </div>
    </div>
  );
}

function BattleActions({
  canPlay,
  canReroll,
  canTempConsume,
  tempHint,
  onPlay,
  onPickSuggestion,
  onReroll,
  onOpenTempConsume,
  onClear,
}: BattleActionsProps) {
  return (
    <>
      <div className="battle-actions">
        <button data-play disabled={!canPlay} onClick={onPlay}>确认出牌</button>
        <button data-pick-suggestion onClick={onPickSuggestion}>选择建议</button>
        <button data-reroll disabled={!canReroll} onClick={onReroll}>调度重抽选中3张</button>
        <button data-open-temp-consume title={tempHint} disabled={!canTempConsume} onClick={onOpenTempConsume}>一次性补牌</button>
        <button data-clear onClick={onClear}>清除选择</button>
      </div>
      <p className="battle-action-hint">一次性补牌：{tempHint}</p>
    </>
  );
}
