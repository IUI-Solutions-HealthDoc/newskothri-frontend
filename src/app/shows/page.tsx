import type { Metadata } from "next";
import ShowsPageClient from "../../features/shows/client/ShowsPageClient";
import { showsMetadata } from "../../features/shows/seo/metadata";
import { adaptYoutubeVideos } from "../../lib/youtube/adaptYoutubeVideos";
import { fetchYoutubeChannelStats } from "../../lib/youtube/fetchChannelStats";
import { fetchYoutubeChannelVideos } from "../../lib/youtube/fetchChannelVideos";

export const metadata: Metadata = showsMetadata;

export default async function ShowsPage() {
  const [channelStats, channelVideos] = await Promise.all([
    fetchYoutubeChannelStats(),
    fetchYoutubeChannelVideos(),
  ]);
  const initialVideos = adaptYoutubeVideos(channelVideos);

  return <ShowsPageClient channelStats={channelStats} initialVideos={initialVideos} />;
}
