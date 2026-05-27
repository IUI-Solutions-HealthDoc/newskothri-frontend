import { SITE_SOCIAL } from "./siteSocial";

/** `@handle` from official channel URL (e.g. https://www.youtube.com/@NewsKothri). */
export function youtubeHandleFromUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const m = u.pathname.match(/@([^/?#]+)/i);
    if (m?.[1]) return m[1];
  } catch {
    /* ignore */
  }
  return "NewsKothri";
}

export const YOUTUBE_CHANNEL_HANDLE =
  (process.env.YOUTUBE_CHANNEL_HANDLE || "").replace(/^@/, "").trim() ||
  youtubeHandleFromUrl(SITE_SOCIAL.youtube);
