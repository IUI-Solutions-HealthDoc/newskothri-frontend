import { NextResponse, type NextRequest } from "next/server";

const LANG_COOKIE = "kn-lang";
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Pages live under an internal `app/[lang]` segment so each language is pre-rendered and
 * cached (ISR) instead of rendering on every request from a `cookies()` read.
 * Public URLs stay the same: `/article/x` is served from `/hi/article/x` or `/en/article/x`
 * depending on the reader's `kn-lang` cookie (Hindi by default).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // `/en/...` or `/hi/...` typed or shared directly: remember the language and drop the prefix.
  const prefixed = pathname.match(/^\/(hi|en)(\/.*)?$/);
  if (prefixed) {
    const url = request.nextUrl.clone();
    url.pathname = prefixed[2] || "/";
    url.search = search;
    const res = NextResponse.redirect(url);
    res.cookies.set(LANG_COOKIE, prefixed[1], {
      path: "/",
      maxAge: LANG_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  }

  const lang = request.cookies.get(LANG_COOKIE)?.value === "en" ? "en" : "hi";
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals, uploads and files with an extension
    // (favicon.ico, icon.png, robots.txt, sitemap.xml, images, fonts…).
    "/((?!api/|_next/|uploads/|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
