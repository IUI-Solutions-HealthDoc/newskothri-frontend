import { motion } from "framer-motion";
import { Clock, Eye, ArrowRight } from "lucide-react";

const YtIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
  </svg>
);
import { useLang } from "../context/LangContext";
import { useNavigate } from "react-router-dom";
import YoutubeLazyEmbed from "./YoutubeLazyEmbed";
import { useYoutubeChannelVideos } from "../hooks/useYoutubeChannelVideos";

export default function ShowsSection() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { videos, loading } = useYoutubeChannelVideos({ limit: 12, locale: lang });

  if (!loading && videos.length === 0) return null;

  const featured = videos[0];
  const rest = videos.slice(1, 5);

  return (
    <section className="section shows-section">
      <div className="section-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-title-wrap">
            <YtIcon />
            <h2 className="section-title">{t("हमारे शोज़", "Our Shows")}</h2>
            <span className="shows-yt-badge">YouTube</span>
          </div>
          <button className="section-more-btn" onClick={() => navigate("/shows")}>
            {t("सभी शोज़", "All Shows")} <ArrowRight size={14} />
          </button>
        </motion.div>

        {loading && !featured ? (
          <div className="shows-layout shows-layout--loading" aria-busy="true" />
        ) : featured ? (
          <div className="shows-layout">
            <motion.article
              className="shows-featured"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="shows-featured-thumb">
                <YoutubeLazyEmbed
                  youtubeUrl={featured.youtubeUrl}
                  title={lang === "hi" ? featured.title : featured.titleEn}
                  thumbnail={featured.thumbnail}
                  playBtnClassName="shows-play-btn"
                  playSize="lg"
                  duration={
                    featured.duration ? (
                      <span className="shows-duration">
                        <Clock size={11} aria-hidden /> {featured.duration}
                      </span>
                    ) : null
                  }
                />
                <span className="shows-yt-tag">
                  <YtIcon /> YouTube
                </span>
              </div>
              <div className="shows-featured-body">
                <h3 className="shows-featured-title">
                  {lang === "hi" ? featured.title : featured.titleEn}
                </h3>
                <div className="shows-meta">
                  {featured.views ? (
                    <>
                      <Eye size={13} aria-hidden />
                      <span>
                        {featured.views} {t("व्यूज़", "views")}
                      </span>
                    </>
                  ) : null}
                  {featured.duration ? (
                    <>
                      {featured.views ? <span className="shows-meta-dot" aria-hidden /> : null}
                      <Clock size={13} aria-hidden />
                      <span>{featured.duration}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.article>

            <div className="shows-grid">
              {rest.map((v, i) => (
                <motion.article
                  key={v.id}
                  className="shows-card"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <div className="shows-card-thumb">
                    <YoutubeLazyEmbed
                      youtubeUrl={v.youtubeUrl}
                      title={lang === "hi" ? v.title : v.titleEn}
                      thumbnail={v.thumbnail}
                      playBtnClassName="shows-card-play"
                      playSize="sm"
                      duration={
                        v.duration ? (
                          <span className="shows-duration">
                            <Clock size={10} aria-hidden /> {v.duration}
                          </span>
                        ) : null
                      }
                    />
                  </div>
                  <div className="shows-card-body">
                    <h4 className="shows-card-title">{lang === "hi" ? v.title : v.titleEn}</h4>
                    <div className="shows-meta" style={{ fontSize: 11, marginTop: 4 }}>
                      {v.views ? (
                        <>
                          <Eye size={11} aria-hidden />
                          <span>{v.views}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
