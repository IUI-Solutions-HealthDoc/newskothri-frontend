"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Clock, ArrowUpRight, Zap, Bookmark, Share2, Eye } from "lucide-react";
import type { ContentArticle } from "../services/contentTypes";
import { useLang } from "../context/LangContext";
import { fetchPublishedArticles } from "../services/newsApi";
import { adaptArticles } from "../services/articleAdapter";
import styles from "../app/newsroom.module.css";

const ROTATION_INTERVAL = 3000;

function storyFields(s: ContentArticle, lang: "hi" | "en") {
  return {
    title: lang === "hi" ? s.title : s.titleEn,
    summary: lang === "hi" ? s.summary : s.summaryEn,
    category: lang === "hi" ? s.category : s.categoryEn,
    time: lang === "hi" ? s.time : s.timeEn,
    author: lang === "hi" ? s.author : s.authorEn,
  };
}

export default function HeroSection() {
  const [stories, setStories] = useState<ContentArticle[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imgErr, setImgErr] = useState<Record<string | number, boolean>>({});
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [narrowHero, setNarrowHero] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const sync = () => setNarrowHero(mqNarrow.matches);
    sync();
    mqNarrow.addEventListener("change", sync);
    return () => mqNarrow.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setHeroLoading(true);
    });
    fetchPublishedArticles({ limit: 4, locale: lang })
      .then((articles) => {
        if (cancelled) return;
        setStories(adaptArticles(articles).slice(0, 4));
      })
      .finally(() => {
        if (!cancelled) setHeroLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    if (stories.length === 0) return;
    if (reduceMotion) {
      return;
    }
    startTimeRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min((elapsed / ROTATION_INTERVAL) * 100, 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    intervalRef.current = setInterval(() => {
      setActiveIdx((i) => {
        const len = stories.length;
        if (len === 0) return 0;
        const cur = Math.min(i, len - 1);
        return (cur + 1) % len;
      });
      setProgress(0);
      startTimeRef.current = Date.now();
    }, ROTATION_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIdx, stories.length, reduceMotion]);

  const displayIdx =
    stories.length === 0 ? 0 : Math.min(activeIdx, stories.length - 1);
  const fillProgress = reduceMotion || narrowHero ? 0 : progress;

  const goTo = (idx: number) => {
    const len = stories.length;
    const clamped = len === 0 ? 0 : Math.min(Math.max(0, idx), len - 1);
    setActiveIdx(clamped);
    setProgress(0);
    queueMicrotask(() => {
      startTimeRef.current = Date.now();
    });
  };

  if (!heroLoading && stories.length === 0) {
    return (
      <section className={`hero-section hero-cinematic-wrap ${styles.breakingSection}`} aria-live="polite">
        <div className="hero-cinematic-inner" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "var(--ink-600)", maxWidth: 480, margin: "0 auto" }}>
            {t("अभी कोई प्रकाशित खबर नहीं है। CMS से लेख प्रकाशित करने के बाद वे यहाँ दिखेंगी।", "No published stories yet. Publish articles from the CMS to see them here.")}
          </p>
        </div>
      </section>
    );
  }

  const story = stories[displayIdx] ?? stories[0];
  if (!story) {
    return (
      <section className={`hero-section hero-cinematic-wrap ${styles.breakingSection}`}>
        <div className="hero-cinematic-inner" style={{ padding: 80, display: "flex", justifyContent: "center" }}>
          <span style={{ color: "var(--ink-400)" }}>…</span>
        </div>
      </section>
    );
  }

  const { title, summary, category, time, author } = storyFields(story, lang);
  const rawTags = (lang === "hi" ? story.tags : story.tagsEn) ?? [];
  const tags = rawTags.slice(0, 8).map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
  const sideStories = stories.filter((_, i) => i !== displayIdx);

  const progressRow = (
    <div className={styles.breakingProgressRow} role="tablist" aria-label={t("टॉप खबरें", "Top stories")}>
      {stories.map((s, i) => (
        <button
          key={String(s.id)}
          type="button"
          className={styles.breakingProgressBar}
          onClick={() => goTo(i)}
          aria-label={`${t("खबर", "Story")} ${i + 1}`}
          aria-selected={i === displayIdx}
        >
          <span
            className={styles.breakingProgressFill}
            style={{
              width: narrowHero
                ? i === displayIdx
                  ? "100%"
                  : "0%"
                : i < displayIdx
                  ? "100%"
                  : i === displayIdx
                    ? `${fillProgress}%`
                    : "0%",
            }}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <section
        className={`${styles.sectionBlock} ${styles.breakingSection} ${styles.breakingDesktop}`}
        aria-live="polite"
      >
        <div className={`${styles.sectionHead} ${styles.breakingSectionHead}`}>
          <h2 className="section-title">{t("ताज़ा खबर", "Breaking news")}</h2>
        </div>

        <div className={styles.storyLayout}>
          <article className={`card-default ${styles.leadCard} ${styles.breakingLeadCard}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={String(story.id) + lang}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
              >
                <button
                  type="button"
                  className={`${styles.leadLink} ${styles.breakingLeadLinkStacked}`}
                  onClick={() => navigate(`/article/${story.id}`)}
                >
                  <div className={`kn-media-frame ${styles.leadMedia} ${styles.breakingLeadMedia}`}>
                    {!imgErr[story.id] ? (
                      <img
                        src={story.image}
                        alt={title}
                        width={800}
                        height={450}
                        className={styles.leadImage}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        onError={() => setImgErr((e) => ({ ...e, [story.id]: true }))}
                      />
                    ) : (
                      <div className={styles.leadImageFallback} aria-hidden />
                    )}
                    <span className={styles.breakingLeadScrim} aria-hidden />
                  </div>
                  <div className={styles.leadTextWrap}>
                    <div className={styles.breakingLeadMeta}>
                      {story.isBreaking ? (
                        <span className={styles.breakingBadge}>
                          <span className={styles.breakingBadgeDot} />
                          {t("ब्रेकिंग", "Breaking")}
                        </span>
                      ) : null}
                      <span className={styles.breakingCat}>{category}</span>
                    </div>
                    <h3 className={styles.leadTitle}>{title}</h3>
                    <p className={styles.leadSummary}>{summary}</p>
                    <div className={styles.breakingLeadByline}>
                      <span>{author}</span>
                      <span className={styles.breakingLeadSep}>·</span>
                      <Clock size={12} aria-hidden />
                      <span>{time}</span>
                      {story.readTime ? (
                        <>
                          <span className={styles.breakingLeadSep}>·</span>
                          <span>
                            {story.readTime} {t("मिनट", "min")}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </button>
                {progressRow}
              </motion.div>
            </AnimatePresence>
          </article>

          <div className={styles.breakingSideList}>
            <p className={styles.breakingSideListLabel}>
              <Zap size={13} fill="currentColor" style={{ color: "var(--brand-red)" }} />
              {t("टॉप स्टोरीज़", "Top Stories")}
            </p>
            {stories.map((s, i) => {
              const f = storyFields(s, lang);
              const isActive = i === displayIdx;
              return (
                <button
                  key={String(s.id)}
                  type="button"
                  className={`${styles.breakingSideRow}${isActive ? ` ${styles.breakingSideRowActive}` : ""}`}
                  onClick={() => {
                    goTo(i);
                    navigate(`/article/${s.id}`);
                  }}
                >
                  <span className={styles.breakingSideNum}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={styles.breakingSideThumbWrap}>
                    {!imgErr[s.id] ? (
                      <img
                        src={s.image}
                        alt=""
                        className={styles.breakingSideThumb}
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgErr((e) => ({ ...e, [s.id]: true }))}
                      />
                    ) : (
                      <div className={styles.breakingSideThumbFallback} aria-hidden />
                    )}
                  </div>
                  <div className={styles.breakingSideBody}>
                    <span className={styles.breakingSideCat}>{f.category}</span>
                    <span className={styles.breakingSideTitle}>{f.title}</span>
                    <span className={styles.breakingSideMeta}>
                      <Clock size={10} aria-hidden />
                      {f.time}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

    <section className="hero-section hero-cinematic-wrap hero-cinematic--mobile">
      <div className="hero-cinematic-inner">
        <div className="hero-cinematic-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(story.id)}
              className="hero-cin-img-frame"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {!imgErr[story.id] ? (
                <img
                  src={story.image}
                  alt={title}
                  className="hero-cin-img"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => setImgErr((e) => ({ ...e, [story.id]: true }))}
                />
              ) : (
                <div className="hero-cin-fallback" />
              )}
              <div className="hero-cin-gradient" />
            </motion.div>
          </AnimatePresence>

          <div className="hero-cin-overlay">
            <div className="hero-cin-badges">
              {story.isBreaking && (
                <span className="hero-cin-breaking">
                  <span className="hero-cin-dot" />
                  {t("ब्रेकिंग", "Breaking")}
                </span>
              )}
              <span className="hero-cin-cat">{category}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={String(story.id) + lang}
                className="hero-cin-text"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={reduceMotion ? { duration: 0 } : { delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="hero-cin-headline"
                  onClick={() => navigate(`/article/${story.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {title}
                </h1>
                <p className="hero-cin-summary">{summary}</p>
              </motion.div>
            </AnimatePresence>

            <div className="hero-cin-byline">
              <div className="hero-cin-author">
                <span className="hero-cin-avatar">{author.charAt(0)}</span>
                <span className="hero-cin-author-name">{author}</span>
                <span className="hero-cin-sep">·</span>
                <Clock size={12} style={{ opacity: 0.7 }} />
                <span className="hero-cin-time">{time}</span>
                {story.readTime && (
                  <>
                    <span className="hero-cin-sep">·</span>
                    <span className="hero-cin-readtime">{story.readTime} {t("मिनट", "min")}</span>
                  </>
                )}
              </div>
              <div className="hero-cin-actions">
                <button className="hero-cin-action-btn" title={t("बुकमार्क", "Bookmark")}>
                  <Bookmark size={15} />
                </button>
                <button className="hero-cin-action-btn" title={t("शेयर", "Share")}>
                  <Share2 size={15} />
                </button>
                <button
                  className="hero-cin-read-btn"
                  onClick={() => navigate(`/article/${story.id}`)}
                >
                  {t("पूरी खबर", "Read Story")}
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            <div className="hero-cin-progress-row">
              {stories.map((s, i) => (
                <button
                  key={String(s.id)}
                  className="hero-cin-progress-bar"
                  onClick={() => goTo(i)}
                  aria-label={`Story ${i + 1}`}
                >
                  <span
                    className="hero-cin-progress-fill"
                    style={{
                      width: narrowHero
                        ? i === displayIdx
                          ? "100%"
                          : "0%"
                        : i < displayIdx
                          ? "100%"
                          : i === displayIdx
                            ? `${fillProgress}%`
                            : "0%",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {sideStories.length > 0 ? (
        <div className={`${styles.breakingMobileCards} ${styles.cardsGrid}`}>
          {sideStories.map((s) => {
            const f = storyFields(s, lang);
            return (
              <article key={String(s.id)} className={`card-default ${styles.cardBody}`}>
                <button
                  type="button"
                  className={styles.cardLink}
                  onClick={() => navigate(`/article/${s.id}`)}
                >
                  <div className={styles.cardMedia}>
                    {!imgErr[s.id] ? (
                      <img
                        src={s.image}
                        alt={f.title}
                        width={800}
                        height={450}
                        className={styles.cardImage}
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgErr((e) => ({ ...e, [s.id]: true }))}
                      />
                    ) : (
                      <div className={styles.cardImageFallback} aria-hidden />
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <p className={styles.cardSummary}>{f.summary}</p>
                </button>
              </article>
            );
          })}
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="hero-cin-tags-section hero-cin-tags-section--mobile">
          <p className="hero-cin-tags-label">
            <Eye size={11} />
            {t("ट्रेंडिंग", "Trending")}
          </p>
          <div className="hero-cin-tags-row">
            {tags.map((tag) => (
              <button key={tag} type="button" className="hero-cin-tag">{tag}</button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
    </>
  );
}
