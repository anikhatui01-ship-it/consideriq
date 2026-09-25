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
import { FileText, Link2, Brain, AlertCircle, Info } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge
              variant={
                step.classification === "OBSERVED"
                  ? "observed"
                  : step.classification === "CALCULATED"
                  ? "calculated"
                  : "inferred"
              }
            >
              {step.classification}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-mono">
              Illustrative Example
            </Badge>
          </div>
          <DialogTitle className="text-xl">Evidence Drawer — {step.title}</DialogTitle>
          <DialogDescription className="text-sm">
            Example scenario data illustrating how ConsiderIQ grounds every finding in observable provider outputs and source references.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Methodological separation banner */}
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1.5">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Info className="h-4 w-4 text-primary shrink-0" />
              Evidence Classification Principle
            </span>
            <p className="leading-relaxed">
              We strictly separate: <strong>Observed</strong> (text actually returned by the model), <strong>Calculated</strong> (measured occurrences across test iterations), and <strong>Inferred</strong> (analytical hypotheses). We never imply visibility into hidden model reasoning.
            </p>
          </div>

          <Tabs defaultValue="observed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="observed" className="text-xs">Observed</TabsTrigger>
              <TabsTrigger value="citations" className="text-xs">Sources</TabsTrigger>
              <TabsTrigger value="interpretation" className="text-xs">Inferred</TabsTrigger>
              <TabsTrigger value="methodology" className="text-xs">Method</TabsTrigger>
            </TabsList>

            {/* TAB 1: OBSERVED */}
            <TabsContent value="observed" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" />
                Observed Provider Output (Illustrative Transcript)
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-3.5 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
{`[ILLUSTRATIVE PROVIDER TRANSCRIPT]
Buyer Question: ${step.buyerPrompt}

Observed Output Text:
"Evaluating your requirement against candidate platform specifications:
- Rootly: Provides native Okta SCIM directory provisioning and published SOC 2 Type II compliance with bi-weekly rotation workflows.
- PagerDuty: Industry standard with FedRAMP High, mature SCIM v2, enterprise tier pricing applies.
- Your Brand: Strong Slack alerting workflows; however, SCIM directory synchronization documentation was not identified in the knowledge snapshot for automated de-provisioning."`}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Observed: The exact, unedited text returned by the model for this conversational turn.
              </p>
            </TabsContent>

            {/* TAB 2: CITATIONS & SOURCES */}
            <TabsContent value="citations" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Observed Source References
              </div>
              <div className="space-y-2">
                <div className="rounded-md border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Competitor Compliance Hub</span>
                    <Badge variant="outline" className="text-[10px]">Source Reference</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Public documentation detailing Okta SCIM 2.0 integration guides and security audit availability.
                  </p>
                </div>
                <div className="rounded-md border border-border p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Category Software Review Directory</span>
                    <Badge variant="outline" className="text-[10px]">Observed Source</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Peer review summaries comparing team onboarding timelines and workflow setup speeds.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: INFERRED INTERPRETATION */}
            <TabsContent value="interpretation" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Brain className="h-4 w-4" />
                Analytical Interpretation (Inferred)
              </div>
              <div className="rounded-md border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900 p-3.5 text-xs space-y-2">
                <p className="text-foreground leading-relaxed">
                  <strong>Why did the consideration set change at this turn?</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When the buyer introduced SOC 2 and SCIM constraints, the model filtered for tools with visible, crawlable directory provisioning documentation. Competitors with dedicated public security hubs retained visibility into the final stage.
                </p>
                <div className="flex items-start gap-1.5 text-amber-900 dark:text-amber-200 text-[11px] pt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Cautionary note: This is an analytical hypothesis derived from observed output differences across scenario variations. It does not represent internal model reasoning.
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: METHODOLOGY */}
            <TabsContent value="methodology" className="space-y-3 pt-3">
              <div className="text-xs space-y-2.5 text-muted-foreground leading-relaxed">
                <p>
                  <strong>Observed vs Calculated vs Inferred:</strong> We strictly separate what the AI provider returned (Observed), what our software measured across repeated trials (Calculated), and analytical interpretations (Inferred).
                </p>
                <p>
                  <strong>No Vanity Scores:</strong> Instead of producing an arbitrary single &quot;visibility score,&quot; our research framework focuses on identifying the specific constraint where a brand was dropped.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
