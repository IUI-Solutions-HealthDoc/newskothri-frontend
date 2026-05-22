import { getPublicApiOrigin } from "../config/publicApi";

/** User-facing hint when the browser cannot reach the API (network / CORS). */
export function publicSiteApiNetworkError(): string {
  const origin = getPublicApiOrigin();

  if (typeof window !== "undefined") {
    if (!origin) {
      return (
        "Cannot reach the news API. On Vercel (web-next project) set NEXT_PUBLIC_API_ORIGIN to your Railway URL " +
        "(https://….up.railway.app, no trailing slash), set INTERNAL_API_URL to the same value, then Redeploy."
      );
    }
    return (
      `Cannot reach the API at ${origin}. Check: (1) Open ${origin}/api/health — should return JSON; ` +
      "(2) Railway → CLIENT_URLS includes this site's exact https origin; " +
      "(3) Redeploy web-next after changing NEXT_PUBLIC_API_ORIGIN."
    );
  }

  return "Cannot reach the news API.";
}
