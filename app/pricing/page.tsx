import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing & Beta Access",
  description:
    "Transparent pricing and beta access terms. During our preview phase, ConsiderIQ is free and invite-only for participating research partners.",
  alternates: {
    canonical: "https://consideriq.com/pricing",
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
              Transparent Access Model
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Free during the private beta preview.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We are currently in private beta (v0.2). Access is invite-only while we refine simulation repeatability and multi-provider models with select software founders and marketers.
            </p>
          </div>
        </Container>
      </div>

      {/* PRICING TIERS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* CURRENT BETA TIER */}
            <div className="rounded-xl border-2 border-accent bg-surface p-7 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-6">
                <Badge variant="accent" className="text-xs px-2.5 py-0.5">
                  Current Availability
                </Badge>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Research Beta
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Invite-Only
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">
                    $0
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / during preview period
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full access to core simulation workflows for software founders and growth teams participating in our initial research cohorts.
                </p>

                <div className="pt-4 border-t border-border space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Included in Beta:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>1 Brand project profile with public website indexing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Custom Buyer Persona & ICP configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>10-Scenario multi-turn simulation batches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Interactive Decision Trail™ visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Evidence Drawer with raw response inspectability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Direct feedback channel with founding engineers</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button asChild size="lg" className="w-full gap-2 text-base h-11">
                  <Link href="/waitlist">
                    <span>Request Beta Invitation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  No credit card required. Rolling admissions.
                </p>
              </div>
            </div>

            {/* PLANNED FUTURE PRO TIER */}
            <div className="rounded-xl border border-border bg-surface-elevated/40 p-7 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    ConsiderIQ Pro
                  </h2>
                  <Badge variant="outline" className="text-xs font-mono">
                    Planned v1.0
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    Post-Beta Pricing
                  </span>
                  <span className="text-xs text-muted-foreground">
                    announced prior to general availability
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Continuous AI buyer journey intelligence designed for growth teams managing recurring competitive brand research.
                </p>

                <div className="pt-4 border-t border-border space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Planned Capabilities:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>Multiple concurrent brand and competitor profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>Simulations across 3+ simultaneous AI providers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>Weekly automated consideration tracking sweeps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>Counterfactual scenario generator (&quot;what-if&quot; testing)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>Exportable audit reports and raw JSON logs</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button asChild variant="outline" size="lg" className="w-full text-base h-11">
                  <Link href="/waitlist">
                    Join Waiting List for Pro
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  Beta members will receive grandfathered transition terms.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing FAQ & Policy */}
          <div className="mt-16 max-w-3xl mx-auto rounded-lg border border-border bg-surface p-6 space-y-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <Info className="h-4 w-4 text-accent" />
              Frequently Asked Pricing Questions
            </div>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground block">Why is ConsiderIQ free during the beta?</strong>
                Our primary goal during beta v0.2 is scientific validation and customer feedback. We want to work closely with early users to refine buyer scenario prompts and ensure simulation findings deliver direct diagnostic value.
              </div>
              <div>
                <strong className="text-foreground block">Will I be charged unexpectedly?</strong>
                Never. We do not collect payment credentials during the beta phase. If and when commercial plans are introduced, you will have ample advance notice and the option to opt in.
              </div>
              <div>
                <strong className="text-foreground block">Who pays for the underlying AI provider API tokens?</strong>
                During the private beta preview, ConsiderIQ covers the underlying API provider costs for approved research runs within standard usage limits.
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
