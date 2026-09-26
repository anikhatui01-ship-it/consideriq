"use client";

import * as React from "react";
import {
  HelpCircle,
  Filter,
  ListFilter,
  AlertTriangle,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SimulationTurn, Project } from "@/lib/types/database";
import { EvidenceDrawer } from "./evidence-drawer";

interface DecisionTrailProps {
  turns: SimulationTurn[];
  project: Project;
  className?: string;
}

export function DecisionTrail({ turns, project, className }: DecisionTrailProps) {
  // Default active turn to the elimination turn if present, else turn 1
  const eliminationTurn = turns.find(
    (t) => t.stage === "ELIMINATION" || t.brands?.some((b) => b.isYourBrand && b.status === "eliminated")
  );
  const defaultTurnId = eliminationTurn ? eliminationTurn.id : (turns[0] ? turns[0].id : "");

  const [activeTurnId, setActiveTurnId] = React.useState<string>(defaultTurnId);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const activeTurn = turns.find((t) => t.id === activeTurnId) || turns[0];

  const stageIcons = {
    QUESTION: HelpCircle,
    CONSTRAINT: Filter,
    SHORTLIST: ListFilter,
    ELIMINATION: AlertTriangle,
    RECOMMENDATION: Award,
  };

  const stageSubtitles: Record<string, string> = {
    QUESTION: "Broad Category Discovery Search",
    CONSTRAINT: "Operational & Workflow Filter",
    SHORTLIST: "Comparative Shortlist Synthesis",
    ELIMINATION: "Critical Governance & Drop Point",
    RECOMMENDATION: "Winning Vendor Recommendation",
  };

  if (!turns || turns.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "rounded-xl border border-border bg-surface shadow-subtle overflow-hidden text-left",
          className
        )}
        role="region"
        aria-label="Multi-Turn Decision Trail"
      >
        {/* Trail Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-surface text-[11px] font-mono border-border/80">
              Live Decision Trail
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Multi-turn progression tracing brand survival across buyer constraints
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <span>
              Turn {turns.findIndex((t) => t.id === activeTurnId) + 1} of {turns.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Left: Step Progression Flow */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-5 bg-surface-elevated/40 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-1 font-mono">
              Buyer Decision Flow
            </p>

            <div className="space-y-1 relative" role="tablist" aria-label="Decision Trail Steps">
              {turns.map((turn) => {
                const Icon = stageIcons[turn.stage] || HelpCircle;
                const isSelected = turn.id === activeTurnId;
                const yourBrandInTurn = turn.brands?.find((b) => b.isYourBrand);
                const wasYourBrandEliminated = yourBrandInTurn?.status === "eliminated";

                return (
                  <button
                    key={turn.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => setActiveTurnId(turn.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "bg-surface border-border shadow-subtle text-foreground ring-1 ring-border"
                        : "border-transparent text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-md p-1.5 shrink-0 mt-0.5 transition-colors",
                        isSelected
                          ? wasYourBrandEliminated
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                            : "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold tracking-wide uppercase font-mono text-muted-foreground">
                          Turn {turn.turn_index} · {turn.stage}
                        </span>
                        {wasYourBrandEliminated && (
                          <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900">
                            Drop Point
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-foreground font-semibold" : ""
                        )}
                      >
                        {turn.stage.charAt(0) + turn.stage.slice(1).toLowerCase()} Stage
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {stageSubtitles[turn.stage] || "Procurement Dialogue Step"}
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-muted-foreground/50 shrink-0 self-center transition-transform",
                        isSelected && "text-foreground translate-x-0.5"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detail Panel for Active Turn */}
          {activeTurn && (
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Header with Classification Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground uppercase">
                      Turn {activeTurn.turn_index} of {turns.length} · Stage: {activeTurn.stage}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {stageSubtitles[activeTurn.stage] || activeTurn.stage}
                    </h3>
                  </div>
                  <Badge
                    variant={
                      activeTurn.classification === "OBSERVED"
                        ? "observed"
                        : activeTurn.classification === "CALCULATED"
                        ? "calculated"
                        : "inferred"
                    }
                  >
                    {activeTurn.classification}
                  </Badge>
                </div>

                {/* Buyer Prompt Box */}
                <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                    Simulated Buyer Query
                  </span>
                  <p className="text-sm text-foreground italic font-sans leading-relaxed">
                    &quot;{activeTurn.buyer_prompt}&quot;
                  </p>
                </div>

                {/* Consideration Set at this Turn */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Consideration Set at Turn
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {activeTurn.brands?.filter((b) => b.status !== "eliminated").length || 0} surviving of{" "}
                      {activeTurn.brands?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {activeTurn.brands && activeTurn.brands.length > 0 ? (
                      activeTurn.brands.map((brand, bIdx) => {
                        const isDropped = brand.status === "eliminated";
                        const isRec = brand.status === "recommended";

                        return (
                          <div
                            key={bIdx}
                            className={cn(
                              "flex items-center justify-between p-2.5 rounded-md border text-xs sm:text-sm transition-colors",
                              brand.isYourBrand && isDropped
                                ? "border-rose-300 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900"
                                : brand.isYourBrand
                                ? "border-accent/40 bg-accent/5 dark:bg-accent/10"
                                : "border-border/60 bg-surface",
                              isDropped && !brand.isYourBrand && "opacity-60 line-through"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {brand.isYourBrand && (
                                <span
                                  className="h-2 w-2 rounded-full bg-accent shrink-0"
                                  title="Your tracked brand"
                                />
                              )}
                              <span
                                className={cn(
                                  "font-medium",
                                  brand.isYourBrand ? "text-foreground font-semibold" : "text-foreground"
                                )}
                              >
                                {brand.name}
                              </span>
                              {brand.isYourBrand && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                                  You
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-right">
                              {brand.note && (
                                <span className="text-xs text-muted-foreground hidden sm:inline max-w-[200px] truncate">
                                  {brand.note}
                                </span>
                              )}
                              <Badge
                                variant={
                                  isDropped ? "danger" : isRec ? "success" : "secondary"
                                }
                                className="text-[10px] py-0 uppercase font-mono"
                              >
                                {brand.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No candidate brands extracted for this turn.
                      </p>
                    )}
                  </div>
                </div>

                {/* Core Finding / Insight Box */}
                <div
                  className={cn(
                    "p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5",
                    activeTurn.brands?.some((b) => b.isYourBrand && b.status === "eliminated")
                      ? "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-200"
                      : "bg-surface-elevated border-border text-foreground"
                  )}
                >
                  {activeTurn.brands?.some((b) => b.isYourBrand && b.status === "eliminated") ? (
                    <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block mb-0.5">
                      {activeTurn.brands?.some((b) => b.isYourBrand && b.status === "eliminated")
                        ? "Critical Drop Point Insight:"
                        : "Turn Observation:"}
                    </span>
                    <p>
                      {activeTurn.insight ||
                        `In Turn ${activeTurn.turn_index}, the model evaluated candidate capabilities against buyer constraints.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">
                  Provider: Google Gemini API (Unedited Tokens)
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDrawerOpen(true)}
                  className="gap-1.5 h-8 text-xs cursor-pointer"
                >
                  <span>Inspect evidence turn</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Production Evidence Drawer */}
      <EvidenceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        turn={activeTurn}
        project={project}
      />
    </>
  );
}
