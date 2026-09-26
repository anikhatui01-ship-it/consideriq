import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "default" | "lg";
  href?: string;
}

export function Logo({ className, iconOnly = false, size = "default", href = "/" }: LogoProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-xl",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-medium tracking-tight text-foreground transition-opacity hover:opacity-90 select-none group",
        className
      )}
      aria-label="ConsiderIQ homepage"
    >
      {/* Precision Decision Vector Icon */}
      <span className={cn("relative flex items-center justify-center rounded-md bg-foreground text-background shrink-0 p-1 shadow-subtle group-hover:bg-primary/95 transition-colors", iconSizes[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* Decision funnel paths converging into a focus node */}
          <path d="M4 4h16l-5 8v6l-6 2v-8L4 4z" strokeWidth="1.8" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
      </span>

      {!iconOnly && (
        <span className={cn("font-semibold tracking-tight text-foreground flex items-center", textSizes[size])}>
          <span>Consider</span>
          <span className="text-accent font-mono ml-0.5 tracking-normal">IQ</span>
        </span>
      )}
    </Link>
  );
}
