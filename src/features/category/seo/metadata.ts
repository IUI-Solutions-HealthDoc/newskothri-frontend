import type { Metadata } from "next";
import { categories } from "../../../data/publicCategories";
import { pickCopy, siteName, type UiLang } from "../../../i18n/siteCopy";
import { localizedSiteName } from "../../../lib/seo/metadataHelpers";

export function buildCategoryMetadata(slug: string, lang: UiLang): Metadata {
  const canonicalPath = `/category/${slug}`;
  const category = categories.find((c) => c.slug === slug);
  const label = lang === "hi" ? category?.name ?? slug : category?.nameEn ?? slug;
  const brand = localizedSiteName(lang);

  const title =
    slug === "latest"
      ? pickCopy(lang, `ताज़ा खबरें — ${brand}`, `Latest News — ${brand}`)
      : pickCopy(lang, `${label} — ${brand}`, `${label} News — ${brand}`);

  const description =
    slug === "latest"
      ? pickCopy(
          lang,
          `${brand} पर पिछले तीन दिनों में प्रकाशित खबरें।`,
          `Stories published in the last 3 days on ${brand}.`
        )
      : pickCopy(
          lang,
          `${label} की ताज़ा खबरें, विश्लेषण और अपडेट — ${brand}।`,
          `Latest ${label.toLowerCase()} coverage, breaking updates, explainers, and analysis on ${brand}.`
        );

  const keywords =
    lang === "hi"
      ? [label, `${label} खबर`, siteName("hi")]
      : [label, `${label} news`, siteName("en")];

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      siteName: brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords,
  };
}
