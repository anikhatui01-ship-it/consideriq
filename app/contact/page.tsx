import * as React from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact & Inquiries",
  description:
    "Get in touch with the ConsiderIQ engineering and research team regarding beta inquiries, technical partnerships, or methodology feedback.",
  alternates: {
    canonical: "https://consideriq.com/contact",
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
              Direct Communication
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              Get in touch with the team.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have questions about our simulation models, research methodology, or beta participation? Send us a direct inquiry.
            </p>
          </div>
        </Container>
      </div>

      <section className="py-12 md:py-20 border-b border-border bg-surface">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Direct Contact Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-border bg-surface-elevated/40 p-6 space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Direct Inquiries
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-accent shrink-0 mt-1" />
                    <div>
                      <strong className="text-foreground block">Email Inquiries</strong>
                      <span>contact@consideriq.com</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-accent shrink-0 mt-1" />
                    <div>
                      <strong className="text-foreground block">Beta Inquiries</strong>
                      <span>beta@consideriq.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-6 space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Research Collaboration</span>
                </div>
                <p className="leading-relaxed">
                  Are you an academic researcher, AI safety practitioner, or agency studying generative engine optimization (GEO/AEO)? We welcome methodology discussions and dataset comparisons.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
