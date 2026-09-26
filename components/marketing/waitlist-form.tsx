"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [formData, setFormData] = React.useState({
    email: "",
    company_website: "",
    role: "",
    research_question: "",
    heard_about_us: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid work email address";
    }

    const trimmedWebsite = formData.company_website.trim();
    if (!trimmedWebsite) {
      newErrors.company_website = "Company website is required";
    } else {
      // Basic client check: needs a dot or protocol
      const withProtocol = /^https?:\/\//i.test(trimmedWebsite)
        ? trimmedWebsite
        : `https://${trimmedWebsite}`;
      try {
        const parsed = new URL(withProtocol);
        if (!parsed.hostname.includes(".") || parsed.hostname.length < 3) {
          newErrors.company_website = "Please enter a valid website URL (e.g. acme.com)";
        }
      } catch {
        newErrors.company_website = "Please enter a valid website URL";
      }
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setServerError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          company_website: formData.company_website.trim(),
          role: formData.role.trim(),
          research_question: formData.research_question.trim() || undefined,
          heard_about_us: formData.heard_about_us.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setServerError(
          data?.error || "Unable to submit your request at this moment. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      setSubmittedEmail(formData.email.trim());
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle space-y-6">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Request Private Beta Access
            </h2>
            <p className="text-xs text-muted-foreground">
              Participate in our early research cohort to inspect your brand&apos;s AI buyer journeys.
            </p>
          </div>

          {serverError && (
            <div
              className="rounded-md border border-rose-200 bg-rose-50/70 dark:bg-rose-950/40 dark:border-rose-900 p-3 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2 animate-in fade-in-0"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Work Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Work Email <span className="text-rose-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@company.com"
              value={formData.email}
              disabled={isSubmitting}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Company Website & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="company_website" className="text-xs font-medium text-foreground">
                Company Website <span className="text-rose-500">*</span>
              </label>
              <Input
                id="company_website"
                name="company_website"
                type="text"
                autoComplete="url"
                placeholder="company.com"
                value={formData.company_website}
                disabled={isSubmitting}
                onChange={(e) => {
                  setFormData({ ...formData, company_website: e.target.value });
                  if (errors.company_website) setErrors({ ...errors, company_website: "" });
                }}
                error={!!errors.company_website}
                required
              />
              {errors.company_website && (
                <p className="text-[11px] text-destructive">{errors.company_website}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-medium text-foreground">
                Your Role <span className="text-rose-500">*</span>
              </label>
              <Input
                id="role"
                name="role"
                type="text"
                placeholder="Founder, Head of Marketing, etc."
                value={formData.role}
                disabled={isSubmitting}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  if (errors.role) setErrors({ ...errors, role: "" });
                }}
                error={!!errors.role}
                required
              />
              {errors.role && (
                <p className="text-[11px] text-destructive">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Optional Research Question */}
          <div className="space-y-1.5">
            <label
              htmlFor="research_question"
              className="text-xs font-medium text-foreground flex items-center justify-between"
            >
              <span>What question would you like to investigate?</span>
              <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
            </label>
            <textarea
              id="research_question"
              name="research_question"
              rows={3}
              disabled={isSubmitting}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-50"
              placeholder="e.g. Which buyer constraints cause us to be eliminated against Competitor X?"
              value={formData.research_question}
              onChange={(e) =>
                setFormData({ ...formData, research_question: e.target.value })
              }
            />
          </div>

          {/* How did you hear about us? */}
          <div className="space-y-1.5">
            <label htmlFor="heard_about_us" className="text-xs font-medium text-foreground">
              How did you hear about us?
            </label>
            <select
              id="heard_about_us"
              name="heard_about_us"
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-50"
              value={formData.heard_about_us}
              onChange={(e) =>
                setFormData({ ...formData, heard_about_us: e.target.value })
              }
            >
              <option value="">Select an option</option>
              <option value="Reddit">Reddit</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Google / Search">Google / Search</option>
              <option value="Indie Hackers">Indie Hackers</option>
              <option value="Product Hunt">Product Hunt</option>
              <option value="Friend / Colleague">Friend / Colleague</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full gap-2 text-base h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting request...</span>
                </>
              ) : (
                <>
                  <span>Request Beta Access</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-center text-muted-foreground pt-1">
            Free access during the research beta. No credit card required.
          </p>
        </form>
      ) : (
        /* Truthful Success Feedback State */
        <div className="py-6 space-y-4 text-left animate-in fade-in-0 duration-200">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-3 text-emerald-700 dark:text-emerald-400 w-fit">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold text-foreground">
            Beta Request Received
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you. Your request for beta access for{" "}
            <strong className="text-foreground">{submittedEmail}</strong> has been recorded.
          </p>

          <div className="rounded-lg border border-border bg-surface-elevated p-4 text-xs text-muted-foreground space-y-2">
            <strong className="text-foreground block">
              What happens next:
            </strong>
            <p>
              We onboard research participants in rolling cohorts to maintain hands-on feedback cycles. We will review your company context and reach out directly with access instructions when your cohort opens.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  email: "",
                  company_website: "",
                  role: "",
                  research_question: "",
                  heard_about_us: "",
                });
                setSubmitted(false);
              }}
            >
              Submit Another Request
            </Button>
            <Button asChild size="sm">
              <Link href="/how-it-works">
                Explore Our Methodology
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
