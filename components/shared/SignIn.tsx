"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/shared/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSignIn } from "@/hooks/use-sign-in";

function SignIn({ backTo }: { backTo?: string }) {
  const router = useRouter();
  const {
    signInWithEmail,
    signInWithGoogle,
    isLoading,
    error,
    resendVerificationEmail,
  } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };

  const handleForgotPassword = () => {
    router.push(backTo ?? "/forgot-password");
  };

  const handleResend = async () => {
    const sent = await resendVerificationEmail(email);
    if (sent) setResent(true);
  };

  return (
    <main className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Ambrosia" className="size-5" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to keep your gentle routine going
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

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 px-4"
              />
            </div>

            {error && (
              <div className="space-y-3">
                <p
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {error}
                </p>

                {resent ? (
                  <p className="text-sm font-medium text-muted-foreground">
                    Verification email sent
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={isLoading || !email}
                  >
                    Resend verification email
                  </Button>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative my-7" aria-hidden="true">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <GoogleButton
            label="Login with Google"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="h-11"
          />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignIn;
