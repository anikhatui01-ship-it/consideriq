import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://consideriq.com"),
  title: {
    default: "ConsiderIQ — AI Buyer Journey Intelligence",
    template: "%s | ConsiderIQ",
  },
  description:
    "See how AI buyers evaluate your brand. Simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from consideration.",
  keywords: [
    "AI buyer journey",
    "AI brand visibility",
    "LLM consideration set",
    "AI search evaluation",
    "buyer journey simulation",
    "B2B AI evaluation",
  ],
  authors: [{ name: "ConsiderIQ Team" }],
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
    url: "https://consideriq.com",
    siteName: "ConsiderIQ",
    title: "ConsiderIQ — AI Buyer Journey Intelligence",
    description:
      "Simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from the consideration set.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConsiderIQ — AI Buyer Journey Intelligence",
    description:
      "Simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from the consideration set.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent/15 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
