import * as React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/shared/page-shell";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { getCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Review ConsiderIQ's privacy practices, data collection boundaries, AI processing policies, and data retention standards.",
  alternates: {
    canonical: getCanonicalUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="py-8 md:py-12 border-b border-border bg-surface-elevated/20">
        <Container size="default">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} className="mb-4" />
          <div className="max-w-3xl space-y-3">
            <Badge variant="outline" className="text-xs font-mono">
              Legal Documentation
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Effective Date: September 2026 · Version: Beta v0.2 Draft
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
                <li><a href="#overview" className="hover:text-foreground">1. Overview</a></li>
                <li><a href="#collection" className="hover:text-foreground">2. Information We Collect</a></li>
                <li><a href="#usage" className="hover:text-foreground">3. How We Use Information</a></li>
                <li><a href="#ai-processing" className="hover:text-foreground">4. AI Provider Processing</a></li>
                <li><a href="#public-sites" className="hover:text-foreground">5. Public Website Analysis</a></li>
                <li><a href="#service-providers" className="hover:text-foreground">6. Subprocessors</a></li>
                <li><a href="#retention-deletion" className="hover:text-foreground">7. Retention & Deletion</a></li>
                <li><a href="#security" className="hover:text-foreground">8. Security Safeguards</a></li>
                <li><a href="#user-rights" className="hover:text-foreground">9. Your Rights</a></li>
                <li><a href="#contact" className="hover:text-foreground">10. Contact Us</a></li>
              </ul>
            </aside>

            {/* Policy Content */}
            <div className="lg:col-span-8 space-y-10 text-sm leading-relaxed text-muted-foreground">
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs">
                <strong>Preliminary Draft Notice:</strong> This privacy policy reflects ConsiderIQ&apos;s product data practices during our current beta release. Specific legal entity registrations, privacy contact aliases, and third-party subprocessor lists will be updated prior to commercial general availability.
              </div>

              <section id="overview" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  1. Overview
                </h2>
                <p>
                  ConsiderIQ provides software for simulating and analyzing AI-mediated buyer journeys and brand consideration sets. This Privacy Policy explains what information we collect from visitors, registered users, and participating organizations, how we utilize that data, how it is processed across AI providers, and the security controls governing your information.
                </p>
              </section>

              <section id="collection" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  2. Information We Collect
                </h2>
                <p>Depending on how you interact with our website and application, we collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Account & Registration Details:</strong> Full name, work email address, organization name, and authentication tokens.</li>
                  <li><strong>Brand & Project Context:</strong> Tracked brand names, target website domains, and identified competitor profiles.</li>
                  <li><strong>Buyer Persona & Scenario Prompts:</strong> Buyer persona attributes, technical constraints, compliance criteria, and multi-turn scenario conversation trees configured by you.</li>
                  <li><strong>AI Simulation Data:</strong> Multi-turn dialogue transcripts, raw provider outputs, and source citation metadata.</li>
                  <li><strong>Waitlist & Survey Feedback:</strong> Information voluntarily provided when requesting beta access.</li>
                  <li><strong>Technical & Audit Logs:</strong> IP address, browser user-agent, session timestamps, and security audit logs.</li>
                </ul>
              </section>

              <section id="usage" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  3. How We Use Information
                </h2>
                <p>We process collected information to:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li>Provide, maintain, and secure the ConsiderIQ platform and simulation engine.</li>
                  <li>Authenticate authorized users and enforce strict organization-level multi-tenant isolation.</li>
                  <li>Execute simulated buyer journeys across configured third-party AI models.</li>
                  <li>Index public brand websites specifically submitted by you for brand profile modeling.</li>
                  <li>Prevent abuse, prompt injection attacks, crawler Denial-of-Service, and unauthorized cross-tenant data access.</li>
                  <li>Provide customer support and send critical service or security notifications.</li>
                </ul>
              </section>

              <section id="ai-processing" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  4. AI Provider Processing
                </h2>
                <p>
                  To conduct simulated buyer evaluations, ConsiderIQ transmits user-configured scenario prompts and public brand context to leading AI providers (including Google Gemini, OpenAI, and Anthropic).
                </p>
                <p>
                  We explicitly choose enterprise API agreements where available that restrict providers from training public foundation models on your submitted scenario queries. Raw provider response tokens are stored in an immutable, read-only format to provide verifiable auditability for simulation results.
                </p>
              </section>

              <section id="public-sites" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  5. Public Website Analysis & Crawler Policy
                </h2>
                <p>
                  Users may input public brand URLs to extract product documentation and feature matrices. Our crawler strictly enforces SSRF protection, adheres to robots.txt guidelines, accesses only public HTTP/HTTPS endpoints, and rejects all requests targeting internal or private IP address spaces.
                </p>
              </section>

              <section id="service-providers" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  6. Subprocessors & Infrastructure
                </h2>
                <p>
                  ConsiderIQ utilizes trusted cloud infrastructure providers to operate the service:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                  <li><strong>Hosting & Edge Delivery:</strong> Cloudflare and Netlify for edge network routing, SSL termination, and DDoS mitigation.</li>
                  <li><strong>Database & Authentication:</strong> Supabase (PostgreSQL with Row Level Security) for data isolation and encrypted storage.</li>
                  <li><strong>AI Inference APIs:</strong> Google Cloud (Gemini) and OpenAI API for running scenario simulations.</li>
                  <li><strong>Transactional Email:</strong> Resend for waitlist verification and invitation communications.</li>
                </ul>
              </section>

              <section id="retention-deletion" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  7. Data Retention & Deletion Rights
                </h2>
                <p>
                  We retain simulation histories and brand profiles only for the duration of your active account. Organizations can request complete deletion of their projects, buyer personas, and associated simulation records at any time. When deletion is requested, active database records are purged within 30 days, subject to standard encrypted backup rotation schedules.
                </p>
              </section>

              <section id="security" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  8. Security Safeguards
                </h2>
                <p>
                  Security is embedded into every tier of our architecture: all data in transit is encrypted using TLS 1.3, secrets and API credentials are kept strictly server-side, and tenant data is isolated using PostgreSQL Row Level Security (RLS) checked on every request.
                </p>
              </section>

              <section id="user-rights" className="space-y-3">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  9. Your Privacy Rights
                </h2>
                <p>
                  Depending on your jurisdiction (such as under GDPR or CCPA/CPRA), you may have the right to access the personal information we hold about you, request corrections to inaccurate data, request full deletion, or object to certain processing activities.
                </p>
              </section>

              <section id="contact" className="space-y-3 border-t border-border pt-6">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  10. Contact Us
                </h2>
                <p>
                  For privacy inquiries, data deletion requests, or questions regarding our subprocessor policies, please contact our privacy team at:
                </p>
                <div className="rounded-md border border-border p-3 font-mono text-xs bg-muted/20">
                  Email: privacy@consideriq.com
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
