import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, Bookmark, Share2, Eye } from "lucide-react";
import type { NewsItem } from "../data/mockData";
import { useLang } from "../context/LangContext";
import { shareLabels } from "../i18n/siteCopy";

interface NewsCardProps {
  item: NewsItem;
  variant?: "default" | "horizontal" | "small" | "large" | "editor";
  index?: number;
}

const categoryColors: Record<string, string> = {
  desh: "#BB1919", videsh: "#1A3A6B", rajneeti: "#810102",
  khel: "#00695C", health: "#1B6B3A", krishi: "#2E7D32",
  business: "#7C4A00", manoranjan: "#6B1FA5", lifestyle: "#C2185B", home: "#BB1919",
};

const CATEGORY_LABELS = {
  hi: {
    desh: "देश",
    videsh: "विदेश",
    rajneeti: "राजनीति",
    khel: "खेल",
    health: "स्वास्थ्य",
    krishi: "कृषि",
    business: "व्यापार",
    manoranjan: "मनोरंजन",
    lifestyle: "लाइफस्टाइल",
  },
  en: {
    desh: "Country",
    videsh: "World",
    rajneeti: "Politics",
    khel: "Sports",
    health: "Health",
    krishi: "Agriculture",
    business: "Business",
    manoranjan: "Entertainment",
    lifestyle: "Lifestyle",
  },
} as const;

export default function NewsCard({ item, variant = "default", index = 0 }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { lang, t } = useLang();
  const labels = shareLabels(t);
  const color = categoryColors[item.categorySlug] || "#1565c0";

  const title    = lang === "hi" ? item.title    : item.titleEn;
  const summary  = lang === "hi" ? item.summary  : item.summaryEn;
  const category =
    (lang === "hi"
      ? CATEGORY_LABELS.hi[item.categorySlug as keyof typeof CATEGORY_LABELS.hi]
      : CATEGORY_LABELS.en[item.categorySlug as keyof typeof CATEGORY_LABELS.en]) ||
    (lang === "hi" ? item.category : item.categoryEn);
  const time     = lang === "hi" ? item.time     : item.timeEn;
  const author   = lang === "hi" ? item.author   : item.authorEn;

  const href = `/article/${item.id}`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const motionProps = {
    variants: cardVariants,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-40px" },
  };

  /* ── SMALL ── */
  if (variant === "small") {
    return (
      <motion.div {...motionProps}>
        <Link
          href={href}
          className="card card-small card-link-reset"
          style={{ borderLeftColor: color }}
        >
          <div className="card-small-img-wrap">
            {!imgError
              ? <img src={item.image} alt={title} className="card-small-img" onError={() => setImgError(true)} loading="lazy" />
              : <div className="card-img-fallback" style={{ background: color + "22" }} />}
          </div>
          <div className="card-small-body">
            <span className="card-cat-label" style={{ color }}>{category}</span>
            <h4 className="card-small-title">{title}</h4>
            <div className="card-meta">
              <Clock size={11} />
              <span>{time}</span>
              <span className="card-meta-dot" aria-hidden />
              <span className="card-meta-author">{author}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  /* ── HORIZONTAL ── */
  if (variant === "horizontal") {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className="card card-horizontal card-link-reset">
          <div className="card-h-img-wrap">
            {!imgError
              ? <img src={item.image} alt={title} className="card-h-img" onError={() => setImgError(true)} loading="lazy" />
              : <div className="card-img-fallback" style={{ background: color + "22" }} />}
          </div>
          <div className="card-h-body">
            <span className="card-cat-label" style={{ color }}>{category}</span>
            <h3 className="card-h-title">{title}</h3>
            <div className="card-meta">
              <Clock size={11} />
              <span>{time}</span>
              <span className="card-meta-dot" aria-hidden />
              <span className="card-meta-author">{author}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  /* ── EDITOR ── */
  if (variant === "editor") {
    return (
      <motion.article
        className="card card-editor"
        {...motionProps}
        style={{ borderTopColor: color }}
      >
        <Link href={href} className="card-link-reset card-editor-link">
          <div className="card-editor-img-wrap">
            {!imgError
              ? <img src={item.image} alt={title} className="card-editor-img" onError={() => setImgError(true)} loading="lazy" />
              : <div className="card-img-fallback" style={{ background: color + "22", height: "100%" }} />}
          </div>
          <div className="card-editor-body">
            <span className="card-cat-label" style={{ color }}>{category}</span>
            <h3 className="card-editor-title">{title}</h3>
            <p className="card-editor-summary">{summary}</p>
          </div>
        </Link>
        <div className="card-editor-footer">
          <div className="card-author-row">
            <div className="card-author-avatar" style={{ background: color + "25", color }}>
              {author.charAt(0)}
            </div>
            <div>
              <div className="card-author-name">{author}</div>
              <div className="card-meta"><Clock size={10} /><span>{time}</span></div>
            </div>
          </div>
          <div className="card-actions">
            <motion.button
              className="card-action-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBookmarked(b => !b); }}
              whileTap={{ scale: 0.85 }}
              aria-label={labels.bookmark}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} style={{ color: bookmarked ? color : undefined }} />
            </motion.button>
            <motion.button
              className="card-action-btn"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              whileTap={{ scale: 0.85 }}
              aria-label={labels.share}
            >
              <Share2 size={15} />
            </motion.button>
          </div>
        </div>
      </motion.article>
    );
  }

  /* ── DEFAULT ── */
  return (
    <motion.article
      className="card card-default"
      {...motionProps}
    >
      <Link href={href} className="card-link-reset card-default-link">
        <div className="card-img-wrap">
          {item.isBreaking && <span className="card-breaking-tag">{labels.breaking}</span>}
          {!imgError
            ? <img src={item.image} alt={title} className="card-img" onError={() => setImgError(true)} loading="lazy" />
            : <div className="card-img-fallback" style={{ background: color + "22" }} />}
        </div>

        <div className="card-body" style={{ borderTopColor: color }}>
          <span className="card-cat-label" style={{ color }}>{category}</span>
          <h3 className="card-title">{title}</h3>
          <p className="card-summary">{summary}</p>
        </div>
      </Link>

      <div className="card-footer">
        <div className="card-meta">
          <Clock size={12} />
          <span>{time}</span>
          <span className="card-meta-dot" />
          <Eye size={12} />
          <span>{Math.floor(Math.random() * 90 + 10)}K</span>
        </div>
        <div className="card-footer-actions">
          <motion.button
            className="card-action-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBookmarked(b => !b); }}
            whileTap={{ scale: 0.85 }}
            aria-label={labels.bookmark}
          >
            <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} style={{ color: bookmarked ? color : undefined }} />
          </motion.button>
          <motion.button
            className="card-action-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            whileTap={{ scale: 0.85 }}
            aria-label={labels.share}
          >
            <Share2 size={13} />
          </motion.button>
          <Link
            href={href}
            className="card-read-pill"
            style={{ background: color + "15", color }}
          >
            {t("पढ़ें", "Read")} <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
