"use client";

import type { YoutubeChannelStats } from "../../../lib/youtube/fetchChannelStats";

type TFn = (hi: string, en: string) => string;

export default function ShowsStatsRow({
  t,
  stats,
}: {
  t: TFn;
  stats: YoutubeChannelStats | null;
}) {
  const placeholder = "—";
  const rows = [
    {
      label: t("सब्सक्राइबर्स", "Subscribers"),
      value: stats?.subscribersFormatted ?? placeholder,
    },
    {
      label: t("वीडियो", "Videos"),
      value: stats ? `${stats.videosFormatted}+` : placeholder,
    },
    {
      label: t("व्यूज़", "Total Views"),
      value: stats?.viewsFormatted ?? placeholder,
    },
  ];

  return (
    <div className="shows-stats-row" aria-busy={!stats}>
      {rows.map((s) => (
        <div key={s.label} className="shows-stat-card">
          <p className="shows-stat-value">{s.value}</p>
          <p className="shows-stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
