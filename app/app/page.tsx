import * as React from "react";
import Link from "next/link";
import { Plus, Play, FolderGit2, Cpu, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Simulation } from "@/lib/types/database";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch projects and recent simulations in parallel
  const [projectsRes, simulationsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("simulations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const projects: Project[] = projectsRes.data || [];
  const simulations: Simulation[] = simulationsRes.data || [];

  const totalCompetitors = projects.reduce(
    (acc, p) => acc + (p.competitors?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            Buyer Journey Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track where AI recommendation models discover, shortlist, or eliminate your brand.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-medium">
            <Link href="/app/projects/new">
              <Plus className="h-3.5 w-3.5" />
              <span>New Brand Project</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="h-9 gap-1.5 text-xs font-medium">
            <Link href="/app/simulations/new">
              <Play className="h-3.5 w-3.5" />
              <span>Run Simulation</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-subtle border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Tracked Brands
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {projects.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            {projects.length === 0 ? "No brand projects yet" : "Active brand profiles"}
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Monitored Competitors
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalCompetitors}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Across all defined buyer categories
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Simulations Run
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {simulations.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Multi-turn buyer decision runs
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-border">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Primary AI Engine
            </CardDescription>
            <div className="flex items-center gap-1.5 mt-1">
              <Cpu className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Google Gemini
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            v0.1 Provider Engine (Isolated)
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-primary" />
            <span>Brand Projects</span>
          </h2>
          {projects.length > 0 && (
            <Link
              href="/app/projects"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>View all projects</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center bg-surface-elevated/30 space-y-4">
            <div className="mx-auto rounded-full bg-muted p-3 w-fit text-muted-foreground">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-semibold text-foreground">No brand projects yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Add your brand name, target website, competitors, and buyer persona to start modeling AI buyer decisions.
              </p>
            </div>
            <Button asChild size="sm" className="font-medium gap-1.5">
              <Link href="/app/projects/new">
                <Plus className="h-4 w-4" />
                <span>Create Brand Project</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="border-border shadow-subtle hover:border-border/80 transition-colors flex flex-col justify-between"
              >
                <CardHeader className="p-5 pb-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">
                        {project.name}
                      </CardTitle>
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5 truncate max-w-[200px]"
                      >
                        <Globe className="h-3 w-3 shrink-0" />
                        <span className="truncate">{project.website.replace(/^https?:\/\//, "")}</span>
                      </a>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                      {project.category}
                    </Badge>
                  </div>

                  {project.target_persona && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                      <strong>ICP:</strong> {project.target_persona}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="text-xs text-muted-foreground border-t border-border pt-3 flex items-center justify-between">
                    <span>{project.competitors?.length || 0} competitors tracked</span>
                    <span className="font-mono text-[10px]">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
                      <Link href={`/app/projects/${project.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-full text-xs h-8 gap-1">
                      <Link href={`/app/simulations/new?projectId=${project.id}`}>
                        <Play className="h-3 w-3" />
                        <span>Simulate</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Simulations Section */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <span>Recent Simulations</span>
        </h2>

        {simulations.length === 0 ? (
          <div className="rounded-xl border border-border p-6 bg-surface text-center text-xs sm:text-sm text-muted-foreground space-y-2">
            <p>No simulations executed yet.</p>
            <p className="text-xs text-muted-foreground/80">
              Select a brand project and run a multi-turn simulation to inspect your Decision Trail.
            </p>
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
                    ID: {sim.id.slice(0, 8)} · Engine: {sim.provider} ({sim.model}) · {new Date(sim.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {sim.status === "completed" && (
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Shortlist: {sim.shortlist_rate !== null ? `${sim.shortlist_rate}%` : "—"}
                      </span>
                    </div>
                  )}
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

      {/* Trust & Integrity Callout */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-foreground">
            Strict Multi-Tenancy & Integrity Standard:
          </span>
          <p>
            Your projects and simulation data are isolated by cryptographic user identity and protected by database Row Level Security. Outputs represent real, unedited AI model executions.
          </p>
        </div>
      </div>
    </div>
  );
}
