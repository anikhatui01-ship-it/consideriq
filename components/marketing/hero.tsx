"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { DecisionTrail, DecisionStep } from "@/components/marketing/decision-trail";
import { EvidenceDrawer } from "@/components/marketing/evidence-drawer";

export function Hero() {
  const [inspectStep, setInspectStep] = React.useState<DecisionStep | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleInspect = (step: DecisionStep) => {
    setInspectStep(step);
    setDrawerOpen(true);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60">
      {/* Background Subtle Research Grid Pattern */}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <Container size="wide">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Standardized Beta Badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 bg-surface shadow-subtle border-border">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Private Research Beta</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="text-muted-foreground">AI Buyer Journey Intelligence</span>
            </Badge>
          </div>

          {/* Primary Headline per Part 4 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08] text-balance">
            See where AI recommendations include — or eliminate — your brand.
          </h1>

          {/* Supporting Copy per Part 4 */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed text-balance font-normal">
            ConsiderIQ models multi-step buyer scenarios to show where a brand enters consideration, where it gets eliminated, and what information may influence the decision.
          </p>

          {/* Action CTAs per Part 4 */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2 px-6 h-12 text-base group">
              <Link href="/waitlist">
                <span>Request Beta Access</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-5 h-12 text-base">
              <a href="#decision-trail">
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                <span>View a Sample Decision Trail</span>
              </a>
            </Button>
          </div>

          {/* Trust Principles */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Evidence-first analysis
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Observed vs inferred separation
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              No fabricated ranking claims
            </span>
          </div>
        </div>

        {/* Hero Visual: Signature DecisionTrail with Interactive Inspection */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto" id="decision-trail">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Illustrative Decision Trail
            </span>
            <span className="text-xs text-muted-foreground">
              Select steps below to inspect decision points
            </span>
          </div>

          <DecisionTrail onInspectEvidence={handleInspect} />

          <EvidenceDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            step={inspectStep}
          />
        </div>
      </Container>
    </section>
  );
}
