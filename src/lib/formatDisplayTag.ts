/** Normalize stored tags (may already include `#`) for a single display hashtag. */
export function formatDisplayTag(raw: string): string {
  const core = String(raw || "").trim().replace(/^#+/, "");
  return core ? `#${core}` : "";
}
