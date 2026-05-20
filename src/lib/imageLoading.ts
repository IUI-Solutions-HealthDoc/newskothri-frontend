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

/** Inject loading="lazy" on `<img>` tags inside sanitized HTML (article body). */
export function lazyLoadImagesInHtml(html: string): string {
  return String(html || "").replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
    if (/\bloading\s*=/i.test(attrs)) return full;
    const decoding = /\bdecoding\s*=/i.test(attrs) ? "" : ' decoding="async"';
    return `<img loading="lazy"${decoding}${attrs}>`;
  });
}
