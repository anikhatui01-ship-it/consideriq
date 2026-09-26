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
          Platform Inquiries & Support
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Get started with a free brand audit to see how AI assistants evaluate your software category. For enterprise deployments, custom model calibrations, or dedicated pipelines, reach out below.
        </p>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-3">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>Ready to run an AI buyer journey audit?</span>
        </div>
        <p className="leading-relaxed">
          Create a free account to immediately model how your brand is evaluated, shortlisted, or eliminated across realistic buyer questions and constraints.
        </p>
        <div>
          <Button asChild size="default" className="gap-2 text-sm">
            <Link href="/signup">
              <span>Start Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Enterprise & Agency Accounts</span>
        </div>
        <p className="leading-relaxed">
          Teams requiring multi-seat access, API integrations, or scheduled monitoring can configure their parameters in the platform or contact our solutions team.
        </p>
      </div>
    </div>
  );
}
