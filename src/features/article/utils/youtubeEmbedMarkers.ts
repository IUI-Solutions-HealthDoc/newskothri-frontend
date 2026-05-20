import { youtubeVideoIdFromUrl } from "../../../utils/youtube";

const COMMENT_SLOT_RE = /<!--\s*kn-youtube-slot:(\d+)\s*-->/gi;
const CLASS_SLOT_RE =
  /<p[^>]*class=["'][^"']*\barticle-youtube-slot-(\d+)\b[^"']*["'][^>]*>[\s\S]*?<\/p>/gi;
const YOUTUBE_ANCHOR_RE =
  /<a\s+[^>]*href=["']([^"']*(?:youtube\.com|youtu\.be)[^"']*)["'][^>]*>[\s\S]*?<\/a>/gi;

export type ArticleBodyBlock =
  | { type: "html"; html: string }
  | { type: "youtube"; index: number };

type YoutubeEmbedRow = { youtubeUrl: string; caption?: string };

type Marker = { index: number; start: number; end: number };

function videoIdToEmbedIndex(youtubeEmbeds: YoutubeEmbedRow[]): Map<string, number> {
  const map = new Map<string, number>();
  youtubeEmbeds.forEach((row, i) => {
    const id = youtubeVideoIdFromUrl(row.youtubeUrl);
    if (id != null && !map.has(id)) map.set(id, i);
  });
  return map;
}

function collectMarkers(html: string, youtubeEmbeds: YoutubeEmbedRow[] = []): Marker[] {
  const src = String(html || "");
  const markers: Marker[] = [];
  const idToIndex = videoIdToEmbedIndex(youtubeEmbeds);

  let m: RegExpExecArray | null;
  COMMENT_SLOT_RE.lastIndex = 0;
  while ((m = COMMENT_SLOT_RE.exec(src))) {
    markers.push({
      index: Number(m[1]),
      start: m.index,
      end: m.index + m[0].length,
    });
  }

  CLASS_SLOT_RE.lastIndex = 0;
  while ((m = CLASS_SLOT_RE.exec(src))) {
    markers.push({
      index: Number(m[1]),
      start: m.index,
      end: m.index + m[0].length,
    });
  }

  YOUTUBE_ANCHOR_RE.lastIndex = 0;
  while ((m = YOUTUBE_ANCHOR_RE.exec(src))) {
    const id = youtubeVideoIdFromUrl(m[1]);
    if (id == null || !idToIndex.has(id)) continue;
    const idx = idToIndex.get(id)!;
    const start = m.index;
    const end = m.index + m[0].length;
    const overlaps = markers.some(
      (mk) => mk.index === idx && start < mk.end && end > mk.start
    );
    if (!overlaps) markers.push({ index: idx, start, end });
  }

  markers.sort((a, b) => a.start - b.start);

  const deduped: Marker[] = [];
  let lastEnd = -1;
  for (const mk of markers) {
    if (mk.start < lastEnd) continue;
    deduped.push(mk);
    lastEnd = mk.end;
  }
  return deduped;
}

/** Split article body HTML into prose blocks and YouTube slot markers (in document order). */
export function splitBodyWithYoutubeSlots(
  html: string,
  youtubeEmbeds: YoutubeEmbedRow[] = []
): ArticleBodyBlock[] {
  const src = String(html || "").trim();
  if (!src) return [];

  const markers = collectMarkers(src, youtubeEmbeds);
  if (!markers.length) return [{ type: "html", html: src }];

  const blocks: ArticleBodyBlock[] = [];
  let last = 0;
  for (const mk of markers) {
    const before = src.slice(last, mk.start);
    if (before.trim()) blocks.push({ type: "html", html: before });
    blocks.push({ type: "youtube", index: mk.index });
    last = mk.end;
  }
  const tail = src.slice(last);
  if (tail.trim()) blocks.push({ type: "html", html: tail });

  if (!blocks.length) blocks.push({ type: "html", html: src });
  return blocks;
}

export function collectPlacedYoutubeIndices(html: string): Set<number> {
  const placed = new Set<number>();
  collectMarkers(html).forEach((mk) => placed.add(mk.index));
  return placed;
}
