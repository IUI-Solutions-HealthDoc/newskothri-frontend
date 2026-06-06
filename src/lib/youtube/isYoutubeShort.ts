import { parseIsoDurationSeconds } from "./formatIsoDuration";

/** YouTube Shorts: ≤60s uploads (API has no explicit short flag). */
export const SHORT_MAX_SECONDS = 60;

export function isYoutubeShort(input: {
  durationIso?: string;
  title?: string;
  description?: string;
}): boolean {
  const title = String(input.title || "");
  const description = String(input.description || "");
  if (/#shorts\b/i.test(title) || /#shorts\b/i.test(description)) {
    return true;
  }
  const seconds = parseIsoDurationSeconds(input.durationIso ?? "");
  return seconds > 0 && seconds <= SHORT_MAX_SECONDS;
}

export function youtubeUrlForVideo(videoId: string, isShort: boolean): string {
  if (isShort) return `https://www.youtube.com/shorts/${videoId}`;
  return `https://www.youtube.com/watch?v=${videoId}`;
}
