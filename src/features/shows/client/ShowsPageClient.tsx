"use client";

import { motion } from "framer-motion";
import { useLang } from "../../../context/LangContext";
import ShowsPageHeader from "../components/ShowsPageHeader";
import ShowsStatsRow from "../components/ShowsStatsRow";
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
        <ShowsVideoGrid
          videos={videos}
          lang={lang}
          t={t}
          title={t("चैनल पर सभी वीडियो", "All channel videos")}
        />
      </div>
    </motion.div>
  );
}
