import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CtaSectionProps {
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  primaryActionHref?: string;
}

export function CtaSection({
  title = "Ready to inspect your brand's AI consideration set?",
  description = "Join the private beta to simulate realistic buyer journeys across major AI providers and discover where your brand enters or drops from recommendations.",
  primaryActionLabel = "Join the beta",
  primaryActionHref = "/waitlist",
}: CtaSectionProps) {
  return (
    <section className="py-16 md:py-24 border-t border-border bg-surface-elevated/40">
      <Container size="default">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12 md:p-16 shadow-subtle text-center relative overflow-hidden">
          {/* Subtle grid accent */}
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"
            aria-hidden="true"
          />

          <div className="max-w-2xl mx-auto space-y-6">
            <Badge variant="outline" className="px-3 py-1 text-xs font-mono bg-background">
              Beta Access
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.15]">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2 px-6 h-12 text-base group">
                <Link href={primaryActionHref}>
                  <span>{primaryActionLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-5 h-12 text-base">
                <Link href="/how-it-works">
                  Read methodology
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                No fabricated ranking claims
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Direct access to raw AI runs
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
