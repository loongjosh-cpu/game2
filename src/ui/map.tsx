type MapRelicView = {
  id: string;
  name: string;
};

type MapFlowView = {
  currentStep: number;
  availableCount: number;
  unopenedPackCount: number;
  traverseText: string;
};

type MapLinkView = {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  parallel: boolean;
  hidden: boolean;
  active: boolean;
  done: boolean;
};

type MapNodeView = {
  id: string;
  type: string;
  x: number;
  y: number;
  visible: boolean;
  available: boolean;
  done: boolean;
  current: boolean;
  parallel: boolean;
  stateLabel: string;
  icon: string;
  assetSrc: string;
  typeLabel: string;
  hint: string;
};

type MapViewProps = {
  layer: number;
  scoutText: string;
  hpText: string;
  levelText: string;
  expText: string;
  relics: MapRelicView[];
  flow: MapFlowView;
  joker: number;
  links: MapLinkView[];
  nodes: MapNodeView[];
  onOpenBackpack: () => void;
  onOpenLab: () => void;
  onOpenPacks: () => void;
  onOpenNode: (nodeId: string) => void;
  onDetailRelic: (relicId: string) => void;
};

export function MapView({
  layer,
  scoutText,
  hpText,
  levelText,
  expText,
  relics,
  flow,
  joker,
  links,
  nodes,
  onOpenBackpack,
  onOpenLab,
  onOpenPacks,
  onOpenNode,
  onDetailRelic,
}: MapViewProps) {
  return (
    <section className="panel map-panel">
      <div className="map-header">
        <div>
          <h2>第{layer}层路线</h2>
          <p className="small">只能前进到当前可抵达节点；并行穿行会消耗2个未开卡包。{scoutText}。</p>
        </div>
        <div className="map-hud">
          <div className="map-vitals">
            <span>♥ {hpText}</span>
            <span>{levelText}</span>
            <span>EXP {expText}</span>
          </div>
          <div className="map-relics" data-map-relics>
            {relics.length ? relics.map((relic) => (
              <button key={relic.id} className="tag" data-detail-relic={relic.id} onClick={() => onDetailRelic(relic.id)}>
                {relic.name}
              </button>
            )) : <span className="small">暂无藏品</span>}
          </div>
        </div>
      </div>
      <div className="map-flow">
        <span>进度 {flow.currentStep}/5</span>
        <span>可前往 {flow.availableCount}</span>
        <span>未开卡包 {flow.unopenedPackCount}</span>
        <span>{flow.traverseText}</span>
      </div>
      <div className="map-grid">
        <svg className="map-connections" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          {links.map((link) => (
            <line
              key={`${link.from}-${link.to}`}
              className={[
                "map-link",
                link.parallel ? "parallel" : "main",
                link.hidden ? "hidden" : "",
                link.active ? "active" : "",
                link.done ? "done" : "",
              ].join(" ")}
              data-from={link.from}
              data-to={link.to}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
            />
          ))}
        </svg>
        <div className="map-node-layer">
          {nodes.map((node) => <MapNode key={node.id} node={node} onOpenNode={onOpenNode} />)}
        </div>
      </div>
      <div className="map-resourcebar">
        <button data-open-backpack onClick={onOpenBackpack}>🎒 背包</button>
        <button data-open-lab onClick={onOpenLab}>实验室</button>
        <span>💰 {joker}</span>
        <button data-open-packs onClick={onOpenPacks}>📦 {flow.unopenedPackCount}</button>
      </div>
    </section>
  );
}

function MapNode({ node, onOpenNode }: { node: MapNodeView; onOpenNode: (nodeId: string) => void }) {
  const style = { left: `${node.x / 10}%`, top: `${node.y / 10}%` };
  if (!node.visible) {
    return (
      <button className="node node-fog-map" data-hidden-node={node.id} style={style} disabled>
        <span className="node-state">未知</span>
        <span className="node-icon"><img src={node.assetSrc} alt="" aria-hidden="true" /><i>?</i></span>
        <strong>未知</strong>
        <span className="small">未侦查</span>
      </button>
    );
  }
  const className = [
    "node",
    node.available ? "available" : "",
    node.done ? "done" : "",
    node.current ? "current" : "",
    node.parallel ? "parallel" : "",
    `node-${node.type}`,
  ].join(" ");
  return (
    <button
      className={className}
      data-node={node.id}
      style={style}
      disabled={!node.available}
      onClick={() => {
        if (node.available) onOpenNode(node.id);
      }}
    >
      <span className="node-state">{node.stateLabel}</span>
      <span className="node-icon"><img src={node.assetSrc} alt="" aria-hidden="true" /><i>{node.icon}</i></span>
      <strong>{node.typeLabel}</strong>
      <span className="small">{node.hint || node.id}</span>
    </button>
  );
}
