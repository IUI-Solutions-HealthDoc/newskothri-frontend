"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const EAGER_SELECTORS = [
  ".hero-cin-img",
  ".article-hero-img",
  ".brand-logo-img",
  ".nav-brand-logo-img",
];

function shouldEager(img: HTMLImageElement): boolean {
  if (img.getAttribute("loading") === "eager") return true;
  if (img.getAttribute("fetchpriority") === "high") return true;
  return EAGER_SELECTORS.some((sel) => img.matches(sel));
}

function applyLazyImages(root: ParentNode = document) {
  root.querySelectorAll("img").forEach((img) => {
    if (shouldEager(img)) return;
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
  });
}

/** Ensures every `<img>` is lazy-loaded except LCP heroes and logos. */
export default function LazyImagesInit() {
  const pathname = usePathname();

  useEffect(() => {
    applyLazyImages();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) {
            if (!shouldEager(node)) {
              if (!node.hasAttribute("loading")) node.setAttribute("loading", "lazy");
              if (!node.hasAttribute("decoding")) node.setAttribute("decoding", "async");
            }
          } else if (node instanceof HTMLElement) {
            applyLazyImages(node);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
