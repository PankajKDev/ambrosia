"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => router.push("/"),
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message);
        },
      },
    );
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    setError(null);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });
    if (error) {
      setError(error.message || "error sending verification mail");
      return false;
    }
    return true;
  };

  const signInWithGoogle = async () => {
    setError(null);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };
  return {
    signInWithEmail,
    signInWithGoogle,
    isLoading,
    error,
    resendVerificationEmail,
  };
}
