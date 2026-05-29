"use client";

import { IMG_EAGER_HIGH } from "../../../lib/imageLoading";

export default function ArticleHero({
  imageSrc,
  imageAlt,
  imgErr,
  onImgError,
}: {
  imageSrc: string;
  imageAlt: string;
  imgErr: boolean;
  onImgError: () => void;
}) {
  return (
    <div className="article-hero-slot">
      <div className="article-hero-inset kn-media-frame">
        {!imgErr ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="article-hero-img kn-media-img kn-media-img--hero"
            onError={onImgError}
            {...IMG_EAGER_HIGH}
          />
        ) : (
          <div className="article-hero-fallback" />
        )}
      </div>
    </div>
  );
}
