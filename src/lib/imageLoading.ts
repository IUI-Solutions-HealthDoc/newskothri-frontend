/** Default for below-the-fold / list / body images */
export const IMG_LAZY = {
  loading: "lazy" as const,
  decoding: "async" as const,
};

/** Hero, article lead image, nav logo — do not lazy-load LCP candidates */
export const IMG_EAGER = {
  loading: "eager" as const,
  decoding: "async" as const,
};

export const IMG_EAGER_HIGH = {
  ...IMG_EAGER,
  fetchPriority: "high" as const,
};

/** Default width/height for article body images when CMS omits dimensions (16:9). */
const BODY_IMG_WIDTH = 800;
const BODY_IMG_HEIGHT = 450;

/** Inject loading, decoding, and fallback dimensions on `<img>` tags inside sanitized HTML. */
export function lazyLoadImagesInHtml(html: string): string {
  return String(html || "").replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
    let next = attrs;
    if (!/\bloading\s*=/i.test(next)) {
      next = ` loading="lazy"${next}`;
    }
    if (!/\bdecoding\s*=/i.test(next)) {
      next = ` decoding="async"${next}`;
    }
    if (!/\bwidth\s*=/i.test(next)) {
      next = ` width="${BODY_IMG_WIDTH}"${next}`;
    }
    if (!/\bheight\s*=/i.test(next)) {
      next = ` height="${BODY_IMG_HEIGHT}"${next}`;
    }
    return `<img${next}>`;
  });
}
