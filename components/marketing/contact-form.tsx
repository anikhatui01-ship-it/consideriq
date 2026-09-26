"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-subtle space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Beta Program Inquiries
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          ConsiderIQ is currently in Private Research Beta. To focus our engineering resources on model fidelity and cohort participant outcomes, we do not operate an unmonitored public support inbox or incoming email queue.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-3">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>Requesting an evaluation or cohort access?</span>
        </div>
        <p className="leading-relaxed">
          If you want to inspect how your brand is evaluated or eliminated across multi-step AI buyer journeys, please submit an access request through our intake form.
        </p>
        <div>
          <Button asChild size="default" className="gap-2 text-sm">
            <Link href="/waitlist">
              <span>Request Beta Access</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Active Cohort Participants</span>
        </div>
        <p className="leading-relaxed">
          Teams participating in active research sprints communicate directly with our engineers via dedicated channels provided during onboarding.
        </p>
      </div>
    </div>
  );
}
