import { motion } from "framer-motion";
import { Clock, Eye, Tv2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import BrandLogo from "./BrandLogo";
import YoutubeLazyEmbed from "./YoutubeLazyEmbed";
import { useYoutubeChannelVideos } from "../hooks/useYoutubeChannelVideos";
import { useYoutubeChannelStats } from "../hooks/useYoutubeChannelStats";
import { formatSubscriberSubtitle } from "../lib/youtube/formatChannelCount";

export default function VideoSection() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { videos, loading } = useYoutubeChannelVideos({ limit: 12, locale: lang });
  const { stats: channelStats } = useYoutubeChannelStats();

  if (!loading && videos.length === 0) return null;

  const featured = videos[0];
  const stack = videos.slice(1, 5);

  const featuredTitle = featured ? (lang === "hi" ? featured.title : featured.titleEn) : "";
  const featuredPublished = featured
    ? lang === "hi"
      ? featured.publishedHi
      : featured.publishedEn
    : "";

  return (
    <section className="section video-section">
      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-title-wrap" style={{ alignItems: "center", gap: 10 }}>
            <Tv2 size={17} style={{ color: "var(--brand-red)" }} aria-hidden />
            <h2 className="section-title">{t("वीडियो", "Videos")}</h2>
            <span className="video-live-badge">
              <span className="video-live-dot" />
              {t("YouTube", "YouTube")}
            </span>
          </div>
          <button type="button" className="section-more-btn" onClick={() => navigate("/shows")}>
            {t("सभी वीडियो", "All Videos")} <ArrowRight size={14} aria-hidden />
          </button>
        </motion.div>

        {loading && !featured ? (
          <div className="video-layout" aria-busy="true">
            <div className="video-featured-skeleton" />
            <div className="video-stack-skeleton" />
          </div>
        ) : featured ? (
          <div className="video-layout">
            <motion.article
              className="video-featured"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="video-thumb-wrap">
                <YoutubeLazyEmbed
                  youtubeUrl={featured.youtubeUrl}
                  title={featuredTitle}
                  thumbnail={featured.thumbnail}
                  playBtnClassName="video-play-btn"
                  playSize="lg"
                  duration={
                    featured.duration ? (
                      <div className="video-duration">
                        <Clock size={11} aria-hidden />
                        {featured.duration}
                      </div>
                    ) : null
                  }
                />
              </div>
              <div className="video-body">
                <div className="video-channel-row">
                  <BrandLogo className="video-channel-logo" height={36} decorative />
                  <div>
                    <div className="video-channel-name">{t("टीवी", "TV")}</div>
                    <div className="video-channel-sub">
                      {channelStats
                        ? formatSubscriberSubtitle(channelStats.subscribersFormatted, lang)
                        : t("सब्सक्राइबर्स", "subscribers")}
                    </div>
                  </div>
                </div>
                <h3 className="video-featured-title">{featuredTitle}</h3>
                <div className="card-meta" style={{ marginTop: 8 }}>
                  {featured.views ? (
                    <>
                      <Eye size={12} aria-hidden />
                      <span>
                        {featured.views} {t("व्यूज़", "views")}
                      </span>
                    </>
                  ) : null}
                  {featured.duration ? (
                    <>
                      {featured.views ? <span className="card-meta-dot" /> : null}
                      <Clock size={12} aria-hidden />
                      <span>{featured.duration}</span>
                    </>
                  ) : null}
                  {featuredPublished ? (
                    <>
                      <span className="card-meta-dot" />
                      <span>{featuredPublished}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.article>

            <div className="video-stack">
              {stack.map((video, i) => {
                const title = lang === "hi" ? video.title : video.titleEn;
                const published = lang === "hi" ? video.publishedHi : video.publishedEn;
                return (
                  <motion.article
                    key={video.id}
                    className="video-stack-item"
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <div className="video-stack-thumb-wrap">
                      <YoutubeLazyEmbed
                        youtubeUrl={video.youtubeUrl}
                        title={title}
                        thumbnail={video.thumbnail}
                        playBtnClassName="video-stack-play"
                        playSize="sm"
                        duration={
                          video.duration ? (
                            <div className="video-duration video-stack-duration">{video.duration}</div>
                          ) : null
                        }
                      />
                    </div>
                    <div className="video-stack-body">
                      <h4 className="video-stack-title">{title}</h4>
                      <div className="card-meta" style={{ marginTop: 4 }}>
                        {video.views ? (
                          <>
                            <Eye size={11} aria-hidden />
                            <span>{video.views}</span>
                          </>
                        ) : null}
                        {published ? (
                          <>
                            {video.views ? <span className="card-meta-dot" /> : null}
                            <span>{published}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
