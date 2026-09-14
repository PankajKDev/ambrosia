"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-105 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Ambrosia" className="size-5" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
            Reset your password
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We&apos;ll email you a link to get back in
          </p>
        </div>

        <div className="rounded-4xl border border-border bg-background/85 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 px-4"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending link…
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
