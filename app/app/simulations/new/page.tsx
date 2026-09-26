import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Project } from "@/lib/types/database";
import { SimulationRunner } from "@/components/simulation/simulation-runner";

export const metadata = {
  title: "New Simulation",
};

export default async function NewSimulationPage(props: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: projectsRes } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const projects: Project[] = projectsRes || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/app" className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="border-b border-border pb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Simulation Studio
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
          Run Multi-Turn Buyer Simulation
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Simulate a 5-stage procurement dialogue to observe where your brand enters, survives, or gets eliminated.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-border p-8 text-center bg-surface-elevated/30">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">No brand project configured yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You must configure a brand project with your website, category, and competitors before starting a simulation.
            </p>
            <Button asChild size="sm" className="gap-1.5 font-medium">
              <Link href="/app/projects/new">
                <Plus className="h-4 w-4" />
                <span>Create Brand Project</span>
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <SimulationRunner projects={projects} initialProjectId={projectId} />
      )}
    </div>
  );
}
