import { cache } from "react";
import { fetchPublicArticleById } from "../../../lib/serverPublicApi";

/**
 * Server-only: raw published article for metadata / JSON-LD / page body.
 * Wrapped in React `cache` so metadata, JSON-LD and the page share one fetch per request.
 * Returns null if missing or fetch fails.
 */
export const getArticle = cache(async (id: string, locale?: "hi" | "en") => {
  return fetchPublicArticleById(id, locale);
});
