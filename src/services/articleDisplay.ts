import type { ContentArticle } from "./contentTypes";

/** Card/list headline for the active site language (no cross-locale fallback). */
export function displayHeadline(item: ContentArticle, siteLocale: "hi" | "en"): string {
  const primary = item.primaryLocale === "hi" ? "hi" : "en";
  if (primary !== siteLocale) return "";
  return siteLocale === "hi" ? item.title : item.titleEn;
}

/** Card/list summary/dek for the active site language. */
export function displayDek(item: ContentArticle, siteLocale: "hi" | "en"): string {
  const primary = item.primaryLocale === "hi" ? "hi" : "en";
  if (primary !== siteLocale) return "";
  return siteLocale === "hi" ? item.summary : item.summaryEn;
}
