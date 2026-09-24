"use client";

import * as React from "react";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "Beta Access Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
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
    setSubmitted(true);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle space-y-6">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Send a message
            </h2>
            <p className="text-xs text-muted-foreground">
              We respond directly to all research and partnership inquiries.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-medium text-foreground">
              Your Name *
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Alex Taylor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              required
            />
            {errors.name && (
              <p className="text-[11px] text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              required
            />
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject" className="text-xs font-medium text-foreground">
              Topic / Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              <option value="Beta Access Inquiry">Beta Access Inquiry</option>
              <option value="Research & Methodology">Research & Methodology Question</option>
              <option value="Technical Partnership">Technical Partnership</option>
              <option value="General Question">General Question</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-medium text-foreground">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="flex w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-subtle transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Tell us what you'd like to discuss..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            {errors.message && (
              <p className="text-[11px] text-destructive">{errors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full gap-2 text-base h-11">
              <span>Send Message</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>
              Milestone v0.2: Form fields validate cleanly. Live email dispatch and ticket routing (Resend) will be enabled in the backend milestone.
            </span>
          </div>
        </form>
      ) : (
        <div className="py-6 space-y-4 text-left animate-in fade-in-0 duration-200">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 p-3 text-emerald-700 dark:text-emerald-400 w-fit">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold text-foreground">
            Message Form Validated
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong>{formData.name}</strong>. Your message schema validated successfully.
          </p>

          <div className="rounded-lg border border-border bg-surface-elevated p-4 text-xs text-muted-foreground space-y-2">
            <strong className="text-foreground block">
              Engineering Status Notice (Milestone v0.2):
            </strong>
            <p>
              In adherence to our strict non-fabrication rule, this prototype does not simulate email dispatch. Real email delivery will be wired to Resend in the backend milestone.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
