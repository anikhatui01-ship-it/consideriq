import * as React from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/marketing/cta-section";
import { DecisionTrail } from "@/components/marketing/decision-trail";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works — Simulation Methodology",
  description:
    "Learn how ConsiderIQ models multi-turn buyer journeys, evaluates decision shifts, isolates elimination points, and extracts verifiable evidence.",
  alternates: {
    canonical: getCanonicalUrl("/how-it-works"),
  },
};

export default function HowItWorksPage() {
  return (
    <PageShell>
      {/* Header Banner */}
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "How it works" }]} className="mb-4" />
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Research Methodology
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              How ConsiderIQ simulates and diagnoses AI buyer journeys.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real enterprise procurement is an iterative dialogue. Here is the step-by-step methodology behind our simulation engine, data integrity models, and decision trail analysis.
            </p>
          </div>
        </Container>
      </div>

      {/* 4 DETAILED METHODOLOGY STEPS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="space-y-16 sm:space-y-24 max-w-4xl mx-auto">
            {/* STEP 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Phase 01 · Input Context
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  Define the Buyer Persona
                </h2>
                <div className="rounded-lg bg-muted/60 p-4 border border-border text-xs text-muted-foreground space-y-2">
                  <span className="font-semibold text-foreground block">Why context matters:</span>
                  <p>
                    An AI model recommending software to a 5-person agency will give completely different answers than to a 200-person SOC 2-compliant fintech.
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  You begin by configuring a realistic buyer profile. Instead of relying on abstract search keywords, ConsiderIQ establishes the exact operational parameters of the purchasing organization:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Company Stage & Size:</strong> Headcount, annual revenue band, and engineering maturity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Technical Architecture:</strong> Cloud provider (AWS/GCP), identity provider (Okta/Entra ID), and communication tools.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Regulatory & Compliance Mandates:</strong> Specific gating rules such as SOC 2 Type II, FedRAMP, HIPAA, or strict data residency.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-border/80 pt-16">
              <div className="md:col-span-4 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Phase 02 · Scenario Modeling
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  Generate Scenario Variations
                </h2>
                <div className="rounded-lg bg-muted/60 p-4 border border-border text-xs text-muted-foreground space-y-2">
                  <span className="font-semibold text-foreground block">Multi-turn realism:</span>
                  <p>
                    Buyers rarely specify all their constraints up front. They reveal requirements sequentially over multiple conversational turns.
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  ConsiderIQ constructs 10 realistic multi-turn scenario variations for your persona. These scenario trees simulate natural procurement dialogues:
                </p>
                <div className="rounded-lg border border-border bg-surface-elevated p-4 space-y-2 font-mono text-xs">
                  <div className="text-muted-foreground">Turn 1: Broad category inquiry (&quot;What tools exist for...?&quot;)</div>
                  <div className="text-muted-foreground">Turn 2: Operational constraint (&quot;We use Slack and need native sync...&quot;)</div>
                  <div className="text-muted-foreground">Turn 3: Comparative pricing & onboarding speed inquiry</div>
                  <div className="text-muted-foreground">Turn 4: Governance constraint (&quot;Must support Okta SCIM v2...&quot;)</div>
                  <div className="text-foreground font-semibold">Turn 5: Final selection request (&quot;Which one should we pilot?&quot;)</div>
                </div>
                <p className="text-xs">
                  By testing varied prompt orderings and phrasing nuances, we isolate robust consideration signals from transient prompt artifacts.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-border/80 pt-16">
              <div className="md:col-span-4 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                  Phase 03 · Simulation Modeling
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  Multi-Turn Simulation Design
                </h2>
                <div className="rounded-lg bg-muted/60 p-4 border border-border text-xs text-muted-foreground space-y-2">
                  <span className="font-semibold text-foreground block">Planned provider execution:</span>
                  <p>
                    The simulation engine is architected to run structured multi-turn conversation trees across leading models (Google Gemini, OpenAI, Claude). During this Private Research Beta, we test and calibrate prompt sequences with cohort participants.
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Scenarios are structured to model iterative buyer prompts and test response consistency:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Verbatim Outputs:</strong> Designed to store unedited provider responses and extracted reference citations without modification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Turn-by-Turn Tracking:</strong> Evaluates retention and elimination at each specific requirement change.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Classification Standards:</strong> Explicitly categorizes findings into Observed text, Calculated rates, and Inferred hypotheses.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-border/80 pt-16" id="decision-trail">
              <div className="md:col-span-4 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Phase 04 · Diagnosis & Action
                </span>
                <h2 className="text-2xl font-bold text-foreground">
                  The Decision Trail™ & Elimination Diagnosis
                </h2>
                <div className="rounded-lg bg-muted/60 p-4 border border-border text-xs text-muted-foreground space-y-2">
                  <span className="font-semibold text-foreground block">Diagnostic focus:</span>
                  <p>
                    Instead of asking &quot;What is our ranking?&quot;, ConsiderIQ answers &quot;Where did we lose, and what caused it?&quot;
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  ConsiderIQ maps the results directly into our signature <strong>Decision Trail</strong> visualization. You can immediately see:
                </p>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg border border-border bg-surface-elevated">
                    <strong>1. The Initial Consideration Set:</strong> Which brands entered consideration when the category was first explored.
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-surface-elevated">
                    <strong>2. The Elimination Point:</strong> The exact turn where your brand dropped, highlighted with the specific triggering requirement.
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-surface-elevated">
                    <strong>3. Competitor Substitution:</strong> Which competitor survived and what evidence source the AI cited to validate them.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTERACTIVE TRAIL DEMONSTRATION */}
      <section className="py-16 md:py-24 border-b border-border bg-surface-elevated/30" id="evidence">
        <Container size="default">
          <SectionHeading
            badge="Interactive Demonstration"
            title="Inspect an illustrative simulation path"
            description="Explore the five-stage visual flow below to see how constraints impact candidate retention in a simulated run."
          />
          <div className="max-w-4xl mx-auto">
            <DecisionTrail />
          </div>
        </Container>
      </section>

      {/* CORE DATA INTEGRITY PRINCIPLE: OBSERVED VS CALCULATED VS INFERRED */}
      <section className="py-16 md:py-24 border-b border-border bg-surface" id="methodology">
        <Container size="default">
          <SectionHeading
            badge="Data Integrity"
            title="Observed vs. Calculated vs. Inferred"
            description="We strictly maintain separation between facts, measurements, and interpretations. We never pretend hidden AI reasoning is an observed fact."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-surface p-6 space-y-3 shadow-subtle">
              <Badge variant="observed">OBSERVED</Badge>
              <h3 className="text-lg font-semibold text-foreground">
                Verbatim Provider Output
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The exact, unedited text and source citation metadata returned by the AI model. Preserved with timestamp, model version, and cryptographic hash.
              </p>
              <div className="rounded bg-muted/40 p-2.5 font-mono text-[11px] text-muted-foreground">
                Example: &quot;Competitor A was recommended because it lists SOC 2 compliance on its trust page.&quot;
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-surface p-6 space-y-3 shadow-subtle">
              <Badge variant="calculated">CALCULATED</Badge>
              <h3 className="text-lg font-semibold text-foreground">
                Deterministic Measurement
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Objective, reproducible metrics computed by ConsiderIQ software from the collection of observed responses across repeated scenario iterations.
              </p>
              <div className="rounded bg-muted/40 p-2.5 font-mono text-[11px] text-muted-foreground">
                Example: Brand shortlisted in 6 of 10 runs (60% shortlist rate) across a 10-run sample.
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 dark:border-purple-900 bg-surface p-6 space-y-3 shadow-subtle">
              <Badge variant="inferred">INFERRED</Badge>
              <h3 className="text-lg font-semibold text-foreground">
                Analytical Interpretation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                A cautious hypothesis identifying likely contributing factors behind an elimination or vendor preference. Never stated as certainty.
              </p>
              <div className="rounded bg-muted/40 p-2.5 font-mono text-[11px] text-muted-foreground">
                Example: &quot;Published documentation on SCIM provisioning appears to be the deciding differentiator.&quot;
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </PageShell>
  );
}
