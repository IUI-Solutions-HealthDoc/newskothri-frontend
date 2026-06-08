"use client";

import type { ArticleHeroImage } from "../../../services/contentTypes";
import { IMG_EAGER_HIGH } from "../../../lib/imageLoading";
import ArticleImage from "../../../components/ArticleImage";

export default function ArticleHero({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  heroImage,
  imgErr,
  onImgError,
}: {
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
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
        <ArticleImage
          src={imageSrc}
          alt={resolvedAlt}
          width={imageWidth}
          height={imageHeight}
          className="article-hero-img"
          fill={false}
          sizes="(max-width: 900px) 100vw, 920px"
          onError={onImgError}
          {...IMG_EAGER_HIGH}
        />
      </div>
      {caption}
    </figure>
  );
}
