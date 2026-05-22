import type { Metadata } from "next";
import { pickCopy } from "../../../i18n/siteCopy";
import {
  localizedDefaultDescription,
  localizedSiteName,
  toAbsoluteUrl,
} from "../../../lib/seo/metadataHelpers";
import { getServerUiLang } from "../../../lib/serverLocale";
import { getArticle } from "../server/getArticle";

export async function buildArticleMetadata(id: string): Promise<Metadata> {
  const uiLang = await getServerUiLang();
  const canonicalPath = `/article/${id}`;
  const article = await getArticle(id);
  const brand = localizedSiteName(uiLang);
  const fallbackDesc = localizedDefaultDescription(uiLang);

  if (!article) {
    return {
      title: pickCopy(uiLang, "खबर", "Article"),
      description: fallbackDesc,
      alternates: { canonical: canonicalPath },
    };
  }

  const useHi = uiLang === "hi";
  const metaTitle = useHi
    ? String(article.metaTitleHi || "").trim() || article.titleHi || article.title || article.titleEn
    : String(article.metaTitle || "").trim() || article.title || article.titleEn || article.titleHi;
  const title =
    metaTitle ||
    article.titleHi ||
    article.title ||
    pickCopy(uiLang, "खबर", "Article");

  const metaDesc = useHi
    ? String(article.metaDescriptionHi || "").trim() || article.summaryHi || article.summary || article.summaryEn
    : String(article.metaDescription || "").trim() || article.summary || article.summaryEn || article.summaryHi;
  const description = metaDesc || fallbackDesc;

  const keywords = String(article.metaKeywords || "").trim();

  const imagePath = article.images?.[0]?.url;
  const imageUrl = imagePath ? toAbsoluteUrl(imagePath) : undefined;

  const meta: Metadata = {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalPath,
      siteName: brand,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };

  if (keywords) {
    meta.keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }

  return meta;
}
