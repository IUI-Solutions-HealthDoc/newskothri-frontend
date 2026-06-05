"use client";

import { useEffect, useState } from "react";
import { adaptYoutubeVideos } from "../lib/youtube/adaptYoutubeVideos";
import type { YoutubeChannelVideo } from "../lib/youtube/fetchChannelVideos";
import type { ContentVideo } from "../services/contentTypes";
import { adaptVideos } from "../services/videoAdapter";
import { fetchPublishedVideos } from "../services/newsApi";

type Options = {
  limit?: number;
  initialVideos?: ContentVideo[];
  locale?: "hi" | "en";
  /** When true, fall back to CMS videos if YouTube feed is empty */
  cmsFallback?: boolean;
};

export function useYoutubeChannelVideos({
  limit,
  initialVideos,
  locale = "hi",
  cmsFallback = true,
}: Options = {}) {
  const [videos, setVideos] = useState<ContentVideo[]>(() => {
    const base = initialVideos ?? [];
    return limit ? base.slice(0, limit) : base;
  });
  const [loading, setLoading] = useState(!initialVideos?.length);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/youtube/channel-videos");
        if (res.ok) {
          const data = (await res.json()) as { videos?: YoutubeChannelVideo[] };
          if (data.videos?.length) {
            const adapted = adaptYoutubeVideos(data.videos);
            if (!cancelled) {
              setVideos(limit ? adapted.slice(0, limit) : adapted);
            }
            return;
          }
        }
      } catch {
        /* ignore */
      }

      if (cmsFallback) {
        try {
          const raw = await fetchPublishedVideos({ limit: limit ?? 60, locale });
          if (!cancelled) setVideos(adaptVideos(raw));
        } catch {
          /* ignore */
        }
      } else if (!cancelled && !initialVideos?.length) {
        setVideos([]);
      }
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [limit, locale, cmsFallback]);

  return { videos, loading };
}
