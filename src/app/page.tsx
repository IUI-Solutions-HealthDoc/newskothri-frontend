import type { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import HomeCategoriesBlock from "../features/home/components/HomeCategoriesBlock";
import { buildHomeWebSiteJsonLd } from "../features/home/seo/schema";
import { adaptArticles } from "../services/articleAdapter";
import { fetchPublicArticlesPage } from "../lib/serverPublicApi";
import InfinitePublicArticleList, {
  type InfinitePublicArticleListProps,
} from "../components/InfinitePublicArticleList";
import HomeDiscoverRow from "../components/HomeDiscoverRow";
import { collectHomeDisplayedIds } from "../features/home/server/homeFeed";
import { buildHomeInitialMoreStories } from "../features/home/server/homeInitialMore";
import { getServerUiLang } from "../lib/serverLocale";
import { localizedDefaultDescription, localizedSiteName } from "../lib/seo/metadataHelpers";
import styles from "./newsroom.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerUiLang();
  const name = localizedSiteName(locale);
  const description = localizedDefaultDescription(locale);
  return {
    title: name,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: name,
      description,
      url: "/",
      siteName: name,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
  };
}

export default async function Home() {
  const locale = await getServerUiLang();
  const { articles: raw } = await fetchPublicArticlesPage({ limit: 120, locale });
  const feed = adaptArticles(raw, locale);
  const excludeIds = collectHomeDisplayedIds(feed);
  const { items: initialItems, total: catalogTotal, startPage } = await buildHomeInitialMoreStories(
    locale,
    excludeIds
  );
  const jsonLd = buildHomeWebSiteJsonLd();

  const infiniteListProps: InfinitePublicArticleListProps = {
    locale,
    excludeIds,
    initialItems,
    startPage,
    total: catalogTotal,
    feedSource: "home",
    sectionTitle: locale === "hi" ? "और खबरें" : "More stories",
  };

  return (
    <main className={styles.homeMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <div className={`section-inner ${styles.sectionStack}`}>
        <HomeDiscoverRow />
        {feed.length === 0 ? (
          <section className={styles.sectionBlock}>
            <p className="card-summary">
              {locale === "hi"
                ? "इस समय होम फ़ीड उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।"
                : "Home feed is currently unavailable. Please try again shortly."}
            </p>
          </section>
        ) : null}
        <HomeCategoriesBlock
          feed={feed}
          locale={locale}
          sideListLabel={locale === "hi" ? "अन्य खबरें" : "More in section"}
        />
        <InfinitePublicArticleList {...infiniteListProps} />
      </div>
    </main>
  );
}
