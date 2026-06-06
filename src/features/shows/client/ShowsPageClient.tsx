"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../../../context/LangContext";
import ShowsPageHeader from "../components/ShowsPageHeader";
import ShowsStatsRow from "../components/ShowsStatsRow";
import ShowsVideoFilterBar, {
  partitionShowsVideos,
  type ShowsVideoFilter,
} from "../components/ShowsVideoFilterBar";
import ShowsVideoGrid from "../components/ShowsVideoGrid";
import { useShowsVideos } from "../hooks/useShowsVideos";
import type { YoutubeChannelStats } from "../../../lib/youtube/fetchChannelStats";
import type { VideoItem } from "../types/shows";

export default function ShowsPageClient({
  channelStats,
  initialVideos = [],
}: {
  channelStats: YoutubeChannelStats | null;
  initialVideos?: VideoItem[];
}) {
  const { lang, t } = useLang();
  const { videos, loading } = useShowsVideos(lang, initialVideos);
  const [filter, setFilter] = useState<ShowsVideoFilter>("all");

  const { shorts, longForm } = useMemo(() => partitionShowsVideos(videos), [videos]);

  const counts = useMemo(
    () => ({
      all: videos.length,
      videos: longForm.length,
      shorts: shorts.length,
    }),
    [videos.length, longForm.length, shorts.length]
  );

  const showFilter = shorts.length > 0 && longForm.length > 0;

  return (
    <motion.div className="shows-page" initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ShowsPageHeader t={t} />
      <div className="shows-page-body">
        <ShowsStatsRow t={t} stats={channelStats} />
        {loading && videos.length === 0 ? (
          <div className="shows-loading-grid" aria-busy="true" aria-label={t("वीडियो लोड हो रहे हैं", "Loading videos")}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shows-loading-card" />
            ))}
          </div>
        ) : null}
        {!loading && videos.length === 0 ? (
          <p className="shows-page-sub">
            {t("वीडियो फ़ीड उपलब्ध नहीं है।", "Video feed is currently unavailable.")}
          </p>
        ) : null}
        {!loading && videos.length > 0 && showFilter ? (
          <ShowsVideoFilterBar value={filter} onChange={setFilter} counts={counts} t={t} />
        ) : null}
        {!loading && videos.length > 0 ? (
          <>
            {(filter === "all" || filter === "videos") && longForm.length > 0 ? (
              <ShowsVideoGrid
                videos={longForm}
                lang={lang}
                t={t}
                title={t("वीडियो", "Videos")}
                variant="video"
              />
            ) : null}
            {(filter === "all" || filter === "shorts") && shorts.length > 0 ? (
              <ShowsVideoGrid
                videos={shorts}
                lang={lang}
                t={t}
                title={t("शॉर्ट्स", "Shorts")}
                variant="short"
              />
            ) : null}
            {filter === "videos" && longForm.length === 0 ? (
              <p className="shows-page-sub">{t("कोई लंबा वीडियो नहीं मिला।", "No regular videos found.")}</p>
            ) : null}
            {filter === "shorts" && shorts.length === 0 ? (
              <p className="shows-page-sub">{t("कोई शॉर्ट नहीं मिला।", "No Shorts found.")}</p>
            ) : null}
          </>
        ) : null}
      </div>
    </motion.div>
  );
}
