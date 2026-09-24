import * as React from "react";

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationJsonLd({
  name = "ConsiderIQ",
  url = "https://consideriq.com",
}: OrganizationJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description:
      "AI Buyer Journey Simulator & Brand Consideration Intelligence Platform.",
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
  name = "ConsiderIQ",
  description = "Simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from AI consideration sets.",
  url = "https://consideriq.com",
}: SoftwareAppJsonLdProps) {
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
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
