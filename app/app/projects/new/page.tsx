"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [competitors, setCompetitors] = React.useState("");
  const [targetPersona, setTargetPersona] = React.useState("");
  const [constraints, setConstraints] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    // Parse comma-separated competitors
    const competitorList = competitors
      .split(/[,;\n]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // Parse comma-separated constraints
    const constraintList = constraints
      .split(/[,;\n]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          website: website.trim(),
          category: category.trim(),
          competitors: competitorList,
          target_persona: targetPersona.trim(),
          constraints: constraintList,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create project.");
        setLoading(false);
        return;
      }

      router.push(`/app/projects/${data.project.id}`);
      router.refresh();
    } catch {
      setErrorMessage("Network error occurred while creating project.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/app/projects" className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <Card className="border-border shadow-subtle">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">Create Brand Project</CardTitle>
          <CardDescription className="text-sm">
            Define your brand parameters, competitor set, and target buyer persona for AI journey simulations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div
              className="mb-5 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Brand Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                Brand Name <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                required
                placeholder="e.g. Acme Alerting"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="website">
                Brand Website URL <span className="text-primary">*</span>
              </label>
              <Input
                id="website"
                type="url"
                required
                placeholder="https://acme.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">
                Public website domain used for grounding and reference extraction.
              </p>
            </div>

            {/* Relevant Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="category">
                Relevant Category / Market <span className="text-primary">*</span>
              </label>
              <Input
                id="category"
                required
                placeholder="e.g. Modern Incident Response & On-Call Alert Routing"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">
                The software category unbranded buyers search for during discovery.
              </p>
            </div>

            {/* Competitors */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="competitors">
                Known Competitors (comma-separated)
              </label>
              <Input
                id="competitors"
                placeholder="PagerDuty, Opsgenie, Rootly, FireHydrant"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">
                Competitors whose consideration share will be compared against your brand.
              </p>
            </div>

            {/* Buyer Persona / ICP */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="targetPersona">
                Target Buyer Persona / ICP <span className="text-primary">*</span>
              </label>
              <textarea
                id="targetPersona"
                required
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. VP of Engineering or Head of DevOps at a 50-person B2B SaaS looking for modern Slack-native on-call rotations without enterprise complexity."
                value={targetPersona}
                onChange={(e) => setTargetPersona(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">
                Specifies who the simulated buyer is, their company context, and authority level.
              </p>
            </div>

            {/* Optional Buyer Constraints */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="constraints">
                Optional Buyer Constraints (comma-separated)
              </label>
              <Input
                id="constraints"
                placeholder="e.g. SOC 2 Type II, SCIM provisioning, Slack bidirectional sync, under $40/user/mo"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                disabled={loading}
              />
              <p className="text-[11px] text-muted-foreground">
                Specific architectural, compliance, or budget filters introduced in later turns.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
              <Button asChild variant="outline" size="sm">
                <Link href="/app/projects">Cancel</Link>
              </Button>
              <Button type="submit" size="sm" className="gap-1.5 font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Save Brand Project</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
