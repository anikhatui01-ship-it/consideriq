import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, Globe, Calendar, Users, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Simulation } from "@/lib/types/database";

export default async function ProjectDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch project and simulations with strict tenant isolation
  const [projectRes, simulationsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("simulations")
      .select("*")
      .eq("project_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (projectRes.error || !projectRes.data) {
    notFound();
  }

  const project: Project = projectRes.data;
  const simulations: Simulation[] = simulationsRes.data || [];

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Back button */}
      <div>
        <Link
          href="/app/projects"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {project.category}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span>{project.website}</span>
            </a>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild size="sm" className="h-9 gap-1.5 font-medium text-xs">
            <Link href={`/app/simulations/new?projectId=${project.id}`}>
              <Play className="h-3.5 w-3.5" />
              <span>Start Simulation</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Configuration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buyer Persona / ICP */}
        <Card className="border-border shadow-subtle">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Target Buyer Persona / ICP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.target_persona ? (
              <p>{project.target_persona}</p>
            ) : (
              <p className="italic text-muted-foreground/60">No buyer persona specified.</p>
            )}
          </CardContent>
        </Card>

        {/* Monitored Competitors */}
        <Card className="border-border shadow-subtle">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Monitored Competitors ({project.competitors?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {project.competitors && project.competitors.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {project.competitors.map((comp, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs font-medium py-1 px-2.5">
                    {comp}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No competitors defined.</p>
            )}
          </CardContent>
        </Card>

        {/* Buyer Constraints */}
        <Card className="border-border shadow-subtle md:col-span-2">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Evaluation Constraints</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {project.constraints && project.constraints.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {project.constraints.map((constraint, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs py-1 px-2.5 bg-surface-elevated">
                    {constraint}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No evaluation constraints defined.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simulations History Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <span>Simulation Runs for {project.name}</span>
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {simulations.length} total run{simulations.length === 1 ? "" : "s"}
          </span>
        </div>

        {simulations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center bg-surface-elevated/30 space-y-3">
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-semibold text-foreground">No simulations run yet</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run a multi-turn simulation to inspect how Google Gemini evaluates {project.name} against {project.competitors?.length || 0} competitors.
              </p>
            </div>
            <Button asChild size="sm" className="font-medium gap-1.5 text-xs">
              <Link href={`/app/simulations/new?projectId=${project.id}`}>
                <Play className="h-3.5 w-3.5" />
                <span>Run First Simulation</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      Simulation Run
                    </span>
                    <Badge
                      variant={
                        sim.status === "completed"
                          ? "success"
                          : sim.status === "failed"
                          ? "danger"
                          : "secondary"
                      }
                      className="text-[10px] uppercase font-mono py-0"
                    >
                      {sim.status}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px] block">
                    Engine: {sim.provider} ({sim.model}) · {new Date(sim.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={`/app/simulations/${sim.id}`}>
                      View Decision Trail →
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
