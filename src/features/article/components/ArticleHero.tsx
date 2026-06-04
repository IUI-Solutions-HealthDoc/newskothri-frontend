"use client";

import type { ArticleHeroImage } from "../../../services/contentTypes";
import { IMG_EAGER_HIGH } from "../../../lib/imageLoading";

export default function ArticleHero({
  imageSrc,
  imageAlt,
  heroImage,
  imgErr,
  onImgError,
}: {
  imageSrc: string;
  imageAlt: string;
  heroImage?: ArticleHeroImage;
  imgErr: boolean;
  onImgError: () => void;
}) {
  const resolvedAlt = heroImage?.alt?.trim() || imageAlt;
  const description = heroImage?.imageDescription?.trim() || heroImage?.caption?.trim() || "";
  const source = heroImage?.source?.trim() || "";
  const showCaption = Boolean(description || source);

  const caption = showCaption ? (
    <figcaption className="article-hero-caption">
      {source ? (
        <p className="article-hero-source">
          <em>{source}</em>
        </p>
      ) : null}
      {description ? <p className="article-hero-caption-text">{description}</p> : null}
    </figcaption>
  ) : null;

  if (imgErr) {
    return (
      <figure className="article-hero-figure">
        <div className="article-hero-media">
          <div className="article-hero-fallback" role="img" aria-label={resolvedAlt} />
        </div>
        {caption}
      </figure>
    );
  }

  return (
    <figure className="article-hero-figure">
      <div className="article-hero-media">
        <img
          src={imageSrc}
          alt={resolvedAlt}
          className="article-hero-img"
          onError={onImgError}
          {...IMG_EAGER_HIGH}
        />
      </div>
      {caption}
    </figure>
  );
}
