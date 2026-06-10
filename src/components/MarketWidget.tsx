"use client";

import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, BarChart3 } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useMarketSnapshot } from "../hooks/useMarketSnapshot";
import type { MarketQuote, StockMover } from "../lib/markets/fetchMarketSnapshot";
import styles from "./market-widget.module.css";

const BUSINESS_ACCENT = "#7C4A00";

function formatPrice(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function formatChangePts(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatChangePct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatUpdatedAt(iso: string, lang: "hi" | "en"): string {
  try {
    return new Date(iso).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-IN", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "";
  }
}

function changeClass(changePct: number): string {
  if (changePct > 0.005) return styles.changeUp;
  if (changePct < -0.005) return styles.changeDown;
  return styles.changeFlat;
}

function ChangeBadge({ changePct }: { changePct: number }) {
  const Icon = changePct > 0.005 ? TrendingUp : changePct < -0.005 ? TrendingDown : Minus;
  return (
    <span className={`${styles.changeBadge} ${changeClass(changePct)}`}>
      <Icon size={11} aria-hidden />
      {formatChangePct(changePct)}
    </span>
  );
}

function IndexRow({ quote, lang }: { quote: MarketQuote; lang: "hi" | "en" }) {
  const label = lang === "hi" ? quote.labelHi : quote.labelEn;
  const tint = quote.changePct > 0.005 ? styles.rowUp : quote.changePct < -0.005 ? styles.rowDown : "";
  return (
    <li className={`${styles.row} ${tint}`}>
      <div className={styles.rowMain}>
        <span className={styles.label}>{label}</span>
        {quote.dayHigh != null && quote.dayLow != null ? (
          <span className={styles.dayRange}>
            L {formatPrice(quote.dayLow)} · H {formatPrice(quote.dayHigh)}
          </span>
        ) : null}
      </div>
      <div className={styles.values}>
        <span className={styles.price}>{formatPrice(quote.price)}</span>
        <span className={`${styles.changePts} ${changeClass(quote.changePct)}`}>
          {formatChangePts(quote.change)} ({formatChangePct(quote.changePct)})
        </span>
      </div>
    </li>
  );
}

function MoverRow({ mover, lang, rank }: { mover: StockMover; lang: "hi" | "en"; rank: number }) {
  const label = lang === "hi" ? mover.labelHi : mover.labelEn;
  const tint = mover.changePct > 0 ? styles.rowUp : styles.rowDown;
  return (
    <li className={`${styles.moverRow} ${tint}`}>
      <span className={styles.moverRank}>{rank}</span>
      <div className={styles.moverBody}>
        <span className={styles.moverName}>{label}</span>
        <span className={styles.moverPrice}>{formatPrice(mover.price)}</span>
      </div>
      <ChangeBadge changePct={mover.changePct} />
    </li>
  );
}

function MoversSection({
  title,
  movers,
  lang,
}: {
  title: string;
  movers: StockMover[];
  lang: "hi" | "en";
}) {
  if (!movers.length) return null;
  return (
    <div className={styles.moversBlock}>
      <h3 className={styles.moversTitle}>{title}</h3>
      <ol className={styles.moversList}>
        {movers.map((m, i) => (
          <MoverRow key={m.id} mover={m} lang={lang} rank={i + 1} />
        ))}
      </ol>
    </div>
  );
}

function Disclaimer({ t }: { t: (hi: string, en: string) => string }) {
  return (
    <p className={styles.footer}>
      {t("विलंबित डेटा · निवेश सलाह नहीं · स्रोत:", "Delayed data · Not investment advice · Source:")}{" "}
      <a href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer">
        Yahoo Finance
      </a>
      {" · "}
      {t("शेयर: चुनी हुई NSE सूची", "Stocks: curated NSE watchlist")}
    </p>
  );
}

function Skeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.skeleton} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  );
}

