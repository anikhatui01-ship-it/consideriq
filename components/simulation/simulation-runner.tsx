"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Cpu, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/types/database";
import { SimulationTurnResult } from "@/lib/simulation/engine";

interface SimulationRunnerProps {
  projects: Project[];
  initialProjectId?: string;
  apiEndpoint?: string;
}

type SimulationStatus = "idle" | "running" | "success" | "failed";

type SimulationStreamEvent =
  | {
      type: "started";
      simulationId: string;
      totalTurns: number;
    }
  | {
      type: "turn_completed";
      simulationId: string;
      turnIndex: number;
      stage: string;
      turn: SimulationTurnResult;
    }
  | {
      type: "turn_failed";
      simulationId: string;
      turnIndex: number;
      stage: string;
      error: string;
    }
  | {
      type: "completed";
      simulationId: string;
      metrics: {
        visibilityRate: number;
        shortlistRate: number;
        recommendationRate: number;
        eliminationRate: number;
        eliminatedAtTurn: number | null;
      };
      timings?: {
        totalDurationMs: number;
        turnDurations: { turnIndex: number; stage: string; durationMs: number }[];
      };
    }
  | {
      type: "failed";
      simulationId: string;
      errorType: string;
      error: string;
    };

const STAGES = [
  { turnIndex: 1, step: "01", name: "Discovery", desc: "Unbranded Category Search", stage: "QUESTION" },
  { turnIndex: 2, step: "02", name: "Constraints", desc: "Operational Stack Filter", stage: "CONSTRAINT" },
  { turnIndex: 3, step: "03", name: "Shortlist", desc: "Top 3 Synthesis", stage: "SHORTLIST" },
  { turnIndex: 4, step: "04", name: "Elimination", desc: "Governance & Drop Gate", stage: "ELIMINATION" },
  { turnIndex: 5, step: "05", name: "Recommendation", desc: "Winning Single Choice", stage: "RECOMMENDATION" },
];

