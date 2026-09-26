import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Cpu,
  Calendar,
  ShieldCheck,
  Compass,
  AlertTriangle,
  Layers,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Simulation, SimulationTurn, Project } from "@/lib/types/database";
import { DecisionTrail } from "@/components/simulation/decision-trail";
import { CompetitorMatrix } from "@/components/simulation/competitor-matrix";

export default async function SimulationResultPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch simulation with ownership check
  const { data: simulationRes, error: simError } = await supabase
    .from("simulations")
    .select("*, projects(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (simError || !simulationRes) {
    notFound();
  }

  const simulation: Simulation & { projects: Project } = simulationRes;
  const project: Project = simulation.projects;

  // 2. Fetch turns ordered by turn_index
  const { data: turnsRes } = await supabase
    .from("simulation_turns")
    .select("*")
    .eq("simulation_id", id)
    .eq("user_id", user.id)
    .order("turn_index", { ascending: true });

  const turns: SimulationTurn[] = turnsRes || [];

  // Compute key diagnostic facts from real turns
  const appearedTurns = turns.filter((t) =>
    t.brands?.some((b) => b.isYourBrand && b.status !== "eliminated")
  );
  const eliminationTurn = turns.find((t) =>
    t.brands?.some((b) => b.isYourBrand && b.status === "eliminated")
  );
  const recommendedTurn = turns.find((t) =>
    t.brands?.some((b) => b.isYourBrand && b.status === "recommended")
  );
  const winningBrand = turns[turns.length - 1]?.brands?.find(
    (b) => b.status === "recommended"
  );
  const survivingCompetitors = Array.from(
    new Set(
      turns[turns.length - 1]?.brands
        ?.filter((b) => !b.isYourBrand && b.status !== "eliminated")
        .map((b) => b.name) || []
    )
  );

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200 pb-12">
      {/* Back button */}
      <div>
        <Link
          href={`/app/projects/${project.id}`}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {project.name} Project</span>
        </Link>
      </div>

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Simulation Results: {project.name}
            </h1>
            <Badge
              variant={
                simulation.status === "completed"
                  ? "success"
                  : simulation.status === "failed"
                  ? "danger"
                  : "secondary"
              }
              className="text-xs font-mono uppercase"
            >
              {simulation.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span>
                Engine: {simulation.provider} ({simulation.model})
              </span>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              <span>Executed {new Date(simulation.created_at).toLocaleDateString()}</span>
            </span>
            <span className="font-mono text-muted-foreground">
              Category: {project.category}
            </span>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-medium">
          <Link href={`/app/simulations/new?projectId=${project.id}`}>
            <Play className="h-3.5 w-3.5" />
            <span>Re-run Simulation</span>
          </Link>
        </Button>
      </div>

      {simulation.status === "failed" ? (
        <Card className="border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-destructive">
                Simulation Execution Could Not Complete
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {simulation.error_message ||
                  "The AI provider request failed. Please verify provider credentials and try again."}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/app/simulations/new?projectId=${project.id}`}>
                    Re-run Simulation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* EXECUTIVE SUMMARY BANNER (Signal before detail) */}
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-subtle space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block">
              Core Journey Diagnostic
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {recommendedTurn
                ? `${project.name} was selected as the final winning recommendation.`
                : eliminationTurn
                ? `${project.name} entered consideration but was eliminated at Turn ${eliminationTurn.turn_index} (${eliminationTurn.stage}).`
                : `${project.name} maintained visibility across the evaluated procurement stages.`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {eliminationTurn
                ? `Elimination occurred when the buyer introduced: "${eliminationTurn.buyer_prompt.slice(0, 140)}...". ${
                    winningBrand ? `${winningBrand.name} was favored for the final recommendation.` : ""
                  }`
                : `The evaluation demonstrated continuous consideration across all 5 procurement stages against ${
                    project.competitors?.length || 0
                  } monitored competitors.`}
            </p>
          </div>

          {/* PRIMARY SUMMARY METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border shadow-subtle">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs uppercase font-mono tracking-wider">
                  AI Visibility Rate
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {simulation.visibility_rate !== null ? `${simulation.visibility_rate}%` : "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
                Presence in {appearedTurns.length} of {turns.length} evaluation turns
              </CardContent>
            </Card>

            <Card className="border-border shadow-subtle">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs uppercase font-mono tracking-wider">
                  Shortlist Rate
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {simulation.shortlist_rate !== null ? `${simulation.shortlist_rate}%` : "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
                {simulation.shortlist_rate === 100
                  ? "Retained in Turn 3 comparative shortlist"
                  : "Excluded from Turn 3 shortlist"}
              </CardContent>
            </Card>

            <Card className="border-border shadow-subtle">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs uppercase font-mono tracking-wider">
                  Final Recommendation
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {simulation.recommendation_rate !== null ? `${simulation.recommendation_rate}%` : "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
                {winningBrand ? `Winner: ${winningBrand.name}` : "No single choice selected"}
              </CardContent>
            </Card>

            <Card className="border-border shadow-subtle">
              <CardHeader className="p-4 pb-1">
                <CardDescription className="text-xs uppercase font-mono tracking-wider">
                  Elimination Rate
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {simulation.elimination_rate !== null ? `${simulation.elimination_rate}%` : "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
                {eliminationTurn ? `Dropped at Turn ${eliminationTurn.turn_index}` : "Survived all gates"}
              </CardContent>
            </Card>
          </div>

          {/* CORE DIAGNOSTIC QUADRANT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. WHERE YOU APPEARED */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Where You Appeared</span>
                </div>
                {appearedTurns.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {appearedTurns.map((turn) => (
                      <div
                        key={turn.id}
                        className="p-2.5 rounded border border-border bg-surface-elevated/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground font-mono">
                            Turn {turn.turn_index} · {turn.stage}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            Candidate
                          </Badge>
                        </div>
                        <p className="text-muted-foreground italic line-clamp-1">
                          &quot;{turn.buyer_prompt}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    {project.name} was not identified in the unbranded search turns.
                  </p>
                )}
              </div>
            </div>

            {/* 2. WHERE YOU WERE ELIMINATED */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Where You Were Eliminated</span>
                </div>
                {eliminationTurn ? (
                  <div className="p-3.5 rounded-lg border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        Turn {eliminationTurn.turn_index} ({eliminationTurn.stage})
                      </span>
                      <Badge variant="danger" className="text-[10px]">
                        Drop Point
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {eliminationTurn.insight ||
                        `Eliminated during Turn ${eliminationTurn.turn_index} constraint evaluation.`}
                    </p>
                    <div className="pt-1 text-[11px] font-mono text-muted-foreground border-t border-border">
                      Trigger Requirement: &quot;{eliminationTurn.buyer_prompt.slice(0, 90)}...&quot;
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-emerald-200/60 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-xs text-muted-foreground space-y-1">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 block">
                      No Elimination Detected
                    </span>
                    <p>{project.name} survived all evaluation filters into the final round.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. WHO SURVIVED */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Who Survived</span>
                </div>
                {survivingCompetitors.length > 0 || winningBrand ? (
                  <div className="space-y-1.5 pt-1">
                    {winningBrand && (
                      <div className="p-2.5 rounded border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900 text-xs flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {winningBrand.name} {winningBrand.isYourBrand && "(You)"}
                        </span>
                        <Badge variant="success" className="text-[10px]">
                          Winning Choice
                        </Badge>
                      </div>
                    )}
                    {survivingCompetitors.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded border border-border bg-surface text-xs flex items-center justify-between"
                      >
                        <span className="text-foreground">{comp}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          Surviving Candidate
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No competitors survived all elimination filters.
                  </p>
                )}
              </div>
            </div>

            {/* 4. WHY THE DECISION CHANGED */}
            <div className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-subtle flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    <span>Why The Decision Changed</span>
                  </div>
                  <Badge variant="inferred" className="text-[10px]">
                    Inferred Diagnostic
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {eliminationTurn?.insight ||
                    turns[turns.length - 1]?.insight ||
                    `The model favored vendors whose public documentation and feature specifications aligned with the buyer's explicit constraints.`}
                </p>
                <div className="pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>Analytical interpretation grounded in unedited Gemini response tokens.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURE DECISION TRAIL COMPONENT */}
          <div className="space-y-3 pt-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                Signature Intelligence
              </span>
              <h2 className="text-xl font-bold text-foreground mt-0.5">
                Multi-Turn Buyer Decision Trail™
              </h2>
              <p className="text-xs text-muted-foreground">
                Inspect how consideration shifted turn-by-turn. Click any stage to reveal the active consideration set and unedited response.
              </p>
            </div>

            <DecisionTrail turns={turns} project={project} />
          </div>

          {/* COMPETITOR CONSIDERATION MATRIX */}
          <div className="space-y-3 pt-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                Head-to-Head Comparison
              </span>
              <h2 className="text-xl font-bold text-foreground mt-0.5">
                Stage-by-Stage Competitor Survival
              </h2>
              <p className="text-xs text-muted-foreground">
                Compare survival rates against each competitor across all 5 procurement gates.
              </p>
            </div>

            <CompetitorMatrix turns={turns} project={project} />
          </div>
        </>
      )}

      {/* TRUST & IMMUTABILITY FOOTER */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">
            ConsiderIQ Empirical Standard:
          </span>
          <p>
            Metrics and consideration states are calculated directly from Google Gemini API outputs. Provider responses and timestamps are stored immutably.
          </p>
        </div>
      </div>
    </div>
  );
}
