import Link from "next/link";
import { Clock } from "lucide-react";
import type { ContentArticle } from "../../../services/contentTypes";
import { homeSections } from "../config/sections";
import { dek, headline } from "../server/homeFeed";
import { categoryColors } from "../../article/utils/formatArticle";
import styles from "./home-category-section.module.css";

type HomeSection = (typeof homeSections)[number];

export default function HomeCategorySection({
  section,
  locale,
  lead,
  rest,
  sideLabel,
}: {
  section: HomeSection;
  locale: "hi" | "en";
  lead: ContentArticle;
  rest: ContentArticle[];
  sideLabel: string;
}) {
  const color = categoryColors[section.slug] || "#BB1919";
  const sectionTitle = locale === "hi" ? section.titleHi : section.title;
  const moreLabel = locale === "hi" ? "और देखें" : "View all";

  const sideItems = rest.slice(0, 5);
  const gridItems = rest.slice(5, 9);

  const leadTitle = headline(lead, locale);
  const leadSummary = dek(lead, locale);
  const leadCat = locale === "hi" ? lead.category : lead.categoryEn;
  const leadTime = locale === "hi" ? lead.time : lead.timeEn;

  return (
    <section
      className={styles.section}
      style={{ "--cat-accent": color } as React.CSSProperties}
      aria-labelledby={`home-cat-${section.slug}`}
    >
      <header className={styles.head}>
        <span className={styles.headAccent} aria-hidden />
        <h2 id={`home-cat-${section.slug}`} className={styles.headTitle}>
          {sectionTitle}
        </h2>
        <Link href={`/category/${section.slug}`} className={styles.moreLink}>
          {moreLabel}
        </Link>
      </header>

      <div className={styles.panel}>
        <article>
          <Link href={`/article/${lead.id}`} className={styles.leadLink}>
            <div className={styles.leadMedia}>
              <img
                src={lead.image}
                alt={leadTitle}
                width={800}
                height={450}
                className={styles.leadImg}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.leadBody}>
              <span className={styles.leadKicker} style={{ color }}>
                {leadCat}
              </span>
              <h3 className={styles.leadTitle}>{leadTitle}</h3>
              {leadSummary ? <p className={styles.leadDek}>{leadSummary}</p> : null}
              <div className={styles.leadMeta}>
                <Clock size={11} aria-hidden />
                <span>{leadTime}</span>
              </div>
            </div>
          </Link>
        </article>

        {sideItems.length > 0 ? (
          <div className={styles.sideList}>
            <p className={styles.sideLabel}>{sideLabel}</p>
            {sideItems.map((item, i) => {
              const itemTitle = headline(item, locale);
              const itemTime = locale === "hi" ? item.time : item.timeEn;
              return (
                <Link
                  key={String(item.id)}
                  href={`/article/${item.id}`}
                  className={styles.sideItem}
                >
                  <span className={styles.sideNum} style={{ color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.sideThumb}>
                    <img
                      src={item.image}
                      alt=""
                      width={152}
                      height={108}
                      className={styles.sideThumbImg}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className={styles.sideBody}>
                    <h4 className={styles.sideTitle}>{itemTitle}</h4>
                    <span className={styles.sideMeta}>
                      <Clock size={10} aria-hidden />
                      {itemTime}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      {gridItems.length > 0 ? (
        <div className={styles.moreGrid}>
          {gridItems.map((item) => {
            const itemTitle = headline(item, locale);
            const itemTime = locale === "hi" ? item.time : item.timeEn;
            return (
              <Link key={String(item.id)} href={`/article/${item.id}`} className={styles.moreCard}>
                <div className={styles.moreCardMedia}>
                  <img
                    src={item.image}
                    alt={itemTitle}
                    width={400}
                    height={250}
                    className={styles.moreCardImg}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.moreCardBody}>
                  <h4 className={styles.moreCardTitle}>{itemTitle}</h4>
                  <span className={styles.moreCardMeta}>{itemTime}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
