import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConsiderIQ — AI Buyer Journey Intelligence",
  description:
    "Understand how AI-mediated buyer journeys change your brand's consideration set.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
