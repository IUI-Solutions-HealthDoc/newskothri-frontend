"use client";

import { motion, type MotionValue } from "framer-motion";
import { IMG_EAGER_HIGH } from "../../../lib/imageLoading";

export default function ArticleHero({
  scaleX,
  imageSrc,
  imageAlt,
  imgErr,
  onImgError,
}: {
  scaleX: MotionValue<number>;
  imageSrc: string;
  imageAlt: string;
  imgErr: boolean;
  onImgError: () => void;
}) {
  return (
    <>
      <motion.div className="article-progress-bar" style={{ scaleX, transformOrigin: "0%" }} />
      <div className="article-hero-wrap kn-media-frame">
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
    </>
  );
}
