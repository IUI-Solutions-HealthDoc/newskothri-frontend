import { NextResponse } from "next/server";
import { fetchMarketSnapshot } from "../../../../lib/markets/fetchMarketSnapshot";

export const dynamic = "force-dynamic";

/** Public market snapshot for business articles; cached at the edge ~2 min. */
export async function GET() {
  const snapshot = await fetchMarketSnapshot();
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
