import { NextResponse } from "next/server";
import { fetchYoutubeChannelVideos } from "../../../../lib/youtube/fetchChannelVideos";

export const dynamic = "force-dynamic";

/** Public JSON for client components; cached at the edge for 1h. */
export async function GET() {
  const videos = await fetchYoutubeChannelVideos();
  return NextResponse.json(
    { videos },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
