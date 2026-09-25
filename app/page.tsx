import * as React from "react";
import type { Metadata } from "next";
import {
  CheckCircle2,
  XCircle,
  Layers,
  Search,
  SlidersHorizontal,
  Bot,
  BarChart3,
  FileCheck2,
  ShieldCheck,
  Eye,
  GitCompare,
  TrendingDown,
  Compass,
  Stethoscope,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Hero } from "@/components/marketing/hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { FeatureBlock } from "@/components/marketing/feature-block";
import { FaqSection } from "@/components/marketing/faq";
import { CtaSection } from "@/components/marketing/cta-section";
import { Badge } from "@/components/ui/badge";
import { SoftwareAppJsonLd, OrganizationJsonLd } from "@/lib/seo/jsonld";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "ConsiderIQ — AI Buyer Journey Intelligence",
  description:
    "See where AI recommendations include — or eliminate — your brand. ConsiderIQ models multi-step buyer scenarios to diagnose brand consideration in AI search.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
};

export default function HomePage() {
  return (
    <PageShell>
      <OrganizationJsonLd />
      <SoftwareAppJsonLd />

      {/* 1: HERO SECTION WITH SIGNATURE DECISION TRAIL */}
      <Hero />

      {/* 2: CORE NARRATIVE: DISCOVER, DIAGNOSE, EXPLAIN, IMPROVE (PART 5) */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <SectionHeading
            badge="Intelligence Framework"
            title="The intelligence loop behind AI buying decisions"
            description="Traditional SEO counts isolated keyword mentions. ConsiderIQ investigates how iterative buyer conversations shape recommendations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="rounded-xl border border-border bg-surface p-6 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-2.5 w-fit text-primary">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">
                  01 · Discover
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Where does your brand appear?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identify if your brand enters initial consideration when buyers express general category needs without mentioning specific vendors.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2.5 w-fit text-amber-600 dark:text-amber-400">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  02 · Diagnose
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Where do you get eliminated?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pinpoint the exact conversational turn where your brand disappears as the buyer introduces compliance, budget, or architectural filters.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2.5 w-fit text-emerald-600 dark:text-emerald-400">
                  <HelpCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  03 · Explain
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  What drove the decision?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trace the AI provider&apos;s output to observed source references to understand which specifications or gaps influenced the model&apos;s response.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-2.5 w-fit text-foreground">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  04 · Improve
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  What should your team investigate?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Turn diagnostic evidence into clear documentation, positioning, and content priorities before competitors capture prospective buyers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3: THE PROBLEM: MENTION COUNTING VS BUYER JOURNEYS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <SectionHeading
            badge="The Problem"
            title="Single-prompt mention counting misses the actual decision."
            description="Standard AI tracking tools count whether your name appears in a single prompt. Real B2B buyers don't buy after one question—they test constraints, compare alternatives, and eliminate options."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* The Old Way */}
            <div className="rounded-xl border border-rose-200/80 bg-rose-50/30 dark:bg-rose-950/10 dark:border-rose-900/60 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 text-[11px] font-mono">
                  Traditional Keyword Tracker
                </Badge>
                <XCircle className="h-5 w-5 text-rose-500" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Single-turn keyword frequency
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Queries like &quot;best CRM&quot; produce a static list. They ignore buyer context, company size, compliance requirements, and budget limits.
              </p>

              <div className="space-y-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/40 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Treats a passing footnote mention the same as a top recommendation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Cannot tell you why a buyer eliminated your brand at Turn 3.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">&times;</span>
                  <span>Produces a vanity &quot;visibility score&quot; with no actionable diagnostics.</span>
                </div>
              </div>
            </div>

            {/* The ConsiderIQ Way */}
            <div className="rounded-xl border border-border bg-surface p-6 sm:p-7 space-y-4 shadow-subtle ring-1 ring-border">
              <div className="flex items-center justify-between">
                <Badge variant="accent" className="text-[11px] font-mono">
                  ConsiderIQ Approach
                </Badge>
                <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Multi-turn decision simulation
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Simulates progressive procurement conversations: discovery, constraints, shortlist, elimination, and final vendor recommendation.
              </p>

              <div className="space-y-2 pt-2 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pinpoints the specific requirement that triggered elimination.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Reveals which competitor stepped in when you disappeared.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Preserves raw provider outputs so every insight is inspectable.</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4: THE FIVE PHASES OF AN AI BUYING DECISION */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <SectionHeading
            badge="Architecture"
            title="The five stages of an AI buying decision"
            description="AI recommendation models behave like consultative advisors. ConsiderIQ structures analysis across the five canonical phases of an AI evaluation."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                stage: "Question",
                desc: "Buyer expresses a high-level category need and initiates initial discovery.",
                icon: Search,
              },
              {
                step: "02",
                stage: "Constraints",
                desc: "Buyer introduces compliance, budget, workflow, or integration prerequisites.",
                icon: SlidersHorizontal,
              },
              {
                step: "03",
                stage: "Shortlist",
                desc: "Model filters out unviable tools and synthesizes top candidates side-by-side.",
                icon: Layers,
              },
              {
                step: "04",
                stage: "Elimination",
                desc: "Specific missing capabilities cause your brand or competitor to drop from consideration.",
                icon: TrendingDown,
              },
              {
                step: "05",
                stage: "Recommendation",
                desc: "The AI delivers its final chosen vendor recommendation and rationale.",
                icon: Bot,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-surface p-5 space-y-3 shadow-subtle flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground font-semibold">
                        {item.step}
                      </span>
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-base font-semibold text-foreground tracking-tight">
                      {item.stage}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5: HOW IT WORKS: WORKFLOW OVERVIEW (TRUTHFUL STATUS) */}
      <section className="py-16 md:py-24 border-b border-border bg-surface-elevated/20" id="how-it-works">
        <Container size="default">
          <SectionHeading
            badge="Methodology"
            title="How ConsiderIQ models buyer journeys"
            description="Four systematic phases to model how AI recommendation systems perceive and evaluate software."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureBlock
              icon={SlidersHorizontal}
              badge="Step 1"
              title="Define the Buyer"
              description="Configure realistic buyer personas reflecting your real ideal customer profile—company size, tech stack, and non-negotiable requirements."
              details={[
                "Specify technical roles & buying authority",
                "Input existing architectural dependencies",
                "Define explicit evaluation constraints",
              ]}
            />

            <FeatureBlock
              icon={Layers}
              badge="Step 2"
              title="Generate Scenarios"
              description="ConsiderIQ derives realistic procurement dialogue variations rather than testing one static query."
              details={[
                "Multi-turn procurement dialogue trees",
                "Edge-case constraint testing",
                "Varied buyer phrasing & priorities",
              ]}
            />

            <FeatureBlock
              icon={Bot}
              badge="Step 3"
              title="Multi-Turn Simulation"
              description="Simulate multi-turn conversations designed around leading models (Google Gemini, OpenAI, Claude) with full token transcript logging."
              details={[
                "Structured multi-turn query trees",
                "Strict evidence classification standards",
                "Analysis of model response variation",
              ]}
            />

            <FeatureBlock
              icon={BarChart3}
              badge="Step 4"
              title="Inspect Decision Shifts"
              description="Pinpoint the exact turn where your brand dropped, which competitor survived, and what source citations drove the choice."
              details={[
                "Visual Decision Trail progression",
                "Clear elimination moment diagnosis",
                "Evidence Drawer source inspection",
              ]}
            />
          </div>
        </Container>
      </section>

      {/* 6: ILLUSTRATIVE INTERFACE PREVIEW (CLEARLY LABELED EXAMPLE) */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="wide">
          <div className="max-w-4xl mx-auto space-y-6">
            <SectionHeading
              badge="Interface Preview"
              title="Built for analytical rigor, not vanity scores"
              description="A calm, evidence-oriented research environment. Inspect simulation transcripts, run-to-run variations, and competitor substitutions."
            />

            {/* Static Interface Preview Shell */}
            <div className="rounded-xl border border-border bg-surface shadow-subtle overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  <span className="text-muted-foreground ml-2">consideriq.internal / research / example-scenario</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-surface">
                  Illustrative Research Preview
                </Badge>
              </div>

              {/* Interface Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Findings Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                      Illustrative Finding · Example Scenario Analysis
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      Your brand was shortlisted in 6 of 10 sample iterations.
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Elimination most frequently occurred when enterprise SOC 2 and SCIM constraints were introduced.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <Badge variant="success" className="text-xs px-2.5 py-1">
                      Discovery: 8/10
                    </Badge>
                    <Badge variant="warning" className="text-xs px-2.5 py-1">
                      Final Choice: 2/10
                    </Badge>
                  </div>
                </div>

                {/* Comparative Performance Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Funnel Survival Rate</span>
                    <span>10 Iterations in Example Scenario</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border p-4 bg-surface-elevated space-y-1">
                      <span className="text-xs text-muted-foreground">Unbranded Discovery</span>
                      <div className="text-2xl font-semibold text-foreground">80%</div>
                      <p className="text-[11px] text-muted-foreground">Appeared in 8 of 10 initial prompt runs</p>
                    </div>

                    <div className="rounded-lg border border-border p-4 bg-surface-elevated space-y-1">
                      <span className="text-xs text-muted-foreground">Constraint Shortlist</span>
                      <div className="text-2xl font-semibold text-foreground">60%</div>
                      <p className="text-[11px] text-muted-foreground">Surviving budget & workflow requirements</p>
                    </div>

                    <div className="rounded-lg border border-border p-4 bg-surface-elevated space-y-1">
                      <span className="text-xs text-muted-foreground">Final Recommendation</span>
                      <div className="text-2xl font-semibold text-foreground">20%</div>
                      <p className="text-[11px] text-muted-foreground">Competitor A chosen in 6 of 10 runs</p>
                    </div>
                  </div>
                </div>

                {/* Key Investigation Highlight */}
                <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Key Investigation Opportunity
                    </span>
                    <Badge variant="inferred">Inferred Hypothesis</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    In 4 out of 4 elimination turns, the model cited lack of visible documentation for directory sync (SCIM). Competitors with indexed Okta/Azure AD integration guides survived into the final recommendation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7: METHODOLOGY & EVIDENCE CONCEPTS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface-elevated/20" id="methodology">
        <Container size="default">
          <SectionHeading
            badge="Methodology"
            title="Evidence over marketing hype"
            description="ConsiderIQ is built on research discipline. Here is how our measurement standards differ from generic SEO tools."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-xl border border-border p-6 space-y-3 bg-surface shadow-subtle">
              <div className="rounded-lg bg-muted p-2 w-fit text-foreground">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Raw Responses Remain Inspectable
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We never ask you to trust a summary number blindly. Findings trace directly to the unedited provider response tokens with time stamps.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 space-y-3 bg-surface shadow-subtle">
              <div className="rounded-lg bg-muted p-2 w-fit text-foreground">
                <GitCompare className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Observed vs. Calculated vs. Inferred
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We strictly demarcate what the AI model actually returned (Observed), what was measured across runs (Calculated), and cautious hypotheses (Inferred).
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 space-y-3 bg-surface shadow-subtle">
              <div className="rounded-lg bg-muted p-2 w-fit text-foreground">
                <Eye className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Visible Model Variability
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                LLMs are probabilistic. Rather than hiding variations behind a false single score, we make run-to-run divergence clear across repeated trials.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 8: FAQ SECTION */}
      <FaqSection />

      {/* 9: FINAL CTA */}
      <CtaSection />
    </PageShell>
  );
}
