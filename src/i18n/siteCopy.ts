export type UiLang = "hi" | "en";

export function pickCopy(lang: UiLang, hi: string, en: string): string {
  return lang === "hi" ? hi : en;
}

export function siteName(lang: UiLang): string {
  return pickCopy(lang, "खबर कोठरी", "Kothari News");
}

export function siteBrandLegal(lang: UiLang): string {
  return pickCopy(lang, "खबर कोठरी", "Khabar Kothri");
}

export function siteDefaultDescription(lang: UiLang): string {
  return pickCopy(
    lang,
    "खबर कोठरी — देश, विदेश, राजनीति, खेल, स्वास्थ्य, कृषि, व्यापार और मनोरंजन की तेज़, सत्यापित खबरें।",
    "Khabar Kothari brings fast, verified coverage across desh, videsh, rajneeti, khel, health, krishi, business and manoranjan."
  );
}

/** Share / social platform labels (brand names transliterated in Hindi where helpful). */
export function shareLabels(t: (hi: string, en: string) => string) {
  return {
    whatsapp: t("व्हाट्सऐप", "WhatsApp"),
    telegram: t("टेलीग्राम", "Telegram"),
    facebook: t("फेसबुक", "Facebook"),
    twitter: t("एक्स (ट्विटर)", "X (Twitter)"),
    linkedin: t("लिंक्डइन", "LinkedIn"),
    email: t("ईमेल", "Email"),
    copyLink: t("लिंक कॉपी करें", "Copy link"),
    copied: t("कॉपी हो गया!", "Copied!"),
    moreApps: t("और ऐप्स…", "More apps…"),
    shareStory: t("इस खबर को शेयर करें", "Share this story"),
    closeShare: t("शेयर मेनू बंद करें", "Close share menu"),
    like: t("पसंद", "Like"),
    liked: t("पसंद किया", "Liked"),
    save: t("सहेजें", "Save"),
    saved: t("सहेजा गया", "Saved"),
    share: t("शेयर", "Share"),
    breaking: t("ब्रेकिंग", "Breaking"),
    bookmark: t("बुकमार्क", "Bookmark"),
    untitled: t("शीर्षकहीन", "Untitled"),
    preferencesSaved: t("सेटिंग्स सहेजी गईं", "Preferences saved"),
    languageHindi: t("हिंदी", "Hindi"),
    languageEnglish: t("अंग्रेज़ी", "English"),
  };
}
