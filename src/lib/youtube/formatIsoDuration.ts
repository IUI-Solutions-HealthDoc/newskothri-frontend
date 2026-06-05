/** ISO 8601 duration (e.g. PT1H2M3S) → m:ss or h:mm:ss */
export function formatIsoDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = Number.parseInt(m[1] || "0", 10);
  const min = Number.parseInt(m[2] || "0", 10);
  const s = Number.parseInt(m[3] || "0", 10);
  if (h > 0) {
    return `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${min}:${String(s).padStart(2, "0")}`;
}
