import { YOUTUBE_CHANNEL_HANDLE } from "../../config/youtubeChannel";
import { formatCompactCount } from "./formatChannelCount";
import { formatIsoDuration, parseIsoDurationSeconds } from "./formatIsoDuration";
import { isYoutubeShort, youtubeUrlForVideo } from "./isYoutubeShort";

export type YoutubeChannelVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  durationIso: string;
  durationSeconds: number;
  isShort: boolean;
  viewCount: number;
  viewsFormatted: string;
  publishedAt: string;
  youtubeUrl: string;
};

const REVALIDATE_SEC = 3600;
const MAX_VIDEOS = 500;
const PLAYLIST_PAGE_SIZE = 50;
const VIDEO_BATCH_SIZE = 50;

async function fetchUploadsPlaylistId(apiKey: string, handle: string): Promise<string | null> {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("forHandle", handle);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SEC } });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
  };
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function fetchPlaylistVideoIds(apiKey: string, playlistId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", String(PLAYLIST_PAGE_SIZE));
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SEC } });
    if (!res.ok) break;

    const data = (await res.json()) as {
      items?: { contentDetails?: { videoId?: string } }[];
      nextPageToken?: string;
    };

    for (const item of data.items ?? []) {
      const id = item.contentDetails?.videoId;
      if (id) ids.push(id);
      if (ids.length >= MAX_VIDEOS) return ids;
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return ids;
}

async function fetchVideoDetails(apiKey: string, videoIds: string[]): Promise<YoutubeChannelVideo[]> {
  const results: YoutubeChannelVideo[] = [];

  for (let i = 0; i < videoIds.length; i += VIDEO_BATCH_SIZE) {
    const batch = videoIds.slice(i, i + VIDEO_BATCH_SIZE);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", batch.join(","));
    url.searchParams.set("key", apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SEC } });
    if (!res.ok) continue;

    const data = (await res.json()) as {
      items?: {
        id?: string;
        snippet?: {
          title?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: Record<string, { url?: string }>;
        };
        contentDetails?: { duration?: string };
        statistics?: { viewCount?: string };
      }[];
    };

    for (const item of data.items ?? []) {
      const videoId = item.id;
      const snippet = item.snippet;
      if (!videoId || !snippet) continue;

      const thumb =
        snippet.thumbnails?.maxres?.url ??
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ??
        snippet.thumbnails?.default?.url ??
        "";

      const viewCount = Number.parseInt(item.statistics?.viewCount ?? "0", 10) || 0;
      const durationIso = item.contentDetails?.duration ?? "";
      const durationSeconds = parseIsoDurationSeconds(durationIso);
      const short = isYoutubeShort({
        durationIso,
        title: snippet.title,
        description: snippet.description,
      });

      results.push({
        videoId,
        title: snippet.title ?? "",
        thumbnailUrl: thumb,
        duration: formatIsoDuration(durationIso),
        durationIso,
        durationSeconds,
        isShort: short,
        viewCount,
        viewsFormatted: formatCompactCount(viewCount),
        publishedAt: snippet.publishedAt ?? "",
        youtubeUrl: youtubeUrlForVideo(videoId, short),
      });
    }
  }

  return results;
}

/** All uploads from the configured channel (newest first). Empty if API key missing or request fails. */
export async function fetchYoutubeChannelVideos(): Promise<YoutubeChannelVideo[]> {
  const apiKey = (process.env.YOUTUBE_API_KEY || "").trim();
  if (!apiKey) return [];

  const handle = YOUTUBE_CHANNEL_HANDLE;

  try {
    const playlistId = await fetchUploadsPlaylistId(apiKey, handle);
    if (!playlistId) return [];

    const videoIds = await fetchPlaylistVideoIds(apiKey, playlistId);
    if (!videoIds.length) return [];

    const videos = await fetchVideoDetails(apiKey, videoIds);
    const orderMap = new Map(videoIds.map((id, idx) => [id, idx]));
    videos.sort((a, b) => (orderMap.get(a.videoId) ?? 0) - (orderMap.get(b.videoId) ?? 0));

    return videos;
  } catch {
    return [];
  }
}
