import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, BookOpen } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/marketing/contact-form";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Inquiries",
  description:
    "Information regarding research collaboration and beta access inquiries for ConsiderIQ.",
  alternates: {
    canonical: getCanonicalUrl("/contact"),
  },
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Contact" }]} className="mb-4" />
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="text-xs font-mono">
              Private Research Beta
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Contact & Inquiries
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              ConsiderIQ is currently in Private Research Beta. All research participation and brand evaluation requests are handled through our beta intake process.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-12 md:py-20 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
            {/* Contact Intake Information */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Program Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-border bg-surface-elevated/40 p-6 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Research Program Operations</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  During our Private Research Beta, we do not operate a general support inbox or unmonitored email addresses. Engineering resources are focused directly on cohort evaluations and model calibration.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Methodology Documentation</span>
                </div>
                <p className="leading-relaxed">
                  Our simulation design, evidence classification principles, and decision trail taxonomy are documented publicly throughout our site to ensure full transparency.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
