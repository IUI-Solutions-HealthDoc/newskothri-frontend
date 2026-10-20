import type { BackendArticle } from "../services/newsApi";
import { apiFetchSignal } from "./apiFetchSignal";
import { serverApiUrl } from "./serverApiOrigin";

/** ISR revalidate for public pages — keep in sync with `revalidate` exports on home/category/article routes. */
export const PUBLIC_PAGE_REVALIDATE_SEC = 60;

export type PublicArticlesPage = {
  articles: BackendArticle[];
  total: number;
  page: number;
};

export async function fetchPublicArticles(params: {
  category?: string;
  limit?: number;
  page?: number;
  locale?: "hi" | "en";
  latestDays?: number;
} = {}): Promise<BackendArticle[]> {
  const { articles } = await fetchPublicArticlesPage(params);
  return articles;
}

export async function fetchPublicArticlesPage(params: {
  category?: string;
  limit?: number;
  page?: number;
  locale?: "hi" | "en";
  latestDays?: number;
} = {}): Promise<PublicArticlesPage> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.page) qs.set("page", String(params.page));
  if (params.locale) qs.set("locale", params.locale);
  if (params.latestDays) qs.set("latestDays", String(params.latestDays));

  try {
    const res = await fetch(serverApiUrl(`/api/public/articles?${qs.toString()}`), {
      next: { revalidate: PUBLIC_PAGE_REVALIDATE_SEC },
      signal: apiFetchSignal(),
    });
    if (!res.ok) return { articles: [], total: 0, page: Number(params.page) || 1 };

    const data = (await res.json()) as { articles?: BackendArticle[]; total?: number; page?: number };
    return {
      articles: data.articles || [],
      total: Number(data.total) || 0,
      page: Number(data.page) || Number(params.page) || 1,
    };
  } catch {
    return { articles: [], total: 0, page: Number(params.page) || 1 };
  }
}

export async function fetchPublicArticleById(
  id: string,
  locale?: "hi" | "en"
): Promise<BackendArticle | null> {
  try {
    const qs = locale ? `?locale=${locale}` : "";
    const res = await fetch(
      serverApiUrl(`/api/public/articles/${encodeURIComponent(String(id || "").trim())}${qs}`),
      {
        next: { revalidate: PUBLIC_PAGE_REVALIDATE_SEC },
        signal: apiFetchSignal(),
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { article?: BackendArticle };
    return data.article || null;
  } catch {
    return null;
  }
}

export type PublicHomeFeed = {
  /** Newest first: latest stories followed by each category's top stories, de-duplicated. */
  articles: BackendArticle[];
  latest: BackendArticle[];
  total: number;
};

/**
 * Home page data in one request (`/api/public/home`). Falls back to the large
 * list call when the backend does not have the endpoint yet.
 */
export async function fetchPublicHomeFeed(locale: "hi" | "en"): Promise<PublicHomeFeed> {
  try {
    const res = await fetch(
      serverApiUrl(`/api/public/home?locale=${locale}&perCategory=10&latest=24`),
      {
        next: { revalidate: PUBLIC_PAGE_REVALIDATE_SEC },
        signal: apiFetchSignal(),
      }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        latest?: BackendArticle[];
        byCategory?: Record<string, BackendArticle[]>;
        total?: number;
      };
      const latest = data.latest || [];
      const seen = new Set<string>();
      const merged: BackendArticle[] = [];
      for (const a of [...latest, ...Object.values(data.byCategory || {}).flat()]) {
        const key = String(a._id);
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(a);
      }
      const time = (a: BackendArticle) => new Date(a.publishedAt || a.createdAt || 0).getTime() || 0;
      merged.sort((a, b) => time(b) - time(a));
      return { articles: merged, latest, total: Number(data.total) || 0 };
    }
  } catch {
    /* fall back below */
  }
  const { articles, total } = await fetchPublicArticlesPage({ limit: 120, locale });
  return { articles, latest: articles.slice(0, 24), total };
}

export async function fetchPublicRecommendations(
  id: string,
  opts: { limit?: number; locale?: "hi" | "en" } = {}
): Promise<BackendArticle[]> {
  const qs = new URLSearchParams();
  qs.set("limit", String(opts.limit || 14));
  if (opts.locale) qs.set("locale", opts.locale);
  try {
    const res = await fetch(
      serverApiUrl(`/api/public/articles/${encodeURIComponent(id)}/recommendations?${qs.toString()}`),
      { next: { revalidate: 300 }, signal: apiFetchSignal() }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: BackendArticle[] };
    return data.articles || [];
  } catch {
    return [];
  }
}
