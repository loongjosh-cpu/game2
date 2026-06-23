import { ArtFrame } from "./primitives";

type CardChoiceCardView = {
  id: string;
  rank: string;
  symbol: string;
  suitLabel: string;
  color: string;
  level: number;
  count: number;
  disabled: boolean;
  picked: boolean;
  actionText: string;
};

type CardChoiceViewProps = {
  title: string;
  text: string;
  progressText: string;
  cards: CardChoiceCardView[];
  onChoose: (cardId: string) => void;
};

type RelicChoiceViewProps = {
  title: string;
  relics: {
    id: string;
    name: string;
    text: string;
    artSrc: string;
  }[];
  onChoose: (relicId: string) => void;
};

export function CardChoiceView({ title, text, progressText, cards, onChoose }: CardChoiceViewProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p className="event-text">{text}</p>
      {progressText ? <p className="small">{progressText}</p> : null}
      <div className="card-grid compact">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`card ${card.color} ${card.picked ? "selected" : ""}`}
            data-choice-card={card.id}
            disabled={card.disabled || card.picked}
            onClick={() => onChoose(card.id)}
          >
            <strong>{card.rank}{card.symbol}</strong>
            <span>{card.suitLabel}</span>
            <small>Lv.{card.level} / {card.count}张</small>
            <small>{card.picked ? "已选择" : card.actionText}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function RelicChoiceView({ title, relics, onChoose }: RelicChoiceViewProps) {
  return (
    <section className="panel outgame-panel">
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          <p className="small">从候选藏品中选择 1 个获得，其余候选会消失。</p>
        </div>
      </div>
      <div className="shop-grid">
        {relics.map((relic) => (
          <button key={relic.id} className="shop-slot" data-choice-relic={relic.id} onClick={() => onChoose(relic.id)}>
            <ArtFrame src={relic.artSrc} className="relic-art-frame" imageClassName="relic-art" />
            <strong>{relic.name}</strong>
            <span>{relic.text}</span>
            <em>选择后获得</em>
          </button>
        ))}
      </div>
    </section>
  );
}
