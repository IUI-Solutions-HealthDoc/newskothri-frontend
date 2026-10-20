"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { normalizePathname } from "../../lib/routerShim";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import SiteFooter from "../../components/SiteFooter";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { useLang } from "../../context/LangContext";

const DARK_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default function AppChrome({ children }: { children: React.ReactNode }) {
  // The layout's boot script sets <html data-theme> before paint; sync React state after mount.
  const [darkMode, setDarkMode] = useState(false);
  const { lang } = useLang();
  const pathname = normalizePathname(usePathname() || "/");
  const routeKind = useMemo(() => {
    if (pathname.startsWith("/article/")) return "article";
    return "default";
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the pre-paint theme
    setDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
  };

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
        applyTheme(next);
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
      data-lang={lang}
      data-route={routeKind}
    >
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      {children}
      <SiteFooter />
      <ScrollToTopButton />
      <BottomNav />
    </div>
  );
}
