import type { MetadataRoute } from "next";
import { categories } from "../data/publicCategories";
import { apiFetchSignal } from "../lib/apiFetchSignal";
import { serverApiUrl } from "../lib/serverApiOrigin";
import { getSiteUrl } from "../lib/seo/metadataHelpers";

type PublicArticle = {
  _id: string;
  articleNumber?: number;
  slug?: string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
};

function normalizeSlugForUrl(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function articlePathForSitemap(a: PublicArticle): string {
  const hasNum = a.articleNumber != null && Number.isFinite(Number(a.articleNumber));
  const numStr = hasNum ? String(a.articleNumber) : "";
  const slug = normalizeSlugForUrl(a.slug || "");
  if (slug && hasNum && /^\d{9}$/.test(numStr)) {
    return `/article/${slug}-${numStr}`;
  }
  return `/article/${hasNum ? numStr : a._id}`;
}

const MAX_ARTICLES = Number(process.env.SITEMAP_MAX_ARTICLES || 5000);

function absolute(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${p}`;
}

async function fetchPublishedArticlesForLocale(locale: "hi" | "en"): Promise<PublicArticle[]> {
  try {
    const res = await fetch(
      serverApiUrl(`/api/public/sitemap?limit=${MAX_ARTICLES}&locale=${locale}`),
      {
        next: { revalidate: 600 },
        signal: apiFetchSignal(),
      }
    );
    if (res.ok) {
      const data = (await res.json()) as { articles?: PublicArticle[] };
      return data.articles || [];
    }
  } catch {
    /* fall through to the paged list for older backends */
  }
  return fetchPublishedArticlesPaged(locale);
}

/** Fallback for backends without `/api/public/sitemap`. */
async function fetchPublishedArticlesPaged(locale: "hi" | "en"): Promise<PublicArticle[]> {
  const all: PublicArticle[] = [];
  for (let page = 1; all.length < MAX_ARTICLES; page += 1) {
    try {
      const res = await fetch(
        serverApiUrl(`/api/public/articles?limit=100&page=${page}&locale=${locale}`),
        { next: { revalidate: 600 }, signal: apiFetchSignal() }
      );
      if (!res.ok) break;
      const data = (await res.json()) as { articles?: PublicArticle[] };
      const articles = data.articles || [];
      all.push(...articles);
      if (articles.length < 100) break;
    } catch {
      break;
    }
  }
  return all;
}

async function fetchPublishedArticles(): Promise<PublicArticle[]> {
  const [hi, en] = await Promise.all([
    fetchPublishedArticlesForLocale("hi"),
    fetchPublishedArticlesForLocale("en"),
  ]);
  const seen = new Set<string>();
  const merged: PublicArticle[] = [];
  for (const a of [...hi, ...en]) {
    const key = String(a.articleNumber ?? a._id);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(a);
    if (merged.length >= MAX_ARTICLES) break;
  }
  return merged;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: absolute("/shows"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absolute("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.45 },
    { url: absolute("/mission"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absolute("/vision"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absolute("/privacy"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: absolute("/cookies"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: absolute("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug !== "home")
    .map((c) => ({
      url: absolute(`/category/${c.slug}`),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    }));

  const articles = await fetchPublishedArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absolute(articlePathForSitemap(a)),
    lastModified: a.updatedAt ? new Date(a.updatedAt) : a.publishedAt ? new Date(a.publishedAt) : a.createdAt ? new Date(a.createdAt) : now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
