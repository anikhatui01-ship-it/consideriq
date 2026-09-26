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
  title: "Contact & Support",
  description:
    "Get in touch with the ConsiderIQ team for support, enterprise questions, or general inquiries.",
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
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Contact & Support
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have questions about your brand&apos;s AI buyer journey simulations or need custom enterprise analysis? We&apos;re here to help.
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
                  <span>Platform Operations</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  ConsiderIQ simulations execute automated multi-turn AI buyer queries against real LLM providers. Account holders receive dedicated support directly through the platform dashboard.
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
