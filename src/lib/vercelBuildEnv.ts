/** Fail Vercel production/preview builds when required public env is missing. */
export function assertVercelWebNextEnv(): void {
  if (process.env.VERCEL !== "1") return;
  const env = process.env.VERCEL_ENV;
  if (env !== "production" && env !== "preview") return;

  const api = (process.env.NEXT_PUBLIC_API_ORIGIN || "").trim();
  if (!api) {
    throw new Error(
      "[web-next] Missing NEXT_PUBLIC_API_ORIGIN on Vercel. Set it to your Railway API URL " +
        "(https://….up.railway.app, no trailing slash). Set INTERNAL_API_URL to the same value. Then redeploy."
    );
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (!site) {
    throw new Error(
      "[web-next] Missing NEXT_PUBLIC_SITE_URL on Vercel. Set it to this site's https URL (e.g. https://your-app.vercel.app)."
    );
  }
}
