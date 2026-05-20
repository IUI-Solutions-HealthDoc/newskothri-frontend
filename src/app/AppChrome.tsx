"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { normalizePathname } from "../lib/routerShim";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import SiteFooter from "../components/SiteFooter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import LazyImagesInit from "../components/LazyImagesInit";
import { useLang } from "../context/LangContext";

const DARK_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default function AppChrome({
  children,
  initialDark = false,
}: {
  children: React.ReactNode;
  initialDark?: boolean;
}) {
  const [darkMode, setDarkMode] = useState(initialDark);
  const { lang } = useLang();
  const pathname = normalizePathname(usePathname() || "/");
  const routeKind = useMemo(() => {
    if (pathname.startsWith("/article/")) return "article";
    return "default";
  }, [pathname]);

  useEffect(() => {
    setDarkMode(initialDark);
  }, [initialDark]);

  useEffect(() => {
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  /** Unlock scroll after menu/share modals; reset position on route change (mobile). */
  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.removeProperty("overflow");
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleDark = () => {
    setDarkMode((d) => {
      const next = !d;
      if (typeof document !== "undefined") {
        document.cookie = `kn-dark=${next ? "1" : "0"};path=/;max-age=${DARK_COOKIE_MAX_AGE};SameSite=Lax`;
      }
      try {
        localStorage.setItem("kn-dark", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div
      className="app-wrap"
      data-theme={darkMode ? "dark" : "light"}
      data-lang={lang}
      data-route={routeKind}
    >
      <LazyImagesInit />
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      {children}
      <SiteFooter />
      <ScrollToTopButton />
      <BottomNav />
    </div>
  );
}
