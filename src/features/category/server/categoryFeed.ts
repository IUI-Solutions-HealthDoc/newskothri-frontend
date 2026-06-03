import type { ContentArticle } from "../../../services/contentTypes";
import { displayDek, displayHeadline } from "../../../services/articleDisplay";

export function categoryHeadline(item: ContentArticle, locale: "hi" | "en") {
  return displayHeadline(item, locale);
}

export function categoryDek(item: ContentArticle, locale: "hi" | "en") {
  return displayDek(item, locale);
}
