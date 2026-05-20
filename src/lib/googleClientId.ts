/** Google OAuth Web client ID — must match backend GOOGLE_CLIENT_ID and Cloud Console origins. */
export function getGoogleWebClientId(): string {
  const raw = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();
  if (!raw || raw === "undefined" || raw === "null") return "";
  if (!raw.includes(".apps.googleusercontent.com")) return "";
  return raw;
}

export function isGoogleSignInConfigured(): boolean {
  return Boolean(getGoogleWebClientId());
}
