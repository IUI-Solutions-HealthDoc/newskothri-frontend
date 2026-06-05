import { useYoutubeChannelVideos } from "../../../hooks/useYoutubeChannelVideos";
import type { VideoItem } from "../types/shows";

export function useShowsVideos(lang: "hi" | "en", initialVideos?: VideoItem[]) {
  return useYoutubeChannelVideos({ initialVideos, locale: lang, cmsFallback: true });
}
