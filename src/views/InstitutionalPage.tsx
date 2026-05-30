"use client";

import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { useLang } from "../context/LangContext";
import { getInstitutionalContent } from "../content/institutionalContent";

export type InstitutionalKind = "about" | "mission" | "vision";

const INSTITUTIONAL_PAGES: {
  kind: InstitutionalKind;
  path: string;
  hi: string;
  en: string;
}[] = [
  { kind: "about", path: "/about", hi: "हमारे बारे में", en: "About" },
  { kind: "mission", path: "/mission", hi: "मिशन", en: "Mission" },
  { kind: "vision", path: "/vision", hi: "विज़न", en: "Vision" },
];

export default function InstitutionalPage({ kind }: { kind: InstitutionalKind }) {
  const { lang, t } = useLang();
  const isHi = lang === "hi";
  const content = getInstitutionalContent(kind, isHi ? "hi" : "en");
  const showAside = content.values.length > 0 || Boolean(content.asideNote.trim());

  return (
    <main className="inst-page article-page">
      <div className="inst-hero" aria-hidden>
        <div className="inst-hero-grid" />
        <div className="inst-hero-glow" />
      </div>

      <div className="inst-page-inner section-inner">
        <nav className="inst-nav-pills" aria-label={t("संस्थागत पृष्ठ", "Institutional pages")}>
          {INSTITUTIONAL_PAGES.map((page) => (
            <Link
              key={page.kind}
              to={page.path}
              className={`inst-pill${page.kind === kind ? " is-active" : ""}`}
              aria-current={page.kind === kind ? "page" : undefined}
            >
              {isHi ? page.hi : page.en}
            </Link>
          ))}
        </nav>

        <header className="inst-header">
          <div className="inst-header-icon-wrap" aria-hidden>
            <Building2 size={22} strokeWidth={2} />
          </div>
          {content.kicker ? <p className="inst-kicker">{content.kicker}</p> : null}
          <h1 className="inst-title">{content.title}</h1>
          {content.lead ? <p className="inst-lead">{content.lead}</p> : null}
        </header>

        <div className={`inst-layout${showAside ? "" : " inst-layout--single"}`}>
          <div className="inst-main-col">
            {content.blocks.map((b, i) => (
              <section key={i} className="inst-section privacy-section">
                {b.h ? <h2 className="inst-h2 privacy-h2">{b.h}</h2> : null}
                <p>{b.p}</p>
              </section>
            ))}

            {content.quote?.text ? (
              <aside className="inst-quote" role="note">
                {content.quote.h ? (
                  <p className="inst-h2 privacy-h2 inst-quote-heading">{content.quote.h}</p>
                ) : null}
                <p className="inst-quote-text">{content.quote.text}</p>
                {content.quote.by ? <p className="inst-quote-by">{content.quote.by}</p> : null}
              </aside>
            ) : null}

            <div className="inst-back privacy-back">
              <Link to="/" className="inst-cta-link privacy-back-link">
                {t("होम पर लौटें", "Back to home")}
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
              </Link>
            </div>
          </div>

          {showAside ? (
            <aside className="inst-aside" aria-label={t("मूल्य", "Values")}>
              {content.asideNote ? (
                <div className="inst-aside-card inst-aside-card--accent">
                  <p className="inst-aside-accent-text">{content.asideNote}</p>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
