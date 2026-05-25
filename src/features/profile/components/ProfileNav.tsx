"use client";

import { useEffect, useRef } from "react";
import type { ProfileTabKey } from "../types/profile";

type TFn = (hi: string, en: string) => string;

export default function ProfileNav({
  tab,
  onTab,
  t,
}: {
  tab: ProfileTabKey;
  onTab: (k: ProfileTabKey) => void;
  t: TFn;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const wrap = wrapRef.current;
    if (!nav || !wrap) return;

    const syncScrollHint = () => {
      const scrollable = nav.scrollWidth > nav.clientWidth + 2;
      wrap.classList.toggle("is-scrollable", scrollable);
    };

    syncScrollHint();
    const ro = new ResizeObserver(syncScrollHint);
    ro.observe(nav);
    window.addEventListener("resize", syncScrollHint);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncScrollHint);
    };
  }, []);

  const keys: ProfileTabKey[] = ["settings", "saved", "liked", "privacy"];
  return (
    <div ref={wrapRef} className="profile-nav-wrap">
      <aside ref={navRef} className="profile-nav" aria-label={t("प्रोफ़ाइल मेनू", "Profile menu")}>
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onTab(key)}
            className={`profile-tab ${tab === key ? "active" : ""}`}
          >
            {key === "settings"
              ? t("सेटिंग्स", "Settings")
              : key === "saved"
                ? t("बुकमार्क", "Bookmarks")
                : key === "liked"
                  ? t("पसंद किए गए", "Liked")
                  : t("गोपनीयता", "Privacy")}
          </button>
        ))}
      </aside>
    </div>
  );
}
