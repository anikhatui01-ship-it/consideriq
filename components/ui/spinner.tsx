import * as React from "react";
import { Loader2, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends LucideProps {
  className?: string;
}

/**
 * Dedicated ConsiderIQ Loading Spinner
 *
 * Uses GPU-accelerated CSS transform rotation (0.85s linear continuous)
 * with an accessible gentle opacity pulse fallback under prefers-reduced-motion.
 * Avoids layout shifts, width/height changes, and JavaScript frame polling.
 */
export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn("consideriq-spinner shrink-0 select-none", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
