import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureBlockProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  details?: string[];
  className?: string;
}

export function FeatureBlock({
  icon: Icon,
  badge,
  title,
  description,
  details,
  className,
}: FeatureBlockProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 sm:p-7 shadow-subtle hover:border-border/80 transition-colors flex flex-col justify-between space-y-4",
        className
      )}
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="rounded-lg bg-muted p-2.5 text-foreground inline-flex">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          {badge && (
            <Badge variant="outline" className="text-[11px] font-mono">
              {badge}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {details && details.length > 0 && (
        <div className="pt-4 border-t border-border/60">
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {details.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
