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
import { SimulationTurn, Project } from "@/lib/types/database";
import { FileText, Link2, Brain, AlertCircle, Info, ExternalLink } from "lucide-react";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turn: SimulationTurn | null;
  project: Project;
}

export function EvidenceDrawer({ open, onOpenChange, turn, project }: EvidenceDrawerProps) {
  if (!turn) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge
              variant={
                turn.classification === "OBSERVED"
                  ? "observed"
                  : turn.classification === "CALCULATED"
                  ? "calculated"
                  : "inferred"
              }
            >
              {turn.classification}
            </Badge>
            <Badge variant="outline" className="text-[11px] font-mono">
              Turn {turn.turn_index} · {turn.stage}
            </Badge>
          </div>
          <DialogTitle className="text-xl">Evidence Drawer: {turn.stage}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Grounding and unedited provider tokens for {project.name} in stage {turn.stage}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Methodological separation banner */}
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Info className="h-4 w-4 text-primary shrink-0" />
              Evidence Classification Principle
            </span>
            <p className="leading-relaxed">
              We strictly separate: <strong>Observed</strong> (text actually returned by Gemini), <strong>Calculated</strong> (measured presence and survival across turns), and <strong>Inferred</strong> (analytical hypotheses). We never claim access to hidden model reasoning.
            </p>
          </div>

          <Tabs defaultValue="observed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="observed" className="text-xs">Observed</TabsTrigger>
              <TabsTrigger value="citations" className="text-xs">
                Sources {turn.citations && turn.citations.length > 0 ? `(${turn.citations.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="interpretation" className="text-xs">Inferred</TabsTrigger>
              <TabsTrigger value="methodology" className="text-xs">Methodology</TabsTrigger>
            </TabsList>

            {/* TAB 1: OBSERVED */}
            <TabsContent value="observed" className="space-y-3 pt-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Observed Gemini Output (Unedited Raw Text)
                </span>
                <span className="font-mono text-[10px]">
                  Turn {turn.turn_index} of 5
                </span>
              </div>

              <div className="rounded-md border border-border bg-muted/20 p-3.5 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {turn.observed_response}
              </div>

              <p className="text-[11px] text-muted-foreground">
                Observed: The exact, unedited tokens returned by the Google Gemini API for this prompt.
              </p>
            </TabsContent>

            {/* TAB 2: SOURCES & CITATIONS */}
            <TabsContent value="citations" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-4 w-4" />
                Observed Source References
              </div>

              {turn.citations && turn.citations.length > 0 ? (
                <div className="space-y-2">
                  {turn.citations.map((citation, cIdx) => (
                    <div key={cIdx} className="rounded-md border border-border p-3 text-xs space-y-1.5 bg-surface">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground truncate">{citation.title}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                          Source URL
                        </Badge>
                      </div>
                      {citation.snippet && (
                        <p className="text-muted-foreground italic">&quot;{citation.snippet}&quot;</p>
                      )}
                      {citation.url && (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate max-w-[400px]">{citation.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">No explicit external URLs cited in this turn.</p>
                  <p className="text-[11px] text-muted-foreground/80">
                    In accordance with our data integrity constitution, ConsiderIQ never invents synthetic source citations.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: INFERRED INTERPRETATION */}
            <TabsContent value="interpretation" className="space-y-3 pt-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Brain className="h-4 w-4" />
                Analytical Interpretation (Inferred)
              </div>

              <div className="rounded-md border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900 p-4 text-xs space-y-2.5">
                <p className="text-foreground font-semibold">
                  Why did the consideration set change at this turn?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {turn.insight ||
                    `Evaluation of ${project.name} during the ${turn.stage} stage reflected buyer constraints and competitive documentation.`}
                </p>
                <div className="flex items-start gap-1.5 text-amber-900 dark:text-amber-200 text-[11px] pt-1 border-t border-amber-200/60 dark:border-amber-900/60">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    Cautionary note: This is an analytical interpretation derived from observed output patterns. It does not represent internal model reasoning.
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: METHODOLOGY */}
            <TabsContent value="methodology" className="space-y-3 pt-3">
              <div className="text-xs space-y-3 text-muted-foreground leading-relaxed">
                <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
                  <span className="font-semibold text-foreground block">Observed vs. Calculated vs. Inferred</span>
                  <p>
                    <strong>Observed:</strong> Direct textual statements returned by Google Gemini.
                  </p>
                  <p>
                    <strong>Calculated:</strong> Mathematical occurrences measured across turns (e.g. survival rate, shortlist percentage).
                  </p>
                  <p>
                    <strong>Inferred:</strong> Analytical hypotheses explaining competitive shifts.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-surface-elevated/40 space-y-1">
                  <span className="font-semibold text-foreground block">Multi-Turn Journey Standard</span>
                  <p>
                    Unlike single-prompt keyword counters, ConsiderIQ evaluates how models prune options as enterprise constraints are progressively added.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
