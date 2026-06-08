export type LocaleCode = "hi" | "en";

export type ArticleHeroImage = {
  alt?: string;
  source?: string;
  imageDescription?: string;
  caption?: string;
  imageTitle?: string;
};

/** Backend-adapted article model consumed by route UI/features. */
export interface ContentArticle {
  /** Public route id (9-digit article number when assigned, else Mongo id). */
  id: string;
  /** Mongo `_id` for reader API calls when needed; mirrors backend document id. */
  mongoId: string;
  /** Which language edition this article belongs on (public feeds). */
  primaryLocale: LocaleCode;
  category: string;
  categoryEn: string;
  categorySlug: string;
  /** All category slugs (primary first). */
  categorySlugs: string[];
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  heroImage?: ArticleHeroImage;
  time: string;
  timeEn: string;
  author: string;
  authorEn: string;
  /** Resolved staff profile photo URL when author has uploaded an avatar. */
  authorAvatarUrl?: string;
  isBreaking: boolean;
  readTime: string;
  viewCount: number;
  upvoteCount: number;
  tags: string[];
  tagsEn: string[];
  /** Optional public URL slug (before numeric id). */
  slug?: string;
  content?: string[];
  contentEn?: string[];
  youtubeEmbeds?: { youtubeUrl: string; caption?: string }[];
}

/** Backend-adapted video model consumed by shows feature UI. */
export interface ContentVideo {
  id: string;
  title: string;
  titleEn: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  categoryEn: string;
  youtubeUrl: string;
  summary?: string;
  summaryEn?: string;
  publishedHi?: string;
  publishedEn?: string;
  /** From YouTube API — vertical Shorts (≤60s) vs regular uploads */
  isShort?: boolean;
}
