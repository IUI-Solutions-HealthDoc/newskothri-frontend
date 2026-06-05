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
}: {
  videos: VideoItem[];
  lang: "hi" | "en";
  t: TFn;
  title: string;
}) {
  if (!videos.length) return null;

  return (
    <div className="shows-cat-group">
      <div className="shows-cat-header" style={{ borderLeftColor: "#FF0000" }}>
        <Tv2 size={16} style={{ color: "#FF0000" }} />
        <h2 className="shows-cat-title" style={{ color: "var(--ink-900)" }}>
          {title}
        </h2>
        <span className="shows-yt-count">{videos.length}</span>
      </div>
      <div className="shows-page-grid">
        {videos.map((v, i) => (
          <ShowsVideoCard key={v.id} v={v} lang={lang} t={t} index={i} />
        ))}
      </div>
    </div>
  );
}
