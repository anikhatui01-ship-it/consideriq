"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [navigating, setNavigating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Synchronous lock against rapid multi-clicking
  const isSubmittingRef = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission synchronously
    if (isSubmittingRef.current || loading || navigating) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        isSubmittingRef.current = false;
        setErrorMessage(error.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      // If user session is returned immediately (email confirmation disabled in Supabase)
      if (data.session) {
        setNavigating(true);
        router.push("/app");
        // Keep loading/navigating active while Next.js finishes navigation
        return;
      }

      // If email confirmation is required by Supabase project
      isSubmittingRef.current = false;
      setSuccessMessage("Account created. Check your email to confirm your account.");
      setLoading(false);
    } catch {
      isSubmittingRef.current = false;
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card className="border-border shadow-subtle">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight">Create your account</CardTitle>
            <CardDescription className="text-sm">
              Start modeling AI-mediated buyer decisions for your brand
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

            {successMessage ? (
              <div className="space-y-4 py-2 animate-in fade-in-0 duration-200" role="status">
                <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-bold">Account created. Check your email to confirm your account.</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-7">
                    A confirmation link was sent to <strong className="text-foreground">{email}</strong>. Once confirmed, you can sign in to access your simulations.
                  </p>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full h-10 font-medium">
                    <Link href="/login">
                      <span>Proceed to Sign In</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading || navigating}>
                <fieldset disabled={loading || navigating} className="space-y-4 border-0 p-0 m-0 disabled:cursor-not-allowed">
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
                      disabled={loading || navigating}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading || navigating}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading || navigating}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 font-medium select-none"
                    disabled={loading || navigating}
                    aria-disabled={loading || navigating}
                  >
                    {navigating ? (
                      <span className="inline-flex items-center justify-center gap-2" role="status">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                        <span>Opening ConsiderIQ...</span>
                      </span>
                    ) : loading ? (
                      <span className="inline-flex items-center justify-center gap-2" role="status">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                        <span>Creating account...</span>
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </fieldset>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
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
    </div>
  );
}
