import type { ReactNode } from "react";

type ArtFit = "cover" | "contain";

export type ArtFrameProps = {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fit?: ArtFit;
  decorative?: boolean;
};

export function ArtFrame({
  src,
  alt = "",
  className = "",
  imageClassName = "",
  fit = "contain",
  decorative = true,
}: ArtFrameProps) {
  return (
    <span className={`art-frame ${className}`.trim()}>
      <img
        className={imageClassName}
        src={src}
        alt={decorative ? "" : alt}
        aria-hidden={decorative ? "true" : undefined}
        data-art-fit={fit}
      />
    </span>
  );
}

export type SceneBannerProps = {
  src: string;
  compact?: boolean;
};

export function SceneBanner({ src, compact = false }: SceneBannerProps) {
  return (
    <ArtFrame
      src={src}
      className={`scene-frame ${compact ? "compact-scene-frame" : ""}`}
      imageClassName="scene-banner"
      fit="cover"
    />
  );
}

export type RelicTileProps = {
  artSrc: string;
  name: string;
  description: string;
  meta?: string;
  action?: ReactNode;
};

export function RelicTile({ artSrc, name, description, meta, action }: RelicTileProps) {
  return (
    <div className="ui-tile relic-tile">
      <ArtFrame src={artSrc} className="relic-art-frame" imageClassName="relic-art" />
      <strong>{name}</strong>
      <span>{description}</span>
      {meta ? <em>{meta}</em> : null}
      {action}
    </div>
  );
}
