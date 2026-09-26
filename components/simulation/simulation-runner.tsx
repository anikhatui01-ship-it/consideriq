"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Cpu, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/types/database";

interface SimulationRunnerProps {
  projects: Project[];
  initialProjectId?: string;
}

export function SimulationRunner({ projects, initialProjectId }: SimulationRunnerProps) {
  const router = useRouter();

  const [selectedId, setSelectedId] = React.useState<string>(
    initialProjectId || (projects[0] ? projects[0].id : "")
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [currentStage, setCurrentStage] = React.useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId) || projects[0];

  const handleStart = async () => {
    if (!selectedProject) return;

    setErrorMessage(null);
    setIsRunning(true);
    setCurrentStage("Connecting to Google Gemini API...");

    try {
      setCurrentStage("Executing 5-turn buyer decision journey...");

      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProject.id }),
      });

      const data = await res.json();

      if (!res.ok) {
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
        setErrorMessage(msg);
        setIsRunning(false);
        setCurrentStage(null);
        return;
      }

      setCurrentStage("Simulation complete. Redirecting to Decision Trail...");
      router.push(`/app/simulations/${data.simulationId}`);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setErrorMessage("Simulation request timed out. Please try again.");
      } else {
        setErrorMessage("Network connection error: Unable to reach the simulation server. Please check your connection and try again.");
      }
      setIsRunning(false);
      setCurrentStage(null);
    }
  };

  if (!selectedProject) {
    return null;
  }

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
            className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs space-y-1.5"
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
              disabled={isRunning}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

        {/* 5-Stage Preview list */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Buyer Journey Progression Stages
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {[
              { step: "01", name: "Discovery", desc: "Unbranded Category Search" },
              { step: "02", name: "Constraints", desc: "Operational Stack Filter" },
              { step: "03", name: "Shortlist", desc: "Top 3 Synthesis" },
              { step: "04", name: "Elimination", desc: "Governance & Drop Gate" },
              { step: "05", name: "Recommendation", desc: "Winning Single Choice" },
            ].map((st, i) => (
              <div key={i} className="p-2.5 rounded border border-border bg-surface text-center space-y-1">
                <span className="font-mono text-[10px] text-muted-foreground block">{st.step}</span>
                <span className="font-semibold block text-foreground truncate">{st.name}</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">{st.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Display */}
        {isRunning && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-foreground flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
            <div>
              <span className="font-semibold block text-primary">Executing Simulation</span>
              <p className="text-muted-foreground text-[11px]">{currentStage}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
          <Button asChild variant="outline" size="sm" disabled={isRunning}>
            <Link href="/app">Cancel</Link>
          </Button>
          <Button
            type="button"
            onClick={handleStart}
            size="sm"
            className="gap-1.5 font-medium"
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
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
