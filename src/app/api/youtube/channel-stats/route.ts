import { NextResponse } from "next/server";
import { fetchYoutubeChannelStats } from "../../../../lib/youtube/fetchChannelStats";

export const dynamic = "force-dynamic";

/** Public JSON for client components; cached at the edge for 1h. */
export async function GET() {
  const stats = await fetchYoutubeChannelStats();
  return NextResponse.json(
    { stats },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
