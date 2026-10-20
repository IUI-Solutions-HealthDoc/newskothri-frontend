import type { Metadata } from "next";
import ArticlePageClient from "../../../../features/article/client/ArticlePageClient";
import { buildArticleMetadata } from "../../../../features/article/seo/metadata";
import { buildNewsArticleJsonLd } from "../../../../features/article/seo/schema";
import { getArticle } from "../../../../features/article/server/getArticle";
import { adaptArticle, adaptArticles } from "../../../../services/articleAdapter";
import { fetchPublicArticlesPage, fetchPublicRecommendations } from "../../../../lib/serverPublicApi";
import { sanitizeServerArticle } from "../../../../features/article/server/sanitizeArticle";
import { toServerUiLang } from "../../../../lib/serverLocale";

/** Cache the server-rendered article briefly while keeping editorial updates timely. */
export const revalidate = 60;

/** No build-time list: each page renders on first request, then is cached and revalidated (ISR). */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string; lang: string }> }
): Promise<Metadata> {
  const { id, lang } = await params;
  return buildArticleMetadata(id, toServerUiLang(lang));
}

export default async function ArticleRoutePage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id } = await params;
  const [rawArticle, jsonLd] = await Promise.all([
    getArticle(id),
    buildNewsArticleJsonLd(id),
  ]);
  const initialArticle = rawArticle
    ? adaptArticle(sanitizeServerArticle(rawArticle))
    : null;

  // Sidebar + "more stories" rendered with the page instead of two client fetches after hydration.
  let initialRelated: { recommended: ReturnType<typeof adaptArticles>; more: ReturnType<typeof adaptArticles> } | null = null;
  if (rawArticle && initialArticle) {
    const locale = initialArticle.primaryLocale;
    const [recRaw, morePage] = await Promise.all([
      fetchPublicRecommendations(String(rawArticle._id), { limit: 14, locale }),
      fetchPublicArticlesPage({ limit: 24, page: 2, locale }),
    ]);
    initialRelated = {
      recommended: adaptArticles(recRaw, locale),
      more: adaptArticles(morePage.articles, locale),
    };
  }

  return (
    <ArticlePageClient
      articleId={id}
      initialArticle={initialArticle}
      initialRelated={initialRelated}
      jsonLd={jsonLd}
    />
  );
}
