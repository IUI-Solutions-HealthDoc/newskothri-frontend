import { fetchPublicArticleById } from "../../../lib/serverPublicApi";
import { getServerUiLang } from "../../../lib/serverLocale";

/**
 * Server-only: raw published article for metadata / JSON-LD.
 * Returns null if missing or fetch fails.
 */
export async function getArticle(id: string, locale?: "hi" | "en") {
  const loc = locale ?? (await getServerUiLang());
  return fetchPublicArticleById(id, loc);
}
