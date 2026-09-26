"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { SimulationTurn, Project } from "@/lib/types/database";
import { CheckCircle2, XCircle, Users } from "lucide-react";

interface CompetitorMatrixProps {
  turns: SimulationTurn[];
  project: Project;
}

interface BrandSurvivalStats {
  name: string;
  isYourBrand: boolean;
  discovered: boolean;
  survivedConstraint: boolean;
  shortlisted: boolean;
  survivedElimination: boolean;
  recommended: boolean;
  finalStatus: "recommended" | "survived" | "eliminated";
}

export function CompetitorMatrix({ turns, project }: CompetitorMatrixProps) {
  // Aggregate brand performance across turns
  const brandMap = new Map<string, BrandSurvivalStats>();

  // Ensure tracked brand is always present
  brandMap.set(project.name.toLowerCase(), {
    name: project.name,
    isYourBrand: true,
    discovered: false,
    survivedConstraint: false,
    shortlisted: false,
    survivedElimination: false,
    recommended: false,
    finalStatus: "eliminated",
  });

  // Initialize competitors
  if (project.competitors) {
    project.competitors.forEach((comp) => {
      brandMap.set(comp.toLowerCase(), {
        name: comp,
        isYourBrand: false,
        discovered: false,
        survivedConstraint: false,
        shortlisted: false,
        survivedElimination: false,
        recommended: false,
        finalStatus: "eliminated",
      });
    });
  }

  // Populate from turns
  turns.forEach((turn) => {
    turn.brands?.forEach((b) => {
      const key = b.name.toLowerCase();
      let stats = brandMap.get(key);
      if (!stats) {
        stats = {
          name: b.name,
          isYourBrand: Boolean(b.isYourBrand || key === project.name.toLowerCase()),
          discovered: false,
          survivedConstraint: false,
          shortlisted: false,
          survivedElimination: false,
          recommended: false,
          finalStatus: "eliminated",
        };
        brandMap.set(key, stats);
      }

      if (turn.stage === "QUESTION" && b.status !== "eliminated") {
        stats.discovered = true;
      }
      if (turn.stage === "CONSTRAINT" && b.status !== "eliminated") {
        stats.survivedConstraint = true;
      }
      if (turn.stage === "SHORTLIST" && b.status !== "eliminated") {
        stats.shortlisted = true;
      }
      if (turn.stage === "ELIMINATION" && b.status !== "eliminated") {
        stats.survivedElimination = true;
      }
      if (turn.stage === "RECOMMENDATION" && b.status === "recommended") {
        stats.recommended = true;
      }
    });
  });

  // Calculate final status
  const brandList = Array.from(brandMap.values()).map((b) => {
    if (b.recommended) {
      b.finalStatus = "recommended";
    } else if (b.survivedElimination) {
      b.finalStatus = "survived";
    } else {
      b.finalStatus = "eliminated";
    }
    return b;
  });

  // Sort: Tracked brand first, then recommended, then survived, then eliminated
  brandList.sort((a, b) => {
    if (a.isYourBrand) return -1;
    if (b.isYourBrand) return 1;
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-subtle">
      <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Competitor Consideration Matrix
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Stage-by-stage candidate survival
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-mono text-[10px]">
              <th className="py-3 px-4 font-semibold">Vendor / Brand</th>
              <th className="py-3 px-3 font-semibold text-center">01 · Discovery</th>
              <th className="py-3 px-3 font-semibold text-center">02 · Constraint</th>
              <th className="py-3 px-3 font-semibold text-center">03 · Shortlist</th>
              <th className="py-3 px-3 font-semibold text-center">04 · Governance</th>
              <th className="py-3 px-3 font-semibold text-center">05 · Winner</th>
              <th className="py-3 px-4 font-semibold text-right">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brandList.map((brand, idx) => (
              <tr
                key={idx}
                className={
                  brand.isYourBrand
                    ? "bg-accent/5 dark:bg-accent/10 font-medium"
                    : "hover:bg-muted/30 transition-colors"
                }
              >
                {/* Brand Name */}
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    {brand.isYourBrand && (
                      <span className="h-2 w-2 rounded-full bg-accent shrink-0" title="Your tracked brand" />
                    )}
                    <span>{brand.name}</span>
                    {brand.isYourBrand && (
                      <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
                        You
                      </Badge>
                    )}
                  </div>
                </td>

                {/* 01: Discovery */}
                <td className="py-3.5 px-3 text-center">
                  {brand.discovered ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40 inline-block" />
                  )}
                </td>

                {/* 02: Constraint */}
                <td className="py-3.5 px-3 text-center">
                  {brand.survivedConstraint ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40 inline-block" />
                  )}
                </td>

                {/* 03: Shortlist */}
                <td className="py-3.5 px-3 text-center">
                  {brand.shortlisted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40 inline-block" />
                  )}
                </td>

                {/* 04: Governance */}
                <td className="py-3.5 px-3 text-center">
                  {brand.survivedElimination ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500 inline-block" />
                  )}
                </td>

                {/* 05: Recommendation */}
                <td className="py-3.5 px-3 text-center">
                  {brand.recommended ? (
                    <Badge variant="success" className="text-[10px] py-0 font-mono">
                      Recommended
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground/40 font-mono text-xs">—</span>
                  )}
                </td>

                {/* Final Outcome */}
                <td className="py-3.5 px-4 text-right">
                  <Badge
                    variant={
                      brand.finalStatus === "recommended"
                        ? "success"
                        : brand.finalStatus === "survived"
                        ? "secondary"
                        : "danger"
                    }
                    className="text-[10px] py-0 uppercase font-mono"
                  >
                    {brand.finalStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
