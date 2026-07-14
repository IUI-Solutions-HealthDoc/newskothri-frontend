import type { Metadata } from "next";
import ArticlePageClient from "../../../features/article/client/ArticlePageClient";
import { buildArticleMetadata } from "../../../features/article/seo/metadata";
import { buildNewsArticleJsonLd } from "../../../features/article/seo/schema";

/**
 * Article body + recommendations load in the client so the page works when SSR cannot reach the API.
 */
export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return buildArticleMetadata(id);
}

export default async function ArticleRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jsonLd = await buildNewsArticleJsonLd(id);

  return <ArticlePageClient articleId={id} jsonLd={jsonLd} />;
}
