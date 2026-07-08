import type { Metadata } from "next";
import { siteDefaultDescription, siteName as siteNameForLang, type UiLang } from "../../i18n/siteCopy";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical origin for metadata, sitemap, and robots.
 * Priority: NEXT_PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost.
 * Only accepts hostnames that contain a dot (guards against bare internal names like "vercel").
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
  if (raw) {
    try {
      const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
      return stripTrailingSlash(u.origin);
    } catch {
      /* fall through */
    }
  }

  // Vercel sets this to the canonical production domain (e.g. "newskothri.vercel.app")
  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodUrl) {
    const host = prodUrl.replace(/^https?:\/\//i, "");
    if (host && host.includes(".")) return `https://${host}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//i, "");
    // Only use if it looks like a real hostname (contains a dot)
    if (host && host.includes(".")) return `https://${host}`;
  }

  return "http://localhost:5280";
}


/** Default English — prefer `siteName(lang)` / `siteDefaultDescription(lang)` with `getServerUiLang()`. */
export const siteName = siteNameForLang("en");

export const defaultDescription = siteDefaultDescription("en");

export function localizedSiteName(lang: UiLang): string {
  return siteNameForLang(lang);
}

export function localizedDefaultDescription(lang: UiLang): string {
  return siteDefaultDescription(lang);
}

export function toAbsoluteUrl(path: string): string {
  const t = String(path || "").trim();
  if (!t) return getSiteUrl();
  if (/^https?:\/\//i.test(t)) return t;
  const p = t.startsWith("/") ? t : `/${t}`;
  return `${getSiteUrl()}${p}`;
}

/** Safe for `metadataBase` in `layout.tsx` — never throws even if env is mis-set at build/runtime. */
export function getMetadataBase(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    const v = process.env.VERCEL_URL?.trim();
    if (v) {
      try {
        return new URL(`https://${v.replace(/^https?:\/\//i, "")}`);
      } catch {
        /* fall through */
      }
    }
    return new URL("http://localhost:5280");
  }
}

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}
