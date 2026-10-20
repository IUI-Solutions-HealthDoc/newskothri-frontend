/* eslint-disable react-hooks/set-state-in-effect -- reader sync when token/article id changes matches legacy client */
import { useCallback, useEffect, useState } from "react";
import type { NewsItem } from "../types/article";
import {
  addBookmark,
  addUpvote,
  getArticleState,
  hasBookmarked,
  hasUpvoted,
  recordHistory,
  removeBookmark,
  removeUpvote,
  sendArticleView,
} from "../../../services/readerApi";
import { publicArticleSegmentsMatch, upvoteCountFromApi } from "../utils/formatArticle";

/**
 * Reader bookmark/upvote state, sync with API, and lightweight engagement signals.
 */
/** Matches `useNavigate()` from `src/lib/routerShim.tsx` */
export type ArticleNavigate = (to: string | number, options?: { replace?: boolean }) => void;

export function useBookmarks(
  articleId: string,
  token: string | null,
  article: NewsItem | null,
  navigate: ArticleNavigate
) {
  const [bookmarked, setBookmarked] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    if (!article || !publicArticleSegmentsMatch(articleId, article)) {
      setUpvoteCount(0);
      return;
    }
    setUpvoteCount(typeof article.upvoteCount === "number" ? article.upvoteCount : 0);
  }, [article, articleId]);

  const handleBookmarkToggle = useCallback(async () => {
    if (!articleId) return;
    if (!token) {
      navigate(`/profile?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (bookmarked) {
      await removeBookmark(token, articleId).catch(() => {});
      setBookmarked(false);
      return;
    }
    // The bookmark endpoint records the recommendation signal itself.
    await addBookmark(token, articleId).catch(() => {});
    setBookmarked(true);
  }, [articleId, token, bookmarked, navigate]);

  const handleUpvoteToggle = useCallback(async () => {
    if (!articleId) return;
    if (!token) {
      navigate(`/profile?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (upvoted) {
      setUpvoted(false);
      setUpvoteCount((c) => Math.max(0, c - 1));
      const res = await removeUpvote(token, articleId).catch(() => null);
      const serverCount = upvoteCountFromApi(res);
      if (serverCount != null) {
        setUpvoteCount(serverCount);
      } else {
        setUpvoted(true);
        setUpvoteCount((c) => c + 1);
      }
      return;
    }
    setUpvoted(true);
    setUpvoteCount((c) => c + 1);
    const res = await addUpvote(token, articleId).catch(() => null);
    const serverCount = upvoteCountFromApi(res);
    if (serverCount != null) {
      setUpvoteCount(serverCount);
    } else {
      setUpvoted(false);
      setUpvoteCount((c) => Math.max(0, c - 1));
    }
  }, [articleId, token, upvoted, navigate]);

  useEffect(() => {
    if (!token || !articleId) {
      setUpvoted(false);
      setBookmarked(false);
      return;
    }
    let cancelled = false;
    getArticleState(token, articleId)
      .then((r) => {
        if (cancelled) return;
        setBookmarked(Boolean(r.bookmarked));
        setUpvoted(Boolean(r.upvoted));
      })
      .catch(() =>
        // Older backend: fall back to the two single-purpose endpoints.
        Promise.all([
          hasBookmarked(token, articleId).catch(() => ({ bookmarked: false })),
          hasUpvoted(token, articleId).catch(() => ({ hasUpvoted: false })),
        ]).then(([b, u]) => {
          if (cancelled) return;
          setBookmarked(Boolean(b.bookmarked));
          setUpvoted(Boolean(u.hasUpvoted));
        })
      );
    return () => {
      cancelled = true;
    };
  }, [token, articleId]);

  useEffect(() => {
    if (!articleId || !article || !publicArticleSegmentsMatch(articleId, article)) return;
    sendArticleView(String(article.id || articleId));
  }, [articleId, article]);

  useEffect(() => {
    if (!token || !articleId) return;
    const timer = window.setTimeout(() => {
      // History also records the "view" recommendation signal server-side.
      recordHistory(token, articleId, 15, 20).catch(() => {});
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [token, articleId]);

  return {
    bookmarked,
    upvoted,
    upvoteCount,
    handleBookmarkToggle,
    handleUpvoteToggle,
  };
}
