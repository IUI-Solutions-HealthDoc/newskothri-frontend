/** Legacy card shape still used by a few components (mock content removed). */
export interface NewsItem {
  id: string | number;
  category: string;
  categoryEn: string;
  categorySlug: string;
  /** All category slugs from API (primary + secondary tags). */
  categorySlugs?: string[];
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  image: string;
  time: string;
  timeEn: string;
  author: string;
  authorEn: string;
  isBreaking?: boolean;
  content?: string[];
  contentEn?: string[];
  tags?: string[];
  tagsEn?: string[];
  readTime?: string;
  viewCount?: number;
  upvoteCount?: number;
}
