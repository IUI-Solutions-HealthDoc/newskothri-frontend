/** Channel `UC…` → Shorts playlist `UUSH…` (YouTube’s canonical Shorts feed). */
export function shortsPlaylistIdFromChannelId(channelId: string): string | null {
  const id = channelId.trim();
  if (!id.startsWith("UC") || id.length <= 2) return null;
  return `UUSH${id.slice(2)}`;
}

const PLAYLIST_PAGE_SIZE = 50;
const MAX_SHORTS = 500;

/** All video IDs listed in the channel’s Shorts playlist. */
export async function fetchShortsVideoIds(
  apiKey: string,
  channelId: string,
  revalidateSec = 3600
): Promise<Set<string>> {
  const playlistId = shortsPlaylistIdFromChannelId(channelId);
  if (!playlistId) return new Set();

  const ids = new Set<string>();
  let pageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", String(PLAYLIST_PAGE_SIZE));
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), { next: { revalidate: revalidateSec } });
    if (!res.ok) break;

    const data = (await res.json()) as {
      items?: { contentDetails?: { videoId?: string } }[];
      nextPageToken?: string;
    };

    for (const item of data.items ?? []) {
      const videoId = item.contentDetails?.videoId;
      if (videoId) ids.add(videoId);
      if (ids.size >= MAX_SHORTS) return ids;
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return ids;
}
