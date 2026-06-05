import type { ContentVideo } from "../../services/contentTypes";
import type { YoutubeChannelVideo } from "./fetchChannelVideos";

function relativePublished(dateStr: string): { hi: string; en: string } {
  if (!dateStr) return { hi: "", en: "" };
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return { hi: "अभी", en: "Just now" };
  if (mins < 60) return { hi: `${mins} मिनट पहले`, en: `${mins} min ago` };
  if (hours < 24) return { hi: `${hours} घंटे पहले`, en: `${hours} hour${hours > 1 ? "s" : ""} ago` };
  if (days < 7) return { hi: `${days} दिन पहले`, en: `${days} day${days > 1 ? "s" : ""} ago` };
  return {
    hi: new Date(dateStr).toLocaleDateString("hi-IN"),
    en: new Date(dateStr).toLocaleDateString("en-IN"),
  };
}

export function adaptYoutubeVideo(v: YoutubeChannelVideo): ContentVideo {
  const rel = relativePublished(v.publishedAt);
  return {
    id: v.videoId,
    title: v.title,
    titleEn: v.title,
    thumbnail: v.thumbnailUrl,
    duration: v.duration,
    views: v.viewsFormatted,
    category: "वीडियो",
    categoryEn: "Videos",
    youtubeUrl: v.youtubeUrl,
    publishedHi: rel.hi,
    publishedEn: rel.en,
  };
}

export function adaptYoutubeVideos(videos: YoutubeChannelVideo[]): ContentVideo[] {
  return videos.map(adaptYoutubeVideo);
}
