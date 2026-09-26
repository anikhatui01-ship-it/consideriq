import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  GitFork,
  Cpu,
  Layers,
  FileSearch,
  Users2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/marketing/cta-section";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features — AI Buyer Journey Intelligence",
  description:
    "Explore ConsiderIQ's simulation engine, persona builder, multi-turn decision trail, and evidence drawer for B2B brand consideration analysis.",
  alternates: {
    canonical: getCanonicalUrl("/features"),
  },
};

const FEATURES = [
  {
    icon: Users,
    badge: "Buyer Modeling",
    title: "Buyer Persona & ICP Configuration",
    description:
      "Simulations are meaningless without defined buyer context. Configure realistic buyer personas reflecting your exact target customer profiles—industry, team size, technical expertise, budget authority, and existing architectural stack.",
    capabilities: [
      "Define job title, buying role, and evaluation maturity",
      "Specify existing technical dependencies (e.g. AWS, Okta, Datadog)",
      "Set mandatory compliance requirements (SOC 2, HIPAA, GDPR)",
      "Test both enterprise and startup procurement patterns",
    ],
  },
  {
    icon: GitFork,
    badge: "Scenario Synthesis",
    title: "Multi-Turn Scenario Generation",
    description:
      "Buyers do not make purchase decisions in a single vacuum prompt. ConsiderIQ generates realistic dialogue sequences where requirements unfold naturally across 4 to 6 conversational turns.",
    capabilities: [
      "Natural conversational phrasing with realistic buyer constraints",
      "Progressive addition of security, budget, and integration filters",
      "Counterfactual scenario branches to test what-if assumptions",
      "Deterministic test repeatability across model updates",
    ],
  },
  {
    icon: Cpu,
    badge: "Simulation Architecture",
    title: "Multi-Provider Simulation Design",
    description:
      "Designed around research architectures for leading models (Google Gemini, OpenAI GPT-4o, Anthropic Claude). Illustrative scenarios demonstrate structured evidence logging rather than black-box approximations.",
    capabilities: [
      "Inspectable provider transcript formatting without UI truncation",
      "Multi-model design to examine response variations",
      "Detection of grounded source citations vs. unsupported outputs",
      "Zero fabricated data or synthetic replacement of results",
    ],
  },
  {
    icon: Layers,
    badge: "Signature Visual Pattern",
    title: "The Decision Trail™",
    description:
      "Our core visual interface pattern tracks your brand through the entire evaluation funnel: Question → Constraints → Shortlist → Elimination → Recommendation.",
    capabilities: [
      "Immediate visual identification of the exact turn where your brand dropped",
      "Trace candidate survivor counts at each progression gate",
      "Inspect the specific buyer constraint that triggered elimination",
      "Compare survival rates across repeated scenario runs",
    ],
  },
  {
    icon: FileSearch,
    badge: "Evidence & Grounding",
    title: "Evidence & Citation Drawer",
    description:
      "Connect every observation back to the underlying sources cited by the AI model. Distinguish between what was observed in the raw text, what was measured by the software, and what is an inferred hypothesis.",
    capabilities: [
      "Inspect full raw response transcripts without UI truncation",
      "Identify public URLs, aggregators, and docs referenced by the model",
      "Strict separation of Observed, Calculated, and Inferred data",
      "Actionable recommendations for documentation improvements",
    ],
  },
  {
    icon: Users2,
    badge: "Competitive Intelligence",
    title: "Competitor Substitution Tracking",
    description:
      "When a buyer eliminates your brand, who takes your place? ConsiderIQ tracks competitor movements across every turn to reveal which alternatives are favored under specific constraints.",
    capabilities: [
      "Direct head-to-head survival matrices against key rivals",
      "Identify competitors who dominate specific security or pricing constraints",
      "Uncover emerging challengers entering AI consideration sets early",
      "Measure recommendation share across varied persona types",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Features" }]} className="mb-4" />
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Product Capabilities
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Tools built to understand AI-mediated buyer decisions.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              ConsiderIQ gives product, growth, and marketing teams the empirical instrumentation needed to observe, measure, and analyze how AI systems evaluate their brand.
            </p>
          </div>
        </Container>
      </div>

      {/* FEATURE GRID */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-surface p-7 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6 hover:border-border/80 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-muted p-3 text-foreground inline-flex">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {feature.badge}
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold text-foreground tracking-tight">
                      {feature.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/70 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Key Capabilities
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {feature.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* METHODOLOGY REMINDER */}
      <section className="py-16 bg-surface-elevated/40 border-b border-border">
        <Container size="default">
          <div className="max-w-3xl mx-auto rounded-xl border border-border bg-surface p-6 sm:p-8 space-y-4 text-left shadow-subtle">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Our Integrity Commitment
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every feature in ConsiderIQ is designed around our core engineering constitution: we never synthesize fake AI provider calls, we never hide model variability behind arbitrary single scores, and we provide complete audit trails for every simulated conversation turn.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link href="/how-it-works">
                  <span>Learn how our simulation engine works</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </PageShell>
  );
}
