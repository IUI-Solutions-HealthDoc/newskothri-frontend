"use client";

import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import YoutubeLazyEmbed from "../../../components/YoutubeLazyEmbed";
import type { VideoItem } from "../types/shows";

type TFn = (hi: string, en: string) => string;

export default function ShowsVideoCard({
  v,
  lang,
  t,
  index,
  isShort = false,
}: {
  v: VideoItem;
  lang: "hi" | "en";
  t: TFn;
  index: number;
  isShort?: boolean;
}) {
  const title = lang === "hi" ? v.title : v.titleEn;
  const published = lang === "hi" ? v.publishedHi : v.publishedEn;
  const short = isShort || v.isShort;

  return (
    <motion.article
      className={`shows-page-card${short ? " shows-page-card--short" : ""}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <div className={`shows-page-thumb${short ? " shows-page-thumb--short" : ""}`}>
        <YoutubeLazyEmbed
          youtubeUrl={v.youtubeUrl}
          title={title}
          thumbnail={v.thumbnail}
          playBtnClassName="shows-page-play"
          duration={
            v.duration ? (
              <span className="shows-duration">
                <Clock size={10} aria-hidden /> {v.duration}
              </span>
            ) : null
          }
        />
      </div>
      <div className="shows-page-card-body">
        {short ? (
          <span className="shows-short-badge">{t("शॉर्ट", "Short")}</span>
        ) : null}
        <a
          href={v.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open on YouTube"
        >
          <h3 className="shows-page-card-title">{title}</h3></a>
        <div className="shows-meta">
          {v.views ? (
            <>
              <Eye size={12} aria-hidden />
              <span>
                {v.views} {t("व्यूज़", "views")}
              </span>
            </>
          ) : null}
          {v.duration ? (
            <>
              {v.views ? <span className="shows-meta-dot" aria-hidden /> : null}
              <Clock size={12} aria-hidden />
              <span>{v.duration}</span>
            </>
          ) : null}
          {published ? (
            <>
              <span className="shows-meta-dot" aria-hidden />
              <span>{published}</span>
            </>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
