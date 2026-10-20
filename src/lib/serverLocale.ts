export type ServerUiLang = "hi" | "en";

export const UI_LANGS: ServerUiLang[] = ["hi", "en"];

/** Cookie the proxy reads to pick the `[lang]` segment; the client writes it on language switch. */
export const UI_LANG_COOKIE = "kn-lang";

export function toServerUiLang(value: unknown): ServerUiLang {
  return value === "en" ? "en" : "hi";
}

/**
 * UI language from the internal `[lang]` route segment. `src/proxy.ts` rewrites every page
 * request to `/<lang>/…` from the `kn-lang` cookie, so pages stay static/ISR (no `cookies()` read).
 */
export async function getServerUiLang(params?: Promise<{ lang?: string }>): Promise<ServerUiLang> {
  if (!params) return "hi";
  const { lang } = await params;
  return toServerUiLang(lang);
}
