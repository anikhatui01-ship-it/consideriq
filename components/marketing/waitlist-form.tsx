"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    role: "",
    website: "",
    goal: "",
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid work email address";
    }
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    // Truthful demonstration state: we do not fake database storage
    setSubmitted(true);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle space-y-6">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Request access for your brand
            </h2>
            <p className="text-xs text-muted-foreground">
              Fields marked with * are required for beta qualification.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-medium text-foreground">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              required
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Work Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Work Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="company" className="text-xs font-medium text-foreground">
                Company *
              </label>
              <Input
                id="company"
                name="company"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                error={!!errors.company}
                required
              />
              {errors.company && (
                <p className="text-[11px] text-destructive">{errors.company}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-medium text-foreground">
                Role *
              </label>
              <Input
                id="role"
                name="role"
                placeholder="Founder, Head of Growth, etc."
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                error={!!errors.role}
                required
              />
              {errors.role && (
                <p className="text-[11px] text-destructive">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Optional Website */}
          <div className="space-y-1.5">
            <label htmlFor="website" className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>Brand Website</span>
              <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* Optional Learning Goal */}
          <div className="space-y-1.5">
            <label htmlFor="goal" className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>What do you want to learn about your brand in AI search?</span>
              <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
            </label>
            <textarea
              id="goal"
              name="goal"
              rows={3}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
              placeholder="e.g. Which enterprise security constraints cause buyers to eliminate us against Competitor X?"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full gap-2 text-base h-11">
              <span>Submit Waitlist Request</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Truthful Milestone Notice */}
          <div className="rounded-md border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>
              Frontend Shell v0.2: Form fields validate cleanly. Live Supabase database storage and confirmation email dispatch will connect in Milestone v0.3.
            </span>
          </div>
        </form>
      ) : (
        /* Truthful Success Feedback State */
        <div className="py-6 space-y-4 text-left animate-in fade-in-0 duration-200">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-3 text-emerald-700 dark:text-emerald-400 w-fit">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold text-foreground">
            Form Validation Complete
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong>{formData.name}</strong> ({formData.email}). Your input passed all client-side schema requirements.
          </p>

          <div className="rounded-lg border border-border bg-surface-elevated p-4 text-xs text-muted-foreground space-y-2">
            <strong className="text-foreground block">
              Engineering Status Notice (Milestone v0.2):
            </strong>
            <p>
              In adherence to our strict non-fabrication rule, this prototype does not pretend to write records to a live production database. Backend wiring (Supabase tables, RLS, and transactional emails) is scheduled for the upcoming backend milestone.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitted(false)}
            >
              Reset Form
            </Button>
            <Button asChild size="sm">
              <Link href="/how-it-works">
                Read Methodology
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
