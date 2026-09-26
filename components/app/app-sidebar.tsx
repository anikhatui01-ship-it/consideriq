"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Play,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/projects", label: "Projects", icon: FolderGit2 },
  { href: "/app/simulations/new", label: "New Simulation", icon: Play },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  userEmail: string;
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ userEmail, className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col justify-between w-64 border-r border-border bg-surface shrink-0 h-full",
        className
      )}
    >
      <div className="flex flex-col space-y-6 p-4">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 pt-1">
          <Logo href="/app" />
          <ThemeToggle />
        </div>

        {/* Primary Action Button */}
        <Button asChild size="sm" className="w-full justify-center gap-1.5 h-9 font-medium shadow-subtle">
          <Link href="/app/projects/new" onClick={onNavigate}>
            <Plus className="h-4 w-4" />
            <span>New Brand Project</span>
          </Link>
        </Button>

        {/* Navigation items */}
        <nav className="space-y-1">
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Sign Out */}
      <div className="p-4 border-t border-border space-y-3 bg-surface-elevated/40">
        <div className="px-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
            Signed in as
          </span>
          <span className="text-xs font-medium text-foreground truncate block" title={userEmail}>
            {userEmail}
          </span>
        </div>

        <form action="/api/auth/signout" method="POST">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
