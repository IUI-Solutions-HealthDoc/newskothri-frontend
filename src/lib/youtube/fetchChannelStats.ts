import { YOUTUBE_CHANNEL_HANDLE } from "../../config/youtubeChannel";
import { formatCompactCount } from "./formatChannelCount";

export type YoutubeChannelStats = {
  handle: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  subscribersFormatted: string;
  videosFormatted: string;
  viewsFormatted: string;
};

const REVALIDATE_SEC = 3600;

function parseStat(value: unknown): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Live stats from YouTube Data API v3 (`channels.list` + `forHandle`). Returns null if unset key or API error. */
export async function fetchYoutubeChannelStats(): Promise<YoutubeChannelStats | null> {
  const apiKey = (process.env.YOUTUBE_API_KEY || "").trim();
  if (!apiKey) return null;

  const handle = YOUTUBE_CHANNEL_HANDLE;
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "statistics");
  url.searchParams.set("forHandle", handle);
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      items?: { statistics?: Record<string, string> }[];
    };
    const stats = data.items?.[0]?.statistics;
    if (!stats) return null;

    const subscriberCount = parseStat(stats.subscriberCount);
    const videoCount = parseStat(stats.videoCount);
    const viewCount = parseStat(stats.viewCount);

    return {
      handle,
      subscriberCount,
      videoCount,
      viewCount,
      subscribersFormatted: formatCompactCount(subscriberCount),
      videosFormatted: formatCompactCount(videoCount),
      viewsFormatted: `${formatCompactCount(viewCount)}+`,
    };
  } catch {
    return null;
  }
}
