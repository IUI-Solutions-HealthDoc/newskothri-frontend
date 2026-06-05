"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import YoutubeThumbImg from "./YoutubeThumbImg";
import { youtubeVideoIdFromUrl } from "../utils/youtube";

type PlaySize = "sm" | "md" | "lg";

const PLAY_ICON: Record<PlaySize, number> = { sm: 14, md: 20, lg: 26 };

type Props = {
  youtubeUrl: string;
  title: string;
  thumbnail?: string;
  className?: string;
  playBtnClassName?: string;
  playSize?: PlaySize;
  duration?: ReactNode;
};

/**
 * Thumbnail facade — iframe loads only after the user taps play (saves bandwidth).
 */
export default function YoutubeLazyEmbed({
  youtubeUrl,
  title,
  thumbnail,
  className = "",
  playBtnClassName = "yt-lazy-play",
  playSize = "md",
  duration,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const videoId = youtubeVideoIdFromUrl(youtubeUrl);

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (!videoId) return null;

  if (playing) {
    return (
      <div className={`yt-lazy-embed yt-lazy-embed--playing ${className}`.trim()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`yt-lazy-embed yt-lazy-embed--facade ${className}`.trim()}
      onClick={handlePlay}
      aria-label={`${title} — play`}
    >
      <YoutubeThumbImg
        youtubeUrl={youtubeUrl}
        alt=""
        className="shows-thumb-img"
        fallbackSrc={thumbnail}
      />
      <span className="shows-thumb-overlay" aria-hidden />
      <span className={playBtnClassName} aria-hidden>
        <Play size={PLAY_ICON[playSize]} fill="white" color="white" />
      </span>
      {duration}
    </button>
  );
}
