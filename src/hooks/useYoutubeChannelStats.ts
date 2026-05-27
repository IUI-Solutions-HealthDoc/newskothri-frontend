"use client";

import { useEffect, useState } from "react";
import type { YoutubeChannelStats } from "../lib/youtube/fetchChannelStats";

export function useYoutubeChannelStats() {
  const [stats, setStats] = useState<YoutubeChannelStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/youtube/channel-stats");
        if (!res.ok) return;
        const data = (await res.json()) as { stats?: YoutubeChannelStats | null };
        if (!cancelled && data.stats) setStats(data.stats);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading };
}
