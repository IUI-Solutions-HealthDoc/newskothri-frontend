function hostFromEnvUrl(raw: string | undefined): string | null {  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return u.hostname;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy(): string {
  const apiHost = hostFromEnvUrl(process.env.NEXT_PUBLIC_API_ORIGIN);
  const r2Host =
    hostFromEnvUrl(process.env.NEXT_PUBLIC_R2_PUBLIC_URL) ||
    hostFromEnvUrl(process.env.R2_PUBLIC_URL);

  const connectSrc = [
    "'self'",
    apiHost ? `https://${apiHost}` : null,
    apiHost ? `http://${apiHost}` : null,
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://accounts.google.com",
  ].filter(Boolean);

  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https://i.ytimg.com",
    "https://picsum.photos",
    "https://*.r2.dev",
    r2Host ? `https://${r2Host}` : null,
    apiHost ? `https://${apiHost}` : null,
    apiHost ? `http://${apiHost}` : null,
  ].filter(Boolean);

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ];
  if (process.env.NODE_ENV !== "production") {
    scriptSrc.push("'unsafe-eval'");
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    `img-src ${imgSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-src https://accounts.google.com",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ];

  return directives.join("; ");
}

export type SecurityHeader = { key: string; value: string };

export function getSecurityHeaders(): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  ];

  if (process.env.NODE_ENV === "production") {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
