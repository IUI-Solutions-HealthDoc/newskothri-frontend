"use client";

import type { ProfileNavigate, ProfileReaderListRow } from "../types/profile";

type TFn = (hi: string, en: string) => string;

export default function ProfileBookmarksPanel({
  bookmarks,
  navigate,
  t,
}: {
  bookmarks: ProfileReaderListRow[];
  navigate: ProfileNavigate;
  t: TFn;
}) {
  return (
    <div className="profile-card">
      <h3 className="profile-h3">
        {t("बुकमार्क", "Bookmarks")} ({bookmarks.length})
      </h3>
      {bookmarks.length === 0 ? (
        <div className="profile-empty">
          <p className="profile-sub">{t("अभी कोई बुकमार्क नहीं।", "No bookmarks yet.")}</p>
          <button type="button" className="profile-btn ghost" onClick={() => navigate("/")}>
            {t("नवीनतम खबरें देखें", "Browse latest news")}
          </button>
        </div>
      ) : (
        bookmarks.map((b) => (
          <button
            key={b._id}
            type="button"
            className="profile-row profile-row-dense"
            onClick={() => {
              const a = b.article;
              if (!a) return;
              const numStr =
                a.articleNumber != null && Number.isFinite(Number(a.articleNumber))
                  ? String(a.articleNumber)
                  : a._id;
              let segment = numStr;
              if (a.slug) {
                const normSlug = String(a.slug)
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "")
                  .replace(/-+/g, "-")
                  .replace(/^-+|-+$/g, "");
                if (normSlug) {
                  segment = `${normSlug}-${numStr}`;
                }
              }
              if (segment) navigate(`/article/${segment}`);
            }}
          >
            <span className="profile-row-title">
              {b.article?.titleHi || b.article?.title || t("शीर्षकहीन", "Untitled")}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
