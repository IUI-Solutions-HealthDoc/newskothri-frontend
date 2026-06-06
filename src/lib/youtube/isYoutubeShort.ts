import { parseIsoDurationSeconds } from "./formatIsoDuration";

type ThumbnailSize = { width?: number; height?: number };

function hasShortsHashtag(text: string): boolean {
  return /#shorts\b/i.test(text);
}

function pickThumbnailSize(thumbnails?: Record<string, ThumbnailSize>): ThumbnailSize | null {
  if (!thumbnails) return null;
  for (const key of ["maxres", "standard", "high", "medium", "default"] as const) {
    const t = thumbnails[key];
    if (t?.width && t?.height) return t;
  }
  return null;
}

/** Portrait thumbnail (height > width) — vertical upload signal when playlist data is missing. */
function isPortraitThumbnail(thumbnails?: Record<string, ThumbnailSize>): boolean {
  const t = pickThumbnailSize(thumbnails);
  if (!t?.width || !t?.height) return false;
  return t.height > t.width;
}

function parseEmbedDimensions(embedHtml?: string): { width: number; height: number } | null {
  if (!embedHtml) return null;
  const width = embedHtml.match(/\bwidth="(\d+)"/i)?.[1];
  const height = embedHtml.match(/\bheight="(\d+)"/i)?.[1];
  if (!width || !height) return null;
  return { width: Number.parseInt(width, 10), height: Number.parseInt(height, 10) };
}

function isPortraitEmbed(embedHtml?: string): boolean {
  const dims = parseEmbedDimensions(embedHtml);
  if (!dims) return false;
  return dims.height > dims.width;
}

/**
 * Prefer membership in the channel’s UUSH Shorts playlist (works for >60s Shorts).
 * Heuristics below are fallback only when that playlist cannot be loaded.
 */
export function isYoutubeShort(input: {
  videoId?: string;
  inShortsPlaylist?: boolean;
  durationIso?: string;
  title?: string;
  description?: string;
  tags?: string[];
  thumbnails?: Record<string, ThumbnailSize>;
  embedHtml?: string;
}): boolean {
  if (input.inShortsPlaylist === true) return true;
  if (input.inShortsPlaylist === false) return false;

  const title = String(input.title || "");
  const description = String(input.description || "");
  const tags = input.tags ?? [];

  if (hasShortsHashtag(title) || hasShortsHashtag(description)) return true;
  if (tags.some((tag) => hasShortsHashtag(tag) || /^shorts?$/i.test(tag.trim()))) return true;
  if (isPortraitEmbed(input.embedHtml)) return true;
  if (isPortraitThumbnail(input.thumbnails)) return true;

  // Last resort: very short vertical-style uploads sometimes lack playlist sync briefly.
  const seconds = parseIsoDurationSeconds(input.durationIso ?? "");
  if (seconds > 0 && seconds <= 60 && isPortraitThumbnail(input.thumbnails)) return true;

  return false;
}

export function youtubeUrlForVideo(videoId: string, isShort: boolean): string {
  if (isShort) return `https://www.youtube.com/shorts/${videoId}`;
  return `https://www.youtube.com/watch?v=${videoId}`;
}
