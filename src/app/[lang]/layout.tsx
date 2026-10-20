import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import {
  getMetadataBase,
  localizedDefaultDescription,
  localizedSiteName,
} from "../../lib/seo/metadataHelpers";
import { UI_LANGS, toServerUiLang } from "../../lib/serverLocale";
import AppChrome from "./AppChrome";
import AppProviders from "./AppProviders";
import { mukta } from "../../lib/fonts";
import "./globals.css";

type LayoutParams = { params: Promise<{ lang: string }> };

/** Both languages are pre-rendered; `src/proxy.ts` picks one per request from the `kn-lang` cookie. */
export function generateStaticParams() {
  return UI_LANGS.map((lang) => ({ lang }));
}

/**
 * Applies the saved dark-mode choice before first paint (the HTML itself is static and shared).
 * Kept tiny and dependency-free on purpose.
 */
const THEME_BOOT_SCRIPT = `(function(){try{var d=document.cookie.indexOf("kn-dark=1")>-1||localStorage.getItem("kn-dark")==="1";var r=document.documentElement;r.setAttribute("data-theme",d?"dark":"light");r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const lang = toServerUiLang((await params).lang);
  const name = localizedSiteName(lang);
  const description = localizedDefaultDescription(lang);

  return {
    metadataBase: getMetadataBase(),
    applicationName: name,
    icons: {
      icon: [{ url: "/brand-logo.png", type: "image/png" }],
      apple: [{ url: "/brand-logo.png", type: "image/png" }],
    },
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      title: name,
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCFA" },
    { media: "(prefers-color-scheme: dark)", color: "#14110F" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  // Only `hi` / `en` exist (the proxy adds the segment); anything else is a 404.
  if (!UI_LANGS.includes(lang as (typeof UI_LANGS)[number])) notFound();
  const initialLang = toServerUiLang(lang);
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  return (
    <html
      lang={initialLang === "en" ? "en" : "hi"}
      className={mukta.variable}
      suppressHydrationWarning
      data-theme="light"
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9323779736575532"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body suppressHydrationWarning>
        <AppProviders initialLang={initialLang}>
          <AppChrome>{children}</AppChrome>
        </AppProviders>
      </body>
      {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
    </html>
  );
}