function SidebarContent({
  snapshot,
  lang,
  t,
  accentColor,
}: {
  snapshot: NonNullable<ReturnType<typeof useMarketSnapshot>["snapshot"]>;
  lang: "hi" | "en";
  t: (hi: string, en: string) => string;
  accentColor: string;
}) {
  const updated = formatUpdatedAt(snapshot.fetchedAt, lang);

  return (
    <>
      {snapshot.quotes.length > 0 ? (
        <>
          <div className={styles.sectionLabel}>{t("सूचकांक", "Indices")}</div>
          <ul className={styles.list}>
            {snapshot.quotes.map((q) => (
              <IndexRow key={q.id} quote={q} lang={lang} />
            ))}
          </ul>
        </>
      ) : null}

      <MoversSection
        title={t("आज के शीर्ष शेयर", "Top stocks today")}
        movers={snapshot.topGainers}
        lang={lang}
      />
      <MoversSection
        title={t("आज के सबसे कमज़ोर", "Weakest today")}
        movers={snapshot.topLosers}
        lang={lang}
      />

      {updated ? (
        <p className={styles.updated}>
          {t(`अपडेट: ${updated} IST`, `Updated: ${updated} IST`)}
        </p>
      ) : null}

      <Link href="/category/business" className={styles.businessLink} style={{ color: accentColor }}>
        {t("और व्यापार खबरें →", "More business news →")}
      </Link>

      <Disclaimer t={t} />
    </>
  );
}

export default function MarketWidget({
  variant = "sidebar",
  accentColor = BUSINESS_ACCENT,
}: {
  variant?: "sidebar" | "inline";
  accentColor?: string;
}) {
  const { lang, t } = useLang();
  const { snapshot, loading, error } = useMarketSnapshot(true);
  const style = { "--market-accent": accentColor } as React.CSSProperties;

  const hasData =
    snapshot &&
    (snapshot.quotes.length > 0 || snapshot.topGainers.length > 0 || snapshot.topLosers.length > 0);

  if (error || (!loading && !hasData)) return null;

  if (variant === "inline") {
    if (loading) {
      return (
        <div className={styles.marketInlineWrap} style={style}>
          <div className={styles.inlinePanel} aria-busy="true" aria-label={t("बाज़ार", "Markets")}>
            <Skeleton count={2} />
          </div>
        </div>
      );
    }

    if (!snapshot || !hasData) return null;

    const inlineItems = [
      ...snapshot.quotes.map((q) => ({
        id: q.id,
        label: lang === "hi" ? q.labelHi : q.labelEn,
        price: q.price,
        changePct: q.changePct,
        kind: "index" as const,
      })),
      ...snapshot.topGainers.slice(0, 3).map((m) => ({
        id: m.id,
        label: lang === "hi" ? m.labelHi : m.labelEn,
        price: m.price,
        changePct: m.changePct,
        kind: "stock" as const,
      })),
    ];

    return (
      <div className={styles.marketInlineWrap} style={style}>
        <section className={styles.inlinePanel} aria-label={t("बाज़ार", "Markets")}>
          <div className={styles.inlineHead}>
            <BarChart3 size={14} strokeWidth={2.2} style={{ color: accentColor }} aria-hidden />
            {t("बाज़ार · आज", "Markets · Today")}
          </div>
          <div className={styles.inlineScroll}>
            {inlineItems.map((item) => (
              <div key={item.id} className={styles.inlineChip}>
                <span className={styles.inlineLabel}>
                  {item.kind === "stock" ? "★ " : ""}
                  {item.label}
                </span>
                <span className={styles.inlinePrice}>{formatPrice(item.price)}</span>
                <span className={`${styles.inlineChange} ${changeClass(item.changePct)}`}>
                  {formatChangePct(item.changePct)}
                </span>
              </div>
            ))}
          </div>
          <p className={styles.inlineFooter}>
            {t("विलंबित · निवेश सलाह नहीं", "Delayed · Not investment advice")}
          </p>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`aside-block ${styles.marketAsideBlock}`} style={style} aria-busy="true">
        <div className="aside-block-header" style={{ borderLeftColor: accentColor }}>
          <span>{t("बाज़ार · आज", "Markets · Today")}</span>
        </div>
        <Skeleton />
      </div>
    );
  }

  if (!snapshot || !hasData) return null;

  return (
    <div className={`aside-block ${styles.marketAsideBlock}`} style={style}>
      <div className="aside-block-header" style={{ borderLeftColor: accentColor }}>
        <BarChart3 size={14} strokeWidth={2.2} style={{ color: accentColor, marginRight: 4 }} aria-hidden />
        <span>{t("बाज़ार · आज", "Markets · Today")}</span>
      </div>
      <SidebarContent snapshot={snapshot} lang={lang} t={t} accentColor={accentColor} />
    </div>
  );
}
