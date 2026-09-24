import * as React from "react";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  hideFooterCta?: boolean;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-accent/15 selection:text-foreground">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded-md bg-foreground px-4 py-2 text-sm text-background focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className={cn("flex-1", className)}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
