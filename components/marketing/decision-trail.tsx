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

export interface DecisionStep {
  id: string;
  stage: "QUESTION" | "CONSTRAINT" | "SHORTLIST" | "ELIMINATION" | "RECOMMENDATION";
  title: string;
  subtitle: string;
  buyerPrompt: string;
  brands: {
    name: string;
    isYourBrand?: boolean;
    status: "active" | "eliminated" | "recommended" | "candidate";
    note?: string;
  }[];
  insight: string;
  classification: "OBSERVED" | "CALCULATED" | "INFERRED";
}

const DEFAULT_STEPS: DecisionStep[] = [
  {
    id: "step-1",
    stage: "QUESTION",
    title: "Initial Category Search",
    subtitle: "Turn 1 · Broad Discovery",
    buyerPrompt:
      '"We are a 40-person engineering team looking for a modern incident response and alert routing platform. What are our top options?"',
    brands: [
      { name: "Your Brand", isYourBrand: true, status: "candidate", note: "Included in initial overview" },
      { name: "PagerDuty", status: "candidate", note: "Category benchmark" },
      { name: "Opsgenie", status: "candidate", note: "Atlassian stack reference" },
      { name: "Rootly", status: "candidate", note: "Slack-native alternative" },
      { name: "FireHydrant", status: "candidate", note: "Enterprise incident management" },
    ],
    insight:
      "All 5 candidates entered consideration on general keyword matching for modern incident response.",
    classification: "OBSERVED",
  },
  {
    id: "step-2",
    stage: "CONSTRAINT",
    title: "Constraint Introduction",
    subtitle: "Turn 2 · Operational Filter",
    buyerPrompt:
      '"Our primary chat is Slack, and we require bidirectional incident sync and bi-weekly rotation schedules without complex tiering."',
    brands: [
      { name: "Your Brand", isYourBrand: true, status: "active", note: "Matches Slack bidirectional sync" },
      { name: "PagerDuty", status: "active", note: "Standard rotation support" },
      { name: "Rootly", status: "active", note: "Strong Slack-native positioning" },
      { name: "FireHydrant", status: "active", note: "Supported" },
      { name: "Opsgenie", status: "eliminated", note: "Fewer native bi-directional Slack automation mentions" },
    ],
    insight:
      "First constraint pruned 1 competitor whose documentation showed heavier dependence on Jira/web interface.",
    classification: "OBSERVED",
  },
  {
    id: "step-3",
    stage: "SHORTLIST",
    title: "Focused Shortlist",
    subtitle: "Turn 3 · Comparative Synthesis",
    buyerPrompt:
      '"Compare the remaining candidates on pricing predictability and ease of onboarding for on-call engineers."',
    brands: [
      { name: "Your Brand", isYourBrand: true, status: "active", note: "Transparent per-user pricing praised" },
      { name: "PagerDuty", status: "active", note: "Higher enterprise tier cost noted" },
      { name: "Rootly", status: "active", note: "Fast onboarding highlighted" },
      { name: "FireHydrant", status: "eliminated", note: "Positioned as heavyweight for 40-person size" },
    ],
    insight:
      "Your brand survived into the top 3 shortlist due to clear pricing clarity in published documentation.",
    classification: "CALCULATED",
  },
  {
    id: "step-4",
    stage: "ELIMINATION",
    title: "Elimination Point",
    subtitle: "Turn 4 · Critical Governance Gate",
    buyerPrompt:
      '"Security audit requirement: Must support SCIM v2 user provisioning and FedRAMP or SOC 2 Type II with continuous controls."',
    brands: [
      { name: "Your Brand", isYourBrand: true, status: "eliminated", note: "SCIM documentation not explicitly cited in provider source corpus" },
      { name: "PagerDuty", status: "active", note: "FedRAMP & mature SCIM documented" },
      { name: "Rootly", status: "active", note: "SOC 2 Type II & Okta SCIM explicitly mentioned" },
    ],
    insight:
      "Your brand was dropped at Turn 4: The provider cited lack of visible SCIM directory synchronization specifications.",
    classification: "INFERRED",
  },
  {
    id: "step-5",
    stage: "RECOMMENDATION",
    title: "Final Recommendation",
    subtitle: "Turn 5 · Final Decision",
    buyerPrompt:
      '"Given our constraints, which single vendor should we schedule a pilot with this quarter?"',
    brands: [
      { name: "Rootly", status: "recommended", note: "Top recommendation: balance of Slack workflow & documented enterprise compliance" },
      { name: "PagerDuty", status: "active", note: "Alternate choice if legacy enterprise integrations are mandatory" },
      { name: "Your Brand", isYourBrand: true, status: "eliminated", note: "Absent from final choice" },
    ],
    insight:
      "Rootly secured the final single recommendation. The decision turned on documented compliance specifications.",
    classification: "OBSERVED",
  },
];

