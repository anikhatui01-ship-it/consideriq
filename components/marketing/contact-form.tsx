"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/lib/site";

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "Research Collaboration",
    message: "",
  });

  const [copied, setCopied] = React.useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(`[ConsiderIQ Inquiry] ${formData.subject}`);
    const mailtoBody = encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Direct Communication
        </h2>
        <p className="text-xs text-muted-foreground">
          During our Private Research Beta, our founding engineers personally handle research, partnership, and methodology questions.
        </p>
      </div>

      {/* Priority Beta Notice */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>Looking to evaluate your brand in AI search?</span>
        </div>
        <p className="leading-relaxed">
          If you want to participate in our buyer journey simulations, please submit a beta request. Submissions are queued directly for upcoming research cohorts.
        </p>
        <div className="pt-1">
          <Button asChild size="sm" className="gap-1.5 h-8 text-xs">
            <Link href="/waitlist">
              <span>Go to Beta Request Form</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Email Dispatch Form (Drafts directly in email client) */}
      <form onSubmit={handleMailto} className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Send an Email Inquiry
          </span>
          <p className="text-xs text-muted-foreground">
            Compose a message below to launch your email client with your details prefilled, or email us directly at{" "}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="text-primary underline font-medium cursor-pointer"
            >
              {SITE_CONFIG.contactEmail}
            </button>
            {copied && <span className="text-emerald-600 ml-1.5 font-medium">(copied!)</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="text-xs font-medium text-foreground">
              Your Name
            </label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-xs font-medium text-foreground">
              Your Email
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="text-xs font-medium text-foreground">
            Topic
          </label>
          <select
            id="contact-subject"
            name="subject"
            className="flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          >
            <option value="Research & Methodology">Research & Methodology Question</option>
            <option value="Agency & Technical Partnership">Agency / Technical Partnership</option>
            <option value="Academic Inquiry">Academic or Industry Research Inquiry</option>
            <option value="General Question">General Question</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="text-xs font-medium text-foreground">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Describe what you'd like to discuss..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button type="submit" size="default" className="gap-2">
            <Mail className="h-4 w-4" />
            <span>Open in Email Client</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleCopyEmail}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Copied Address</span>
              </>
            ) : (
              <span>Copy Email Address</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
