import * as React from "react";
import Link from "next/link";
import { Plus, FolderGit2, Globe, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/types/database";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
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
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
            Brand Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage tracked brands, website profiles, competitors, and buyer personas.
          </p>
        </div>

        <Button asChild size="sm" className="h-9 gap-1.5 font-medium text-xs">
          <Link href="/app/projects/new">
            <Plus className="h-4 w-4" />
            <span>Create Brand Project</span>
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center bg-surface-elevated/30 space-y-4">
          <div className="mx-auto rounded-full bg-muted p-3 w-fit text-muted-foreground">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-foreground">No brand projects found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create your first project with your brand name, domain, competitors, and buyer persona.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <span>{project.competitors?.length || 0} competitors</span>
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
  );
}
