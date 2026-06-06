"use client";

import { Tv2 } from "lucide-react";
import type { VideoItem } from "../types/shows";
import ShowsVideoCard from "./ShowsVideoCard";

type TFn = (hi: string, en: string) => string;

export default function ShowsVideoGrid({
  videos,
  lang,
  t,
  title,
  variant = "video",
}: {
  videos: VideoItem[];
  lang: "hi" | "en";
  t: TFn;
  title: string;
  variant?: "video" | "short";
}) {
  if (!videos.length) return null;

  const gridClass =
    variant === "short" ? "shows-page-grid shows-page-grid--shorts" : "shows-page-grid";

  return (
    <div className="shows-cat-group">
      <div className="shows-cat-header" style={{ borderLeftColor: "#FF0000" }}>
        <Tv2 size={16} style={{ color: "#FF0000" }} />
        <h2 className="shows-cat-title" style={{ color: "var(--ink-900)" }}>
          {title}
        </h2>
        <span className="shows-yt-count">{videos.length}</span>
      </div>
      <div className={gridClass}>
        {videos.map((v, i) => (
          <ShowsVideoCard key={v.id} v={v} lang={lang} t={t} index={i} isShort={variant === "short"} />
        ))}
      </div>
    </div>
  );
}
