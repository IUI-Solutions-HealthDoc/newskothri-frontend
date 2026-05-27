/** Compact display for large counts (e.g. 2.4M, 180M, 1.2K). */
export function formatCompactCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${trimOneDecimal(v)}B`;
  }
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${trimOneDecimal(v)}M`;
  }
  if (n >= 10_000) {
    const v = n / 1_000;
    return `${trimOneDecimal(v)}K`;
  }
  return n.toLocaleString("en-IN");
}

function trimOneDecimal(value: number): string {
  const s = value.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/** Label for video section subtitle: "2.4M subscribers" / "2.4M सब्सक्राइबर्स". */
export function formatSubscriberSubtitle(countFormatted: string, lang: "hi" | "en"): string {
  if (countFormatted === "—") {
    return lang === "hi" ? "सब्सक्राइबर्स" : "subscribers";
  }
  return lang === "hi" ? `${countFormatted} सब्सक्राइबर्स` : `${countFormatted} subscribers`;
}
