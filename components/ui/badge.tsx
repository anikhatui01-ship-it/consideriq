import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "border-border text-foreground",
        accent:
          "border-accent/20 bg-accent/10 text-accent font-semibold",
        success:
          "border-emerald-600/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        warning:
          "border-amber-600/20 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        danger:
          "border-rose-600/20 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
        info:
          "border-sky-600/20 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
        observed:
          "border-slate-300 bg-slate-100 text-slate-800 uppercase tracking-wider text-[10px] font-semibold dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        calculated:
          "border-blue-200 bg-blue-50 text-blue-700 uppercase tracking-wider text-[10px] font-semibold dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
        inferred:
          "border-amber-300/80 bg-amber-50 text-amber-900 uppercase tracking-wider text-[10px] font-semibold dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
