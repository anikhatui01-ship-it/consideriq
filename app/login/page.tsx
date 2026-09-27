"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/app";
  const redirectPath =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.startsWith("/\\")
      ? rawRedirect
      : "/app";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [lockoutUntil, setLockoutUntil] = React.useState<number | null>(null);

  // Synchronous lock against rapid multi-clicking
  const isSubmittingRef = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission synchronously
    if (isSubmittingRef.current || loading) {
      return;
    }

    setErrorMessage(null);

    // Check client-side brute-force lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secondsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setErrorMessage(`Too many failed attempts. Please wait ${secondsLeft} second(s) or reset your password.`);
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        isSubmittingRef.current = false;
        const nextFails = failedAttempts + 1;
        setFailedAttempts(nextFails);

        if (nextFails >= 5) {
          setLockoutUntil(Date.now() + 60000); // 60-second cooldown after 5 failed attempts
          setErrorMessage(
            "Account temporarily locked due to consecutive failed sign-in attempts. Please wait 60 seconds or reset your password."
          );
        } else {
          setErrorMessage(error.message || "Invalid email or password.");
        }
        setLoading(false);
        return;
      }

      // Reset failed attempts on success
      setFailedAttempts(0);
      setLockoutUntil(null);
      // Keep isSubmittingRef.current = true and loading = true during navigation to avoid layout shift or button flicker
      router.push(redirectPath);
    } catch {
      isSubmittingRef.current = false;
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <Logo />
      </div>

      <Card className="border-border shadow-subtle">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">Sign in to your account</CardTitle>
          <CardDescription className="text-sm">
            Access your buyer journey simulations and decision trails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div
              className="mb-4 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2 animate-in fade-in-0 duration-200"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
            <fieldset disabled={loading} className="space-y-4 border-0 p-0 m-0 disabled:cursor-not-allowed">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                  Work Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    tabIndex={loading ? -1 : undefined}
                    className={`text-xs text-primary hover:underline font-medium ${loading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 font-medium select-none"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2" role="status">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </fieldset>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          ← Back to ConsiderIQ Home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-8 text-xs text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
            <span>Loading sign in...</span>
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
