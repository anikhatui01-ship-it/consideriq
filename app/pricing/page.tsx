import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Free Audit & Full Access",
  description:
    "Start with a free AI buyer journey audit. Upgrade to full access for $199/month backed by our 7-day money-back guarantee.",
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
              Transparent Pricing
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Start free. Upgrade for full journey intelligence.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Run a free brand audit to discover how AI buyers shortlist or eliminate your product. Subscribe for comprehensive multi-scenario simulations and deep decision trail inspection.
            </p>
          </div>
        </Container>
      </div>

      {/* PRICING TIERS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* FREE AUDIT TIER */}
            <div className="rounded-xl border border-border bg-surface p-7 sm:p-9 shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Free Audit</h2>
                  <Badge variant="secondary" className="text-[11px] font-mono">
                    Free Forever
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                    $0
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    / no credit card required
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ideal for discovering where your brand appears in initial AI-assisted buyer inquiries.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Free account creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Initial brand project audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Multi-turn buyer simulation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Observed vendor shortlist & elimination tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Inspectable Decision Trail overview</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border">
                <Button asChild size="lg" variant="outline" className="w-full text-base h-11">
                  <Link href="/signup">Start Free</Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  No credit card required. Get results immediately.
                </p>
              </div>
            </div>

            {/* FULL ACCESS TIER */}
            <div className="rounded-xl border-2 border-primary bg-surface p-7 sm:p-9 shadow-subtle flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6">
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-0.5 shadow-sm">
                  Recommended
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Full Access</h2>
                  <span className="text-xs font-mono text-primary font-semibold uppercase">
                    Continuous Monitoring
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                    $199
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    / month
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  For software marketing, product, and growth teams needing continuous consideration audits.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Everything in Free Audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Continuous multi-turn simulations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Comprehensive competitor consideration matrices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Full Evidence Drawer citations & source inspection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Detailed elimination cause diagnostics & action items</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border">
                <Button asChild size="lg" className="w-full text-base h-11">
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>7-day money-back guarantee — no questions asked.</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
