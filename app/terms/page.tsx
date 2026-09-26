import * as React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read ConsiderIQ's Terms of Service, simulation limitations, acceptable use policies, and user responsibilities.",
  alternates: {
    canonical: getCanonicalUrl("/terms"),
  },
};

export default function TermsPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Terms of Service" }]} className="mb-4" />
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline" className="text-xs font-mono">
              Legal Agreement
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Effective Date: September 2026 · Version: 1.0
            </p>
          </div>
        </Container>
      </div>

      <section className="py-12 md:py-16 bg-surface border-b border-border">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
            {/* Table of Contents Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 self-start space-y-2 border-r border-border pr-6 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-foreground block mb-3">
                Contents
              </span>
              <ul className="space-y-2">
                <li><a href="#agreement" className="hover:text-foreground">1. Agreement to Terms</a></li>
                <li><a href="#eligibility" className="hover:text-foreground">2. Eligibility & Authority</a></li>
                <li><a href="#service-scope" className="hover:text-foreground">3. Scope of Service</a></li>
                <li><a href="#simulation-limits" className="hover:text-foreground font-semibold text-foreground">4. Simulation Limitations</a></li>
                <li><a href="#ai-providers" className="hover:text-foreground">5. Third-Party AI Providers</a></li>
                <li><a href="#acceptable-use" className="hover:text-foreground">6. Acceptable Use Policy</a></li>
                <li><a href="#crawler-rules" className="hover:text-foreground">7. Public Website Analysis</a></li>
                <li><a href="#intellectual-property" className="hover:text-foreground">8. Intellectual Property</a></li>
                <li><a href="#disclaimers" className="hover:text-foreground">9. Disclaimers & Liability</a></li>
                <li><a href="#contact" className="hover:text-foreground">10. Contact Information</a></li>
              </ul>
            </aside>

            {/* Terms Content */}
            <div className="lg:col-span-8 space-y-10 text-sm leading-relaxed text-muted-foreground">
              {/* Prominent Simulation Limitation Callout */}
              <div className="rounded-xl border border-amber-300/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900 p-5 space-y-2 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Important Analytical Limitation Notice</span>
                </div>
                <p>
                  ConsiderIQ produces analytical simulations based on third-party AI provider outputs and user-configured scenarios. Simulation findings do NOT constitute predictions of human buyer behavior, guarantees of AI search rankings, commercial sales forecasts, or formal legal advice.
                </p>
              </div>

              <section id="agreement" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  1. Agreement to Terms
                </h2>
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern access to and use of the ConsiderIQ software, marketing site, simulation platform, and associated services provided by ConsiderIQ (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account, running a simulation audit, or using the service, you agree to be bound by these Terms.
                </p>
              </section>

              <section id="eligibility" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  2. Eligibility & Organizational Authority
                </h2>
                <p>
                  You must be at least 18 years of age and legally capable of entering into binding contracts. If you access or use ConsiderIQ on behalf of an enterprise, company, or legal entity, you represent and warrant that you possess the full legal authority to bind that entity to these Terms.
                </p>
              </section>

              <section id="service-scope" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  3. Scope of Service
                </h2>
                <p>
                  ConsiderIQ provides cloud-based software for simulating and analyzing AI-assisted purchasing journeys, including buyer persona builders, scenario generators, execution engines, Decision Trail visualizations, and citation extraction tools.
                </p>
                <p>
                  ConsiderIQ offers free brand audits as well as paid recurring subscriptions for full access. Features may undergo continuous improvements and updates.
                </p>
              </section>

              <section id="simulation-limits" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  4. Analytical Simulation Limitations
                </h2>
                <p>
                  All outputs generated by ConsiderIQ are analytical models reflecting specific automated interactions with AI language models under defined prompt constraints. You expressly acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Simulations are not guarantees that a commercial buyer will make a given purchasing decision.</li>
                  <li>Simulations do not guarantee that an AI search engine will recommend your brand to any individual web user.</li>
                  <li>Simulations are probabilistic and subject to model variability, training cutoff dates, and provider temperature settings.</li>
                  <li>You remain solely responsible for any business decisions, documentation edits, or marketing investments undertaken on the basis of simulation insights.</li>
                </ul>
              </section>

              <section id="ai-providers" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  5. Third-Party AI Providers
                </h2>
                <p>
                  ConsiderIQ interacts with independent third-party AI providers (including Google Gemini, OpenAI, and Anthropic). These providers maintain their own uptime schedules, acceptable use policies, and model weight updates. ConsiderIQ cannot guarantee the permanent availability of specific model checkpoints or response consistency across third-party provider updates.
                </p>
              </section>

              <section id="acceptable-use" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  6. Acceptable Use Policy
                </h2>
                <p>You agree not to use ConsiderIQ to:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Violate applicable local, national, or international laws or regulations.</li>
                  <li>Attempt to bypass authentication, circumvent organization-level isolation, or access other users&apos; projects.</li>
                  <li>Conduct adversarial prompt injection attacks intended to compromise the security or stability of the platform.</li>
                  <li>Abuse API rate limits or deploy automated scripts that overload our servers or third-party provider endpoints.</li>
                  <li>Distribute defamatory, infringing, or malicious content through scenario configurations.</li>
                </ul>
              </section>

              <section id="crawler-rules" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  7. Public Website Analysis Rules
                </h2>
                <p>
                  When utilizing our website analysis tools, you may only submit public URLs that you either own or have authorization to analyze. You must not use our analysis engine to probe internal IP addresses, bypass paywalls, extract confidential private data, or attack third-party web infrastructure.
                </p>
              </section>

              <section id="intellectual-property" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  8. Intellectual Property
                </h2>
                <p>
                  ConsiderIQ, its logo, interface designs, Decision Trail™ visual patterns, and documentation are the proprietary intellectual property of ConsiderIQ. You retain all ownership rights to your submitted company materials and custom persona criteria. You grant ConsiderIQ a limited license to process such data strictly as required to generate simulations for your account.
                </p>
              </section>

              <section id="disclaimers" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  9. Disclaimers & Limitation of Liability
                </h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CONSIDERIQ IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  IN NO EVENT SHALL CONSIDERIQ BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE OR RELIANCE ON SIMULATION OUTPUTS.
                </p>
              </section>

              <section id="contact" className="space-y-3 border-t border-border pt-6">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  10. Contact Information
                </h2>
                <p>
                  For inquiries regarding these Terms of Service, please contact our legal and support team at:
                </p>
                <div className="rounded-md border border-border p-3 font-mono text-xs bg-muted/20">
                  Email: legal@consideriq.com
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
