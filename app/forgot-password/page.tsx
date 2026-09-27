"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const isSubmittingRef = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current || loading) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        isSubmittingRef.current = false;
        setErrorMessage(error.message || "Failed to send password reset link.");
        setLoading(false);
        return;
      }

      isSubmittingRef.current = false;
      setSuccessMessage(
        "If an account exists with this email, a secure password reset link has been sent. Please check your inbox."
      );
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
            <CardTitle className="text-xl font-bold tracking-tight">Reset your password</CardTitle>
            <CardDescription className="text-sm">
              Enter your work email address to receive a secure recovery link
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

            {successMessage && (
              <div
                className="mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2 animate-in fade-in-0 duration-200"
                role="status"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {!successMessage && (
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

                  <Button
                    type="submit"
                    className="w-full h-10 font-medium select-none"
                    disabled={loading}
                    aria-disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center justify-center gap-2" role="status">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                        <span>Sending reset link...</span>
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </fieldset>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
              Remember your password?{" "}
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
