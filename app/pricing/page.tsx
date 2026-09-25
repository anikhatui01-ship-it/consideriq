import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing & Beta Access",
  description:
    "ConsiderIQ is currently in Private Research Beta. Access is free for participating research partners while we validate our simulation workflow.",
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

      {/* PRICING TIERS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* CURRENT BETA TIER */}
            <div className="rounded-xl border-2 border-primary bg-surface p-7 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-6">
                <Badge variant="accent" className="text-xs px-2.5 py-0.5">
                  Current Availability
                </Badge>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Private Research Beta
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Rolling Cohorts
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-foreground tracking-tight">
                    $0
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / during research validation period
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full participation in core simulation workflows and diagnostic analysis for teams in our early research cohorts.
                </p>

                <div className="pt-4 border-t border-border space-y-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Included in Beta:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>1 Brand project profile with public domain evaluation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Custom Buyer Persona & ICP configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Multi-turn scenario simulation batches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Interactive Decision Trail visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Evidence Drawer with verbatim transcript inspectability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Direct feedback channel with the research team</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button asChild size="lg" className="w-full gap-2 text-base h-11">
                  <Link href="/waitlist">
                    <span>Request Beta Access</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  No credit card required. Free during research preview.
                </p>
              </div>
            </div>

            {/* PLANNED FUTURE PRO TIER */}
            <div className="rounded-xl border border-border bg-surface-elevated/40 p-7 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Future Commercial Plans
                  </h2>
                  <Badge variant="outline" className="text-xs font-mono">
                    Post-Beta
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    To be announced
                  </span>
                  <span className="text-xs text-muted-foreground">
                    after the research beta
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Commercial plans will be announced after the research beta. Continuous monitoring and multi-provider simulation tooling will be offered to growth teams.
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
                      <span>Comparative evaluations across multiple AI providers</span>
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
                    Request Beta Access
                  </Link>
                </Button>
                <p className="text-center text-[11px] text-muted-foreground mt-2">
                  Research beta participants will receive priority access to future plans.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing FAQ & Policy */}
          <div className="mt-16 max-w-3xl mx-auto rounded-lg border border-border bg-surface p-6 space-y-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <Info className="h-4 w-4 text-primary" />
              Frequently Asked Pricing Questions
            </div>
            <div className="space-y-3">
              <div>
                <strong className="text-foreground block">Why is ConsiderIQ free during the beta?</strong>
                Our primary goal during the Private Research Beta is workflow validation and direct participant feedback. We work closely with early users to calibrate buyer persona parameters and ensure decision trail insights provide clear diagnostic value.
              </div>
              <div>
                <strong className="text-foreground block">Will I be charged unexpectedly?</strong>
                Never. We do not collect credit cards or payment credentials during the research beta. When commercial plans are announced in the future, participation will be strictly opt-in.
              </div>
              <div>
                <strong className="text-foreground block">Who pays for the underlying AI provider API tokens?</strong>
                During the private research beta, ConsiderIQ covers the underlying API provider costs for approved research cohort evaluations.
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
