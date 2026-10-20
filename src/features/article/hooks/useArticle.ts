/* eslint-disable react-hooks/set-state-in-effect -- article route resets loading/sidebar when id or fetched article changes (same pattern as legacy client) */
import { useState, useEffect } from "react";
import type { NewsItem } from "../types/article";
import { adaptArticle, adaptArticles } from "../../../services/articleAdapter";
import { getArticleById, getPublishedArticlesPage, getRecommendedForArticle } from "../services/articleApi";
import { articleLookupId, isArticleRefId, publicArticleSegmentsMatch } from "../utils/formatArticle";

const CLIENT_BODY_SANITIZE = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li",
    "h2", "h3", "blockquote", "span", "div", "img", "figure", "figcaption",
  ],
  ALLOWED_ATTR: ["href", "rel", "target", "class", "src", "alt", "width", "height", "loading", "decoding"],
};

/** Client-side fetches (in-app navigation fallback) are sanitized here; DOMPurify loads only when needed. */
async function sanitizeClientArticle<T extends { body?: string; bodyHi?: string }>(raw: T): Promise<T> {
  const { default: DOMPurify } = await import("dompurify");
  return {
    ...raw,
    body: raw.body ? DOMPurify.sanitize(raw.body, CLIENT_BODY_SANITIZE) : raw.body,
    bodyHi: raw.bodyHi ? DOMPurify.sanitize(raw.bodyHi, CLIENT_BODY_SANITIZE) : raw.bodyHi,
  };
}

export type InitialRelated = { recommended: NewsItem[]; more: NewsItem[] };

function pickRelated(article: NewsItem, recRaw: NewsItem[], moreRaw: NewsItem[]) {
  const recItems = recRaw.filter((n) => String(n.id) !== String(article.id));
  const recIds = new Set(recItems.map((r) => String(r.id)));
  const more = moreRaw
    .filter((n) => String(n.id) !== String(article.id) && !recIds.has(String(n.id)))
    .slice(0, 5);
  return { recItems, more };
}

export function useArticle(
  articleId: string,
  initialArticle: NewsItem | null = null,
  initialRelated: InitialRelated | null = null
) {
  const [article, setArticle] = useState<NewsItem | null>(initialArticle);
  const [loading, setLoading] = useState(!initialArticle);
  const [imgErr, setImgErr] = useState(false);
  const [initialPicks] = useState(() =>
    initialArticle && initialRelated
      ? pickRelated(initialArticle, initialRelated.recommended, initialRelated.more)
      : null
  );
  const [recommendedArticles, setRecommendedArticles] = useState<NewsItem[]>(initialPicks?.recItems ?? []);
  const [mostReadSidebar, setMostReadSidebar] = useState<NewsItem[]>(initialPicks?.more ?? []);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgErr(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (!articleId) {
      setLoading(false);
      return;
    }
    if (!isArticleRefId(articleId)) {
      setArticle(null);
      setLoading(false);
      return;
    }
    if (initialArticle && publicArticleSegmentsMatch(articleId, initialArticle)) {
      setArticle(initialArticle);
      setLoading(false);
      return;
    }
    const lookupId = articleLookupId(articleId);
    let cancelled = false;
    getArticleById(lookupId).then(async (raw) => {
      if (cancelled) return;
      if (!raw) {
        setArticle(null);
        setLoading(false);
        return;
      }
      const next = adaptArticle(await sanitizeClientArticle(raw));
      if (cancelled) return;
      setArticle(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [articleId, initialArticle]);

  useEffect(() => {
    if (!articleId || !article || !publicArticleSegmentsMatch(articleId, article)) {
      setRecommendedArticles([]);
      setMostReadSidebar([]);
      return;
    }
    if (
      initialRelated &&
      initialArticle &&
      article === initialArticle &&
      publicArticleSegmentsMatch(articleId, initialArticle)
    ) {
      const { recItems, more } = pickRelated(article, initialRelated.recommended, initialRelated.more);
      setRecommendedArticles(recItems);
      setMostReadSidebar(more);
      return;
    }
    let cancelled = false;
    const articleLocale = article.primaryLocale;
    const lookupId = articleLookupId(articleId);
    Promise.all([
      getRecommendedForArticle(lookupId, { limit: 14, locale: articleLocale }),
      getPublishedArticlesPage({ limit: 24, page: 2, locale: articleLocale }),
    ]).then(([recRaw, moreRaw]) => {
      if (cancelled) return;
      const { recItems, more } = pickRelated(
        article,
        adaptArticles(recRaw, articleLocale),
        adaptArticles(moreRaw, articleLocale)
      );
      setRecommendedArticles(recItems);
      setMostReadSidebar(more);
    });
    return () => {
      cancelled = true;
    };
  }, [articleId, article, initialArticle, initialRelated]);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return {
    article,
    loading,
    imgErr,
    setImgErr,
    recommendedArticles,
    mostReadSidebar,
    showBackTop,
  };
}

/** Clipboard + optional Web Share — depends on window location at call time */
export function useArticleClipboard() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleUnifiedMobileShare = async (title: string, summary: string) => {
    if (typeof navigator !== "undefined" && "share" in navigator && navigator.share) {
      const pageUrl = window.location.href;
      try {
        await navigator.share({
          title,
          text: (summary && summary.length > 0 ? summary : title).slice(0, 500),
          url: pageUrl,
        });
      } catch (e: unknown) {
        const n = e && typeof e === "object" && "name" in e ? String((e as { name: string }).name) : "";
        if (n === "AbortError") return;
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return { copied, handleCopyLink, handleUnifiedMobileShare };
}
