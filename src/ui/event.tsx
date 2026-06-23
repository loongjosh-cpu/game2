import { SceneBanner } from "./primitives";

type EventTagView = {
  type: string;
  text: string;
};

type EventOptionView = {
  index: number;
  label: string;
  result: string;
  disabledReason: string;
  tags: EventTagView[];
};

type EventViewProps = {
  title: string;
  text: string;
  sceneSrc: string;
  options: EventOptionView[];
  onChoose: (index: number) => void;
};

export function EventView({ title, text, sceneSrc, options, onChoose }: EventViewProps) {
  return (
    <section className="panel outgame-panel event-panel">
      <div className="page-head">
        <div>
          <h2>事件 · {title}</h2>
          <p className="small">选择一个选项后结算，资源不足的选项不可选择。</p>
        </div>
      </div>
      <SceneBanner src={sceneSrc} />
      <p className="event-text">{text}</p>
      <div className="event-options">
        {options.map((option) => (
          <button
            key={option.index}
            className={`event-option ${option.disabledReason ? "blocked" : ""}`}
            data-event-option={option.index}
            disabled={Boolean(option.disabledReason)}
            onClick={() => onChoose(option.index)}
          >
            <small>选项 {option.index + 1}</small>
            <strong>{option.label}</strong>
            <span>{option.result}</span>
            <div className="event-tags">
              {option.tags.map((tag, index) => <b key={`${tag.type}-${index}`} className={tag.type}>{tag.text}</b>)}
            </div>
            {option.disabledReason ? <em>不可选择：{option.disabledReason}</em> : <em>可选择</em>}
          </button>
        ))}
      </div>
    </section>
  );
}
