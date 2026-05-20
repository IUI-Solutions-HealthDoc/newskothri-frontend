import type { Metadata } from "next";
import ArticlePageClient from "../../../features/article/client/ArticlePageClient";
import { buildArticleMetadata } from "../../../features/article/seo/metadata";
import { buildNewsArticleJsonLd } from "../../../features/article/seo/schema";

/**
 * Article body + recommendations load in the client so the page works when SSR cannot reach the API.
 */
export const dynamic = "force-dynamic";

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

  return (
    <>
      {jsonLd != null ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ArticlePageClient articleId={id} />
    </>
  );
}
