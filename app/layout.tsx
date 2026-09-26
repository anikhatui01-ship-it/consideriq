import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteUrl, SITE_CONFIG } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ConsiderIQ — AI Buyer Journey Intelligence",
    template: "%s | ConsiderIQ",
  },
  description:
    "See where AI recommendations include — or eliminate — your brand. ConsiderIQ models multi-step buyer scenarios to diagnose brand consideration in AI search.",
  keywords: [
    "AI buyer journey",
    "AI brand visibility",
    "LLM consideration set",
    "AI search evaluation",
    "buyer journey simulation",
    "B2B AI evaluation",
    "brand consideration in AI search",
  ],
  authors: [{ name: "ConsiderIQ Research Team" }],
  creator: "ConsiderIQ",
  publisher: "ConsiderIQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: "ConsiderIQ",
    title: "ConsiderIQ — AI Buyer Journey Intelligence",
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ConsiderIQ — AI Buyer Journey Intelligence",
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

import { ThemeProvider } from "@/components/shared/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent/15 selection:text-foreground">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
