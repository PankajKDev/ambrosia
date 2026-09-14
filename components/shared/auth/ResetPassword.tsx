"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

type ResetPasswordProps = {
  token?: string;
  initialError?: string;
};

function ResetPassword({ token, initialError }: ResetPasswordProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing or invalid.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(resetError.message ?? "Unable to reset your password.");
        return;
      }

      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4 py-16">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-105 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
        />

        <div className="w-full max-w-md text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
            Password updated
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been reset. You can now sign in with your new
            password.
          </p>
          <Button
            type="button"
            className="mt-8 h-11 w-full text-base"
            onClick={() => router.push("/sign-in")}
          >
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  const hasInvalidLink = !token || Boolean(initialError);

  return (
    <main className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-105 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <KeyRound className="size-5" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
            Choose a new password
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use a password you haven&apos;t used before
          </p>
        </div>

        <div className="rounded-4xl border border-border bg-background/85 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-9">
          {hasInvalidLink ? (
            <div className="space-y-5 text-center">
              <p role="alert" className="text-sm font-medium text-destructive">
                This reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                  className="h-11 px-4"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isLoading}
                  className="h-11 px-4"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Updating password…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
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

export default ResetPassword;
