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
  if (imgErr) {
    return (
      <div className="article-hero-slot">
        <div className="article-hero-fallback" role="img" aria-label={imageAlt} />
      </div>
    );
  }

  return (
    <div className="article-hero-slot">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="article-hero-img"
        onError={onImgError}
        {...IMG_EAGER_HIGH}
      />
    </div>
  );
}