export function SimulationRunner({ projects, initialProjectId, apiEndpoint = "/api/simulations" }: SimulationRunnerProps) {
  const router = useRouter();

  const [selectedId, setSelectedId] = React.useState<string>(
    initialProjectId || (projects[0] ? projects[0].id : "")
  );
  const [status, setStatus] = React.useState<SimulationStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [completedTurns, setCompletedTurns] = React.useState<SimulationTurnResult[]>([]);

  // Synchronous locks and references
  const isSubmittingRef = React.useRef(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const readerRef = React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];

  // Clean up interval timer, abort controller, and stream reader on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (readerRef.current) {
        readerRef.current.cancel().catch(() => {});
        readerRef.current = null;
      }
    };
  }, []);

  const handleStart = async () => {
    if (!selectedProject) return;

    // Prevent duplicate simulation invocations synchronously
    if (isSubmittingRef.current || status === "running" || status === "success") {
      return;
    }

    isSubmittingRef.current = true;
    setErrorMessage(null);
    setStatus("running");
    setElapsedSeconds(0);
    setCompletedTurns([]);

    // Start 1-second elapsed timer
    const startTime = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProject.id }),
        signal: abortController.signal,
      });

      // Handle non-OK HTTP status before streaming begins
      if (!res.ok) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        let data: { error?: string; errorType?: string; turnIndex?: number; stage?: string } = {};
        try {
          data = await res.json();
        } catch {
          // Response body was not JSON
        }

        let msg = data.error || `Simulation failed (HTTP ${res.status}).`;
        if (data.errorType === "auth") {
          msg = "Authentication session expired. Please sign in again to run simulations.";
        } else if (data.errorType === "gemini_configuration") {
          msg = "Google Gemini is not configured. Please set GEMINI_API_KEY in your server environment.";
        } else if (data.errorType === "gemini_provider") {
          msg = `Simulation failed (HTTP ${res.status}) - Gemini Provider Error${data.turnIndex ? ` at Turn ${data.turnIndex} (${data.stage})` : ""}: ${data.error}`;
        } else if (data.errorType === "database") {
          msg = `Simulation failed (HTTP ${res.status}) - Database persistence failure: Unable to save simulation records.`;
        } else if (data.errorType === "timeout" || res.status === 504) {
          msg = `Simulation failed (HTTP ${res.status}). The simulation exceeded the server execution limit or timed out.`;
        } else if (data.error) {
          msg = `Simulation failed (HTTP ${res.status}): ${data.error}`;
        }

        isSubmittingRef.current = false;
        setStatus("failed");
        setErrorMessage(msg);
        return;
      }

      if (!res.body) {
        throw new Error("No readable stream response body received from server.");
      }

      // Consume streaming NDJSON response incrementally
      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      let hasCompleted = false;

      const processEvent = (event: SimulationStreamEvent) => {
        if (event.type === "started") {
          // Stream connection established
        } else if (event.type === "turn_completed") {
          // Turn arrived from backend: append to completed turns
          setCompletedTurns((prev) => {
            if (prev.some((t) => t.turnIndex === event.turn.turnIndex)) {
              return prev;
            }
            return [...prev, event.turn];
          });
        } else if (event.type === "turn_failed") {
          console.warn("[Simulation Stream] Turn failed:", event);
          setErrorMessage(
            `Simulation alert at Turn ${event.turnIndex} (${event.stage}): ${event.error}`
          );
        } else if (event.type === "completed") {
          hasCompleted = true;

          // Stop timer immediately
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          setStatus("success");

          // Keep isSubmittingRef.current true to lock controls during transition
          setTimeout(() => {
            router.push(`/app/simulations/${event.simulationId}`);
          }, 500);
        } else if (event.type === "failed") {
          // Simulation failed mid-stream: immediately stop indicators and restore controls
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          isSubmittingRef.current = false;
          setStatus("failed");

          let msg = event.error || "Simulation encountered an unexpected failure.";
          if (event.errorType === "gemini_provider") {
            msg = `Simulation failed - AI Provider Error: ${event.error}`;
          } else if (event.errorType === "database") {
            msg = `Simulation failed - Database persistence error: ${event.error}`;
          } else if (event.errorType === "timeout") {
            msg = "Simulation timed out while awaiting AI provider response.";
          }
          setErrorMessage(msg);
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the trailing incomplete line in buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const event: SimulationStreamEvent = JSON.parse(trimmed);
              processEvent(event);
            } catch (jsonErr) {
              console.error("[Simulation Stream] JSON parse error on chunk:", trimmed, jsonErr);
            }
          }
        }

        // Parse any remaining line after stream ends
        if (buffer.trim()) {
          try {
            const event: SimulationStreamEvent = JSON.parse(buffer.trim());
            processEvent(event);
          } catch (jsonErr) {
            console.error("[Simulation Stream] JSON parse error on trailing buffer:", buffer, jsonErr);
          }
        }
      } catch (streamErr: unknown) {
        if (!hasCompleted) {
          throw streamErr;
        }
      } finally {
        readerRef.current = null;
      }
    } catch (err: unknown) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      isSubmittingRef.current = false;
      setStatus("failed");

      if (err instanceof Error && err.name === "AbortError") {
        setErrorMessage("Simulation request was cancelled. Please try again.");
      } else {
        const errorText = err instanceof Error ? err.message : "Connection failed";
        setErrorMessage(`Simulation stream interrupted: ${errorText}. Please check your connection and try again.`);
      }
    }
  };

  const currentProgressMessage =
    status === "success"
      ? "Analysis complete"
      : completedTurns.length === 0
      ? "Turn 1 running: Initial Category Discovery..."
      : completedTurns.length === 1
      ? "Turn 2 running: Operational & Workflow Constraints..."
      : completedTurns.length === 2
      ? "Turn 3 running: Comparative Shortlist Synthesis..."
      : completedTurns.length === 3
      ? "Turn 4 running: Security & Governance Elimination..."
      : completedTurns.length === 4
      ? "Turn 5 running: Final Single Recommendation..."
      : "Finalizing simulation synthesis & metrics...";

  if (!selectedProject) {
    return null;
  }

  const isLocked = status === "running" || status === "success";

  return (
    <Card className="border-border shadow-subtle">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-bold tracking-tight">
          Simulation Studio
        </CardTitle>
        <CardDescription className="text-xs">
          Select target brand project and configure multi-turn simulation parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {errorMessage && (
          <div
            className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs space-y-1.5 animate-in fade-in-0 duration-200"
            role="alert"
          >
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Simulation Execution Notice</span>
            </div>
            <p className="leading-relaxed pl-6">{errorMessage}</p>
          </div>
        )}

        {/* Project Selector if multiple */}
        {projects.length > 1 && (
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              htmlFor="projectSelect"
            >
              Select Target Brand
            </label>
            <select
              id="projectSelect"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={isLocked}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Project Summary Card */}
        <div className="p-4 rounded-lg border border-border bg-surface-elevated/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Target Brand Profile
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {selectedProject.category}
            </Badge>
          </div>

          <div>
            <h3 className="text-base font-bold text-foreground">
              {selectedProject.name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {selectedProject.website}
            </span>
          </div>

          {selectedProject.target_persona && (
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">
                Buyer Persona / ICP:
              </span>
              <p className="line-clamp-2">{selectedProject.target_persona}</p>
            </div>
          )}

          {selectedProject.competitors && selectedProject.competitors.length > 0 && (
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block mb-1">
                Monitored Competitors ({selectedProject.competitors.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedProject.competitors.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Provider Config */}
        <div className="p-4 rounded-lg border border-border bg-surface-elevated/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Provider Engine
            </span>
            <Badge variant="success" className="text-[10px] font-mono">
              Google Gemini
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              gemini-3.8-flash
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Runs 5 sequential turns: Question → Constraints → Shortlist → Elimination → Recommendation.
          </p>
        </div>

        {/* 5-Stage Preview list with Live Turn State */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Buyer Journey Progression Stages
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {STAGES.map((st) => {
              const isComplete = completedTurns.some((t) => t.turnIndex === st.turnIndex);
              const isCurrentRunning = status === "running" && completedTurns.length === st.turnIndex - 1;

              return (
                <div
                  key={st.turnIndex}
                  className={`p-2.5 rounded border text-center space-y-1 transition-all duration-300 ${
                    isComplete
                      ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200"
                      : isCurrentRunning
                      ? "border-primary/60 bg-primary/10 shadow-sm ring-1 ring-primary/30"
                      : "border-border bg-surface opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {isComplete ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrentRunning ? (
                      <Loader2 className="h-3 w-3 text-primary animate-spin" />
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">{st.step}</span>
                    )}
                    <span className="text-[10px] font-mono font-medium">
                      {isComplete ? "Done" : isCurrentRunning ? "Running" : `Turn ${st.turnIndex}`}
                    </span>
                  </div>
                  <span className="font-semibold block text-foreground truncate text-xs">{st.name}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{st.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Simulation Running Panel */}
        {status === "running" && (
          <div
            className="rounded-lg border border-primary/25 bg-surface-elevated/70 p-4 space-y-3.5 shadow-subtle animate-in fade-in-0 duration-200"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-xs font-semibold text-foreground tracking-tight">
                  Streaming Live Simulation
                </span>
              </div>

              <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground bg-surface py-0.5 px-2 border-border/80">
                Elapsed {String(elapsedSeconds).padStart(2, "0")}s
              </Badge>
            </div>

            {/* Stage description & progress rail */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" aria-hidden="true" />
                  <span>{currentProgressMessage}</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {completedTurns.length < 5
                    ? `Turn ${completedTurns.length + 1} of 5`
                    : "Finalizing metrics"}
                </span>
              </div>

              <div
                className="relative w-full h-1.5 bg-primary/15 rounded-full overflow-hidden"
                role="progressbar"
                aria-label="Simulation progression"
                aria-valuenow={Math.round((completedTurns.length / 5) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(8, (completedTurns.length / 5) * 100)}%` }}
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Streaming live consultative evaluation turns sequentially: unbranded discovery, operational stack constraints, top alternatives synthesis, governance elimination gates, and single winning recommendation.
              </p>
            </div>
          </div>
        )}

        {/* Compact Live Results Panel (Appears as turns arrive) */}
        {completedTurns.length > 0 && (
          <div
            className="rounded-lg border border-border bg-surface-elevated/60 p-4 space-y-3.5 shadow-subtle animate-in fade-in-0 duration-300"
            role="region"
            aria-label="Live simulation results"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-mono text-xs font-semibold px-2.5 py-0.5 border-primary/40 text-primary bg-primary/10"
                >
                  Completed: {completedTurns.length} / 5
                </Badge>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {completedTurns.length === 5
                    ? "All 5 buyer stages synthesized"
                    : `Turn ${completedTurns.length + 1} evaluating...`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-24 sm:w-36 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(completedTurns.length / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-medium text-foreground">
                  {Math.round((completedTurns.length / 5) * 100)}%
                </span>
              </div>
            </div>

            {/* List of completed turns (newest on top for immediate glance) */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {[...completedTurns].reverse().map((turn) => {
                const yourBrand = turn.brands?.find((b) => b.isYourBrand);
                const competitors = turn.brands?.filter((b) => !b.isYourBrand) || [];

                return (
                  <div
                    key={turn.turnIndex}
                    className="p-3.5 rounded-lg border border-border/80 bg-surface/90 space-y-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          Turn {turn.turnIndex}: {turn.title}
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono py-0 px-1.5">
                          {turn.stage}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground">
                        {turn.classification}
                      </Badge>
                    </div>

                    {/* Observed Response from Model */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Observed AI Response
                      </span>
                      <p className="text-muted-foreground text-[11px] leading-relaxed bg-surface-elevated/40 p-2.5 rounded border border-border/40 line-clamp-3">
                        {turn.observedResponse}
                      </p>
                    </div>

                    {/* Buyer-stage brand consideration status */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Stage Consideration Status
                      </span>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {yourBrand && (
                          <Badge
                            variant={
                              yourBrand.status === "recommended"
                                ? "success"
                                : yourBrand.status === "eliminated"
                                ? "danger"
                                : "default"
                            }
                            className="text-[10px] py-0.5 px-2 font-medium"
                          >
                            {yourBrand.name} (Your Brand):{" "}
                            <span className="font-mono capitalize ml-1">{yourBrand.status}</span>
                          </Badge>
                        )}

                        {competitors.slice(0, 4).map((comp, idx) => (
                          <Badge
                            key={idx}
                            variant={
                              comp.status === "recommended"
                                ? "success"
                                : comp.status === "eliminated"
                                ? "danger"
                                : "outline"
                            }
                            className="text-[10px] py-0.5 px-1.5 font-normal text-muted-foreground"
                          >
                            {comp.name}
                            <span className="font-mono text-[9px] ml-1 opacity-75">
                              ({comp.status})
                            </span>
                          </Badge>
                        ))}

                        {competitors.length > 4 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{competitors.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stage Insight */}
                    {turn.insight && (
                      <p className="text-[11px] text-foreground/80 italic border-t border-border/40 pt-1.5">
                        <span className="font-semibold not-italic text-muted-foreground text-[10px] uppercase mr-1">
                          Analysis:
                        </span>
                        {turn.insight}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success Completion State Panel */}
        {status === "success" && (
          <div
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 shadow-subtle animate-in fade-in-0 duration-200"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold tracking-tight">Analysis complete</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/40">
                Total {String(elapsedSeconds).padStart(2, "0")}s
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
              <Loader2 className="h-3 w-3 animate-spin shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Redirecting to Decision Trail...</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
          <Button asChild variant="outline" size="sm" disabled={isLocked}>
            <Link
              href="/app"
              tabIndex={isLocked ? -1 : undefined}
              className={isLocked ? "pointer-events-none opacity-50" : ""}
            >
              Cancel
            </Link>
          </Button>
          <Button
            type="button"
            onClick={handleStart}
            size="sm"
            className="gap-1.5 font-medium select-none min-w-[170px]"
            disabled={isLocked}
            aria-disabled={isLocked}
          >
            {status === "running" ? (
              <span className="inline-flex items-center justify-center gap-1.5" role="status">
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
                <span>
                  {completedTurns.length > 0
                    ? `Turn ${Math.min(5, completedTurns.length + 1)}/5 (${String(elapsedSeconds).padStart(2, "0")}s)...`
                    : `Running (${String(elapsedSeconds).padStart(2, "0")}s)...`}
                </span>
              </span>
            ) : status === "success" ? (
              <span className="inline-flex items-center justify-center gap-1.5 text-emerald-300" role="status">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Redirecting...</span>
              </span>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Start Live Simulation</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
