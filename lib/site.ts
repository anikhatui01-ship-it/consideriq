/**
 * Centralized site configuration for ConsiderIQ.
 * Provides environment-aware base URLs, canonical URL generators, and core site metadata.
 */

export function getSiteUrl(): string {
  // Support explicit site URL, Vercel preview URLs, and fallbacks
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://consideriq.com");

  return url.replace(/\/$/, "");
}

export function getCanonicalUrl(path: string = "/"): string {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return base;
  }
  return `${base}${normalizedPath}`;
}

export const SITE_CONFIG = {
  name: "ConsiderIQ",
  legalName: "ConsiderIQ",
  tagline: "AI Buyer Journey Intelligence",
  description:
    "ConsiderIQ models multi-step buyer scenarios to show where a brand enters consideration, where it gets eliminated, and what information may influence the decision.",
  primaryCta: "Request Beta Access",
  betaStatus: "Private Research Beta",
  contactEmail: "contact@consideriq.com",
};
