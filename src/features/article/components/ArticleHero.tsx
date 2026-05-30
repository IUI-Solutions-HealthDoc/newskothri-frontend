"use client";

import type { ArticleHeroImage } from "../../../services/contentTypes";
import { IMG_EAGER_HIGH } from "../../../lib/imageLoading";

type TFn = (hi: string, en: string) => string;

export default function ArticleHero({
  imageSrc,
  imageAlt,
  heroImage,
  imgErr,
  onImgError,
  t,
}: {
  imageSrc: string;
  imageAlt: string;
  heroImage?: ArticleHeroImage;
  imgErr: boolean;
  onImgError: () => void;
  t: TFn;
}) {
  const resolvedAlt = heroImage?.alt?.trim() || imageAlt;
  const description = heroImage?.imageDescription?.trim() || heroImage?.caption?.trim() || "";
  const source = heroImage?.source?.trim() || "";
  const showCaption = Boolean(description || source);

  if (imgErr) {
    return (
      <figure className="article-hero-figure">
        <div className="article-hero-media">
          <div className="article-hero-fallback" role="img" aria-label={resolvedAlt} />
        </div>
        {showCaption ? (
          <figcaption className="article-hero-caption">
            {description ? <p className="article-hero-caption-text">{description}</p> : null}
            {source ? (
              <p className="article-hero-credit">
                <span className="article-hero-credit-label">{t("स्रोत", "Source")}</span>
                <span className="article-hero-credit-value">{source}</span>
              </p>
            ) : null}
          </figcaption>
        ) : null}
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
      {showCaption ? (
        <figcaption className="article-hero-caption">
          {description ? <p className="article-hero-caption-text">{description}</p> : null}
          {source ? (
            <p className="article-hero-credit">
              <span className="article-hero-credit-label">{t("स्रोत", "Source")}</span>
              <span className="article-hero-credit-value">{source}</span>
            </p>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
