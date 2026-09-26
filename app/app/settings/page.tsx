import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Cpu, User, LogOut } from "lucide-react";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in-0 duration-200">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Account & Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, provider settings, and data isolation preferences.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card className="border-border shadow-subtle">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Account Profile</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Your authenticated identity in ConsiderIQ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border border-border p-3 space-y-1 bg-surface-elevated/40">
              <span className="text-muted-foreground font-medium">Work Email</span>
              <p className="font-semibold text-foreground truncate">{user.email}</p>
            </div>
            <div className="rounded-lg border border-border p-3 space-y-1 bg-surface-elevated/40">
              <span className="text-muted-foreground font-medium">Account ID</span>
              <p className="font-mono text-muted-foreground truncate">{user.id}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex justify-end">
            <form action="/api/auth/signout" method="POST">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="gap-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out of account</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* AI Provider Configuration Card */}
      <Card className="border-border shadow-subtle">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span>AI Provider Architecture</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Simulation provider interfaces and model availability
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-elevated/40 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">Google Gemini</span>
                <span className="text-muted-foreground text-[11px]">
                  Default production engine for buyer decision simulations (gemini-2.5-flash)
                </span>
              </div>
              <Badge variant="success" className="text-[10px] font-mono py-0">
                Active Provider
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 text-xs opacity-70">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">OpenAI</span>
                <span className="text-muted-foreground text-[11px]">
                  Scheduled for future multi-provider milestone (GPT-4o)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                Future Provider
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 text-xs opacity-70">
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground block">Anthropic</span>
                <span className="text-muted-foreground text-[11px]">
                  Scheduled for future multi-provider milestone (Claude 3.5 Sonnet)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono py-0">
                Future Provider
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & RLS Standards */}
      <Card className="border-border shadow-subtle">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Data Isolation & Privacy Guarantee</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-2 leading-relaxed">
          <p>
            ConsiderIQ enforces strict multi-tenant Row Level Security (RLS) across all database tables. Your projects, competitors, buyer personas, and simulation transcripts can never be accessed or viewed by any other user or organization.
          </p>
          <p>
            AI provider requests are executed strictly server-side with zero browser exposure of API credentials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
