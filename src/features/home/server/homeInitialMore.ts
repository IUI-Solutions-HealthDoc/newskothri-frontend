import type { ContentArticle } from "../../../services/contentTypes";
import type { BackendArticle } from "../../../services/newsApi";
import { adaptArticles } from "../../../services/articleAdapter";
import { fetchPublicArticlesPage } from "../../../lib/serverPublicApi";

const PAGE_SIZE = 24;
const MIN_INITIAL = 12;
const MAX_PAGES = 3;

export type HomeInitialMoreResult = {
  items: ContentArticle[];
  total: number;
  startPage: number;
};

type SeedPage = {
  articles: BackendArticle[];
  total: number;
};

/** First screen of home “और खबरें”, skipping category-block articles only. */
export async function buildHomeInitialMoreStories(
  locale: "hi" | "en",
  displayedIds: string[],
  seedPage?: SeedPage
): Promise<HomeInitialMoreResult> {
  const displayed = new Set(displayedIds);
  const collected: ContentArticle[] = [];
  const collectedIds = new Set<string>();
  let catalogTotal = 0;
  let lastFetchedPage = 0;

  const collect = (articles: BackendArticle[]) => {
    for (const a of adaptArticles(articles, locale)) {
      if (displayed.has(a.id) || collectedIds.has(a.id)) continue;
      collectedIds.add(a.id);
      collected.push(a);
    }
  };

  const hasSeed = Boolean(seedPage);
  if (seedPage) {
    catalogTotal = Number(seedPage.total) || 0;
    lastFetchedPage = 1;
    collect(seedPage.articles);
  }

  const seedAtEnd =
    hasSeed &&
    (catalogTotal > 0 ? PAGE_SIZE >= catalogTotal : (seedPage?.articles.length || 0) < PAGE_SIZE);

  for (let page = hasSeed ? 2 : 1; page <= MAX_PAGES; page += 1) {
    if (collected.length >= MIN_INITIAL || seedAtEnd) break;

    const { articles, total } = await fetchPublicArticlesPage({ limit: PAGE_SIZE, page, locale });
    catalogTotal = total;
    lastFetchedPage = page;
    if (!articles.length) break;

    collect(articles);

    if (collected.length >= MIN_INITIAL) break;
    if (total > 0 && page * PAGE_SIZE >= total) break;
    if (articles.length < PAGE_SIZE) break;
  }

  return {
    items: collected,
    total: catalogTotal,
    startPage: lastFetchedPage > 0 ? lastFetchedPage + 1 : 2,
  };
}
