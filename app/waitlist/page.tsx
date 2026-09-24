import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export const metadata: Metadata = {
  title: "Join Beta Waitlist",
  description:
    "Join the ConsiderIQ beta cohort to simulate realistic buyer journeys and discover where your brand enters, survives, or disappears from AI recommendations.",
  alternates: {
    canonical: "https://consideriq.com/waitlist",
  },
};

export default function WaitlistPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Join Waitlist" }]} className="mb-4" />
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Beta Access Registration
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Join the ConsiderIQ beta cohort.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We are onboarding participating software founders, growth leaders, and SEO/GEO practitioners in weekly cohorts.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-12 md:py-20 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
            {/* Form Section */}
            <div className="lg:col-span-7">
              <WaitlistForm />
            </div>

            {/* Sidebar Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-border bg-surface-elevated/40 p-6 space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  What happens after you join?
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center font-mono text-[11px] font-semibold text-foreground shrink-0 mt-0.5">
                      1
                    </span>
                    <span>We review your brand domain and ICP context to ensure compatibility with our simulation models.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center font-mono text-[11px] font-semibold text-foreground shrink-0 mt-0.5">
                      2
                    </span>
                    <span>You receive an invitation link to create your project and configure your buyer personas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center font-mono text-[11px] font-semibold text-foreground shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Run your initial 10-scenario simulation batch and inspect your Decision Trail.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Privacy & Confidentiality</span>
                </div>
                <p className="leading-relaxed">
                  We treat all waitlist submissions confidentially. We never share your company details or evaluation questions with third parties, and we do not use submitted data to train public models.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
