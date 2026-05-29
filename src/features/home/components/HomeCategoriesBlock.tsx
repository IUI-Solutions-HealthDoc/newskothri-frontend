import type { ContentArticle } from "../../../services/contentTypes";
import { homeSections } from "../config/sections";
import { pickCategory } from "../server/homeFeed";
import HomeCategorySection from "./HomeCategorySection";
import styles from "./home-categories-block.module.css";

export default function HomeCategoriesBlock({
  feed,
  locale,
  sideListLabel,
}: {
  feed: ContentArticle[];
  locale: "hi" | "en";
  sideListLabel: string;
}) {
  const sections = homeSections
    .map((section) => {
      const list = pickCategory(feed, section.slug, 10);
      if (!list.length) return null;
      const [lead, ...rest] = list;
      return { section, lead, rest };
    })
    .filter(Boolean) as {
    section: (typeof homeSections)[number];
    lead: ContentArticle;
    rest: ContentArticle[];
  }[];

  if (!sections.length) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>
          {locale === "hi" ? "श्रेणीवार खबरें" : "News by category"}
        </h2>
        <p className={styles.introSub}>
          {locale === "hi"
            ? "देश, राजनीति, खेल और अन्य विषयों की ताज़ा रिपोर्ट"
            : "Latest reports across country, politics, sports, and more"}
        </p>
      </div>
      <div className={styles.stack}>
        {sections.map(({ section, lead, rest }) => (
          <HomeCategorySection
            key={section.slug}
            section={section}
            locale={locale}
            lead={lead}
            rest={rest}
            sideLabel={sideListLabel}
          />
        ))}
      </div>
    </div>
  );
}
