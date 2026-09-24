"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DecisionStep } from "@/components/marketing/decision-trail";
import { FileText, Link2, Brain, AlertCircle } from "lucide-react";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step?: DecisionStep | null;
}

export function EvidenceDrawer({ open, onOpenChange, step }: EvidenceDrawerProps) {
  if (!step) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={step.classification === "OBSERVED" ? "observed" : step.classification === "CALCULATED" ? "calculated" : "inferred"}>
              {step.classification}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-mono">
              Illustrative Preview
            </Badge>
          </div>
          <DialogTitle className="text-xl">Evidence Drawer — {step.title}</DialogTitle>
          <DialogDescription className="text-sm">
            Trace the simulated response back to observable provider outputs, extracted citations, and methodology notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Methodological separation banner */}
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground block">
              Methodological Separation Principle
            </span>
            <p>
              ConsiderIQ cleanly isolates what the AI provider returned (OBSERVED), what the engine measured (CALCULATED), and probabilistic interpretations (INFERRED). We never claim hidden model reasoning is visible.
            </p>
          </div>

          <Tabs defaultValue="observed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="observed">Observed</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="interpretation">Inferred</TabsTrigger>
              <TabsTrigger value="methodology">Method</TabsTrigger>
            </TabsList>

            {/* TAB 1: OBSERVED */}
            <TabsContent value="observed" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" />
                Raw Provider Output (Simulated Transcript)
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3.5 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
{`[SIMULATED PROVIDER TURN]
User: ${step.buyerPrompt}

Response:
"Evaluating your requirement against current platform capabilities:
- Rootly: Provides native Okta SCIM directory provisioning and published SOC 2 Type II compliance with bi-weekly rotation workflows.
- PagerDuty: Industry standard with FedRAMP High, mature SCIM v2, enterprise tier pricing applies.
- Your Brand: Strong Slack alerting workflows; however, SCIM directory synchronization documentation was not identified in the knowledge snapshot for automated de-provisioning."`}
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                * Note: In production runs, raw provider tokens are preserved verbatim and cryptographically hashed for auditability.
              </p>
            </TabsContent>

            {/* TAB 2: CITATIONS & SOURCES */}
            <TabsContent value="citations" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Extracted Source References
              </div>
              <div className="space-y-2">
                <div className="rounded-md border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Competitor Compliance Portal</span>
                    <Badge variant="outline" className="text-[10px]">Verified URL</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Public documentation detailing Okta SCIM 2.0 integration guides and audit report availability.
                  </p>
                </div>
                <div className="rounded-md border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">G2 Category Grid — Incident Response</span>
                    <Badge variant="outline" className="text-[10px]">Aggregator Source</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Peer review rankings highlighting onboarding ease for engineering teams under 50 employees.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: INFERRED INTERPRETATION */}
            <TabsContent value="interpretation" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Brain className="h-4 w-4" />
                Analytical Interpretation
              </div>
              <div className="rounded-md border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900 p-3.5 text-xs space-y-2">
                <p className="text-foreground leading-relaxed">
                  <strong>Why did the consideration set change?</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When the buyer specified SOC 2 and SCIM requirements, the AI model filtered for platforms with explicit, crawlable directory provisioning documentation. Competitors with dedicated public security and compliance hubs retained visibility.
                </p>
                <div className="flex items-start gap-1.5 text-purple-700 dark:text-purple-300 text-[11px] pt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Cautionary note: This is an analytical hypothesis based on simulated output variance across 10 repeated scenario runs.
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: METHODOLOGY */}
            <TabsContent value="methodology" className="space-y-3 pt-3">
              <div className="text-xs space-y-2.5 text-muted-foreground leading-relaxed">
                <p>
                  <strong>Sampling standard:</strong> A single scenario run is not a statistic. ConsiderIQ executes multi-turn conversations across varied buyer persona prompts to measure repeatability.
                </p>
                <p>
                  <strong>No artificial scoring:</strong> We do not synthesize a fake single &quot;SEO score&quot;. We show the exact turn where a brand was dropped and the competing alternative selected.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
