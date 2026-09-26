import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request Beta Access",
  description:
    "Request access to the ConsiderIQ Private Research Beta to model realistic buyer journeys and discover where your brand enters, survives, or disappears from AI recommendations.",
  alternates: {
    canonical: getCanonicalUrl("/waitlist"),
  },
};

export default function WaitlistPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Request Beta Access" }]} className="mb-4" />
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Private Research Beta
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Request access to the ConsiderIQ research cohort.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We are onboarding participating software founders, growth leaders, and search practitioners in rolling cohorts to validate our buyer journey simulation models.
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

              <div className="rounded-xl border border-border bg-surface p-6 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
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
