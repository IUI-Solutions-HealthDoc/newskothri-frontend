import type { ContentArticle } from "../../../services/contentTypes";
import { displayDek, displayHeadline } from "../../../services/articleDisplay";
import { homeSections } from "../config/sections";

export function pickCategory<T extends { categorySlug: string }>(feed: T[], slug: string, max: number): T[] {
  return feed.filter((a) => a.categorySlug === slug).slice(0, max);
}

/** IDs already shown in home category blocks (not the full prefetch). */
export function collectHomeDisplayedIds(
  feed: ContentArticle[],
  sections: typeof homeSections = homeSections
): string[] {
  const ids = new Set<string>();
  for (const section of sections) {
    for (const a of pickCategory(feed, section.slug, 10)) ids.add(a.id);
  }
  return [...ids];
}

export function headline(item: ContentArticle, locale: "hi" | "en") {
  return displayHeadline(item, locale);
}

export function dek(item: ContentArticle, locale: "hi" | "en") {
  return displayDek(item, locale);
}