interface DecisionTrailProps {
  onInspectEvidence?: (step: DecisionStep) => void;
  className?: string;
}

export function DecisionTrail({ onInspectEvidence, className }: DecisionTrailProps) {
  const [activeStepId, setActiveStepId] = React.useState<string>("step-4"); // default to the crucial elimination turn

  const activeStep = DEFAULT_STEPS.find((s) => s.id === activeStepId) || DEFAULT_STEPS[3];

  const stageIcons = {
    QUESTION: HelpCircle,
    CONSTRAINT: Filter,
    SHORTLIST: ListFilter,
    ELIMINATION: AlertTriangle,
    RECOMMENDATION: Award,
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-subtle overflow-hidden text-left",
        className
      )}
      role="region"
      aria-label="Illustrative Decision Trail"
    >
      {/* Explicit Illustrative Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-surface text-[11px] font-mono border-border/80">
            Illustrative example
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Non-production scenario demonstrating how constraints reshape consideration
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <span>Turn {DEFAULT_STEPS.findIndex((s) => s.id === activeStepId) + 1} of {DEFAULT_STEPS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
        {/* Step Progression Flow (Left on Desktop) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-5 bg-surface-elevated/40 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-1">
            Buyer Decision Flow
          </p>

          <div className="space-y-1 relative" role="tablist" aria-label="Decision Trail Steps">
            {DEFAULT_STEPS.map((step) => {
              const Icon = stageIcons[step.stage];
              const isSelected = step.id === activeStepId;
              const isElimination = step.stage === "ELIMINATION";

              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => setActiveStepId(step.id)}
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
                        ? isElimination
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
                        {step.stage}
                      </span>
                      {isElimination && (
                        <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900">
                          Drop Point
                        </span>
                      )}
                    </div>
                    <div className={cn("text-sm font-medium truncate", isSelected ? "text-foreground font-semibold" : "")}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {step.subtitle}
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

        {/* Detail Panel for Active Step (Right on Desktop) */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header with Classification Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  Stage: {activeStep.stage}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {activeStep.title}
                </h3>
              </div>
              <Badge variant={activeStep.classification === "OBSERVED" ? "observed" : activeStep.classification === "CALCULATED" ? "calculated" : "inferred"}>
                {activeStep.classification}
              </Badge>
            </div>

            {/* Buyer Prompt Box */}
            <div className="rounded-lg border border-border/80 bg-muted/30 p-3.5 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                Simulated Buyer Query
              </span>
              <p className="text-sm text-foreground italic font-sans leading-relaxed">
                {activeStep.buyerPrompt}
              </p>
            </div>

            {/* Consideration Set at this turn */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Consideration Set at Turn
                </span>
                <span className="text-xs text-muted-foreground">
                  {activeStep.brands.filter((b) => b.status !== "eliminated").length} surviving of {activeStep.brands.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {activeStep.brands.map((brand, bIdx) => {
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
                        isDropped && !brand.isYourBrand && "opacity-50 line-through"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {brand.isYourBrand && (
                          <span className="h-2 w-2 rounded-full bg-accent shrink-0" title="Your tracked brand" />
                        )}
                        <span className={cn("font-medium", brand.isYourBrand ? "text-foreground font-semibold" : "text-foreground")}>
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
                        {isDropped ? (
                          <Badge variant="danger" className="text-[10px] py-0">
                            Eliminated
                          </Badge>
                        ) : isRec ? (
                          <Badge variant="success" className="text-[10px] py-0">
                            Recommended
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] py-0">
                            Retained
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Finding Insight Box */}
            <div
              className={cn(
                "p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5",
                activeStep.stage === "ELIMINATION"
                  ? "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-200"
                  : "bg-surface-elevated border-border text-foreground"
              )}
            >
              {activeStep.stage === "ELIMINATION" ? (
                <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold block mb-0.5">
                  {activeStep.stage === "ELIMINATION" ? "Critical Drop Point Insight:" : "Turn Observation:"}
                </span>
                {activeStep.insight}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Evidence backing: Provider raw response tokens logged
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInspectEvidence?.(activeStep)}
              className="gap-1.5 h-8 text-xs cursor-pointer"
            >
              <span>Inspect evidence turn</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
