/** True when article belongs to the business / व्यापार category. */
export function isBusinessArticle(article: {
  categorySlug: string;
  categorySlugs?: string[];
}): boolean {
  const primary = String(article.categorySlug || "").trim().toLowerCase();
  if (primary === "business") return true;
  return (article.categorySlugs ?? []).some((s) => String(s).trim().toLowerCase() === "business");
}
