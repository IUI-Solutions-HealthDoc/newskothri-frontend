"use client";

import type { VideoItem } from "../types/shows";

export type ShowsVideoFilter = "all" | "videos" | "shorts";

type TFn = (hi: string, en: string) => string;

export function partitionShowsVideos(videos: VideoItem[]) {
  const shorts = videos.filter((v) => v.isShort);
  const longForm = videos.filter((v) => !v.isShort);
  return { shorts, longForm };
}

export default function ShowsVideoFilterBar({
  value,
  onChange,
  counts,
  t,
}: {
  value: ShowsVideoFilter;
  onChange: (next: ShowsVideoFilter) => void;
  counts: { all: number; videos: number; shorts: number };
  t: TFn;
}) {
  const tabs: { id: ShowsVideoFilter; label: string; count: number }[] = [
    { id: "all", label: t("सभी", "All"), count: counts.all },
    { id: "videos", label: t("वीडियो", "Videos"), count: counts.videos },
    { id: "shorts", label: t("शॉर्ट्स", "Shorts"), count: counts.shorts },
  ];

  return (
    <div className="shows-yt-filter" role="tablist" aria-label={t("वीडियो फ़िल्टर", "Video filter")}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          className={`shows-yt-filter-btn${value === tab.id ? " shows-yt-filter-btn--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          <span className="shows-yt-filter-count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
