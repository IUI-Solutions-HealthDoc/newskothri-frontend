import type { Metadata } from "next";
import ShowsPageClient from "../../features/shows/client/ShowsPageClient";
import { showsMetadata } from "../../features/shows/seo/metadata";
import { fetchYoutubeChannelStats } from "../../lib/youtube/fetchChannelStats";

export const metadata: Metadata = showsMetadata;

export default async function ShowsPage() {
  const channelStats = await fetchYoutubeChannelStats();
  return <ShowsPageClient channelStats={channelStats} />;
}
