import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing & Beta Access",
  description:
    "ConsiderIQ is currently in Private Research Beta. Access is free during our research validation period.",
  alternates: {
    canonical: getCanonicalUrl("/pricing"),
  },
};

export default function PricingPage() {
  return (
    <PageShell>
      {/* Header Banner */}
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Pricing" }]} className="mb-4" />
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Private Research Beta
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Early access while we validate the research workflow.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              ConsiderIQ is free during our private research beta. We are onboarding software founders, marketers, and SEO/GEO practitioners in rolling cohorts to test buyer journey simulation repeatability.
            </p>
          </div>
        </Container>
      </div>

      {/* PRICING TIER */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="max-w-lg mx-auto">
            {/* CURRENT BETA TIER */}
            <div className="rounded-xl border-2 border-primary bg-surface p-7 sm:p-9 shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Private Research Beta
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Rolling Cohorts
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                    $0
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    / during the research validation period
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Participants get full access to the current research experience to inspect their brand&apos;s AI consideration set and help shape the product.
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <Button asChild size="lg" className="w-full text-base h-11">
                  <Link href="/waitlist">
                    Request Beta Access →
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  No credit card required. Free during research validation.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
