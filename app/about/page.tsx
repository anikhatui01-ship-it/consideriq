import * as React from "react";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "About ConsiderIQ — Research Principles & Origin",
  description:
    "Why we built ConsiderIQ: An analytical research instrument designed to measure, verify, and understand AI-mediated buying decisions.",
  alternates: {
    canonical: "https://consideriq.com/about",
  },
};

const PRINCIPLES = [
  {
    num: "01",
    title: "Evidence over one-number scores",
    desc: "A single 'AI visibility score' tells you nothing about why you were eliminated. We prioritize actionable diagnostic evidence over vanity numbers.",
  },
  {
    num: "02",
    title: "Raw AI responses remain inspectable",
    desc: "Every conclusion traces directly to the unedited provider response tokens. We never ask users to take a summary on blind faith.",
  },
  {
    num: "03",
    title: "Observed, calculated, and inferred must be separated",
    desc: "We strictly distinguish between what an AI model said, what our software computed, and what is an analytical hypothesis.",
  },
  {
    num: "04",
    title: "Never fabricate output or citations",
    desc: "If a provider fails or citation metadata is unavailable, we state it truthfully. We never silently substitute mock data.",
  },
  {
    num: "05",
    title: "Prioritize unbranded discovery over branded queries",
    desc: "When a buyer explicitly asks for your brand, you have already won discovery. The critical research occurs when buyers search without brand names.",
  },
  {
    num: "06",
    title: "Model variability is visible, not hidden",
    desc: "LLMs are probabilistic. We reveal run-to-run divergence across repeated trials rather than pretending responses are static.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      {/* Header Banner */}
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "About" }]} className="mb-4" />
          <div className="max-w-3xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Company & Mission
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              A research instrument for understanding AI buying decisions.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Software procurement is undergoing its largest shift in twenty years. B2B buyers no longer rely solely on search engine ten-blue-links or review directories—they consult conversational AI models. ConsiderIQ was created to understand how that changes who wins.
            </p>
          </div>
        </Container>
      </div>

      {/* THE THESIS */}
      <section className="py-16 md:py-24 border-b border-border bg-surface">
        <Container size="default">
          <div className="max-w-3xl mx-auto space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                The shift from search to consultative AI
              </h2>
              <p>
                When a technology leader needs to select a database, security platform, or collaboration tool today, they do not just search for a keyword and click three ads. They enter a prompt:
              </p>
              <blockquote className="border-l-2 border-accent pl-4 py-1 italic text-foreground bg-muted/30 rounded-r-md">
                &quot;We are a 60-person fintech moving to multi-region AWS. We need a secrets manager that supports automated rotation, audit trails, and costs under $1,000/month. What are our top choices?&quot;
              </blockquote>
              <p>
                In seconds, an AI model gathers context, evaluates trade-offs, eliminates incompatible vendors, and produces a shortlist. If your brand is omitted—or eliminated when the buyer adds a specific compliance requirement—you lost the deal before your sales team even knew a search occurred.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Why we reject generic AI SEO dashboards
              </h2>
              <p>
                Most tools entering this space treat AI like another search engine: they check if a keyword triggers a mention, synthesize an arbitrary &quot;visibility score&quot;, and promise easy hacks to &quot;dominate AI rankings.&quot;
              </p>
              <p>
                We believe that approach is fundamentally flawed. AI recommendation engines are complex, probabilistic, and constraint-driven. You cannot understand your performance with a single number. You need to understand the <strong>buyer&apos;s decision journey</strong>:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>Where did your brand enter the consideration set?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>Which constraint caused you to drop out?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>Which competitor was chosen instead, and why?</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* RESEARCH PRINCIPLES */}
      <section className="py-16 md:py-24 border-b border-border bg-surface-elevated/30" id="principles">
        <Container size="default">
          <SectionHeading
            badge="Constitution"
            title="Our engineering & research principles"
            description="These principles guide how we build our software, collect simulation data, and report findings."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRINCIPLES.map((principle, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-6 space-y-3 shadow-subtle"
              >
                <span className="font-mono text-xs text-accent font-semibold">
                  Principle {principle.num}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {principle.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection
        title="Experience evidence-first AI brand intelligence"
        description="Join our research beta to see how realistic buyer journeys perceive and evaluate your brand."
      />
    </PageShell>
  );
}
