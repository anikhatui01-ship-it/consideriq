import * as React from "react";
import { getSiteUrl, SITE_CONFIG } from "@/lib/site";

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationJsonLd({
  name = SITE_CONFIG.name,
  url,
}: OrganizationJsonLdProps) {
  const siteUrl = url || getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: siteUrl,
    description: SITE_CONFIG.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface SoftwareAppJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
}

export function SoftwareAppJsonLd({
  name = SITE_CONFIG.name,
  description = SITE_CONFIG.description,
  url,
}: SoftwareAppJsonLdProps) {
  const siteUrl = url || getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
    },
    description,
    url: siteUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
