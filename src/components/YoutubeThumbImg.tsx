import { useEffect, useMemo, useState } from "react";
import { youtubeVideoIdFromUrl } from "../utils/youtube";

type Props = {
  youtubeUrl: string;
  alt: string;
  className?: string;
  /** Used when URL has no id or all CDN images fail */
  fallbackSrc?: string;
};

function thumbUrls(videoId: string) {
  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * YouTube poster (maxres → hqdefault) with optional static fallback.
 */
export default function YoutubeThumbImg({ youtubeUrl, alt, className, fallbackSrc }: Props) {
  const id = useMemo(() => youtubeVideoIdFromUrl(youtubeUrl), [youtubeUrl]);
  const urls = id ? thumbUrls(id) : null;
  const primary = urls?.maxres ?? fallbackSrc ?? "";
  const [src, setSrc] = useState(primary);
  const [quality, setQuality] = useState<"maxres" | "hq" | "fallback">("maxres");

  useEffect(() => {
    if (urls) {
      setSrc(urls.maxres);
      setQuality("maxres");
    } else {
      setSrc(fallbackSrc || "");
      setQuality("fallback");
    }
  }, [urls, fallbackSrc]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (quality === "maxres" && urls) {
          setSrc(urls.hq);
          setQuality("hq");
          return;
        }
        if (quality === "hq" && fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
          setQuality("fallback");
        }
      }}
    />
  );
}
