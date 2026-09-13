"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import GoogleButton from "@/components/shared/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/hooks/use-sign-up";

function SignUp() {
  const {
    signUpWithEmail,
    signUpWithGoogle,
    isLoading,
    error,
    resendVerificationEmail,
  } = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpWithEmail(name, email, password);
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-8 px-4 py-16 sm:px-0">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A calmer way to understand your days
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="How should we call you?"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="space-y-3">
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => resendVerificationEmail(email)}
              disabled={isLoading || !email}
            >
              Resend verification email
            </Button>
          </div>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Start free"
          )}
        </Button>
      </form>

      <div className="relative" aria-hidden="true">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or
        </span>
      </div>

      <GoogleButton
        label="Sign up with Google"
        onClick={signUpWithGoogle}
        disabled={isLoading}
      />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
