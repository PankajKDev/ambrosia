"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setError(null);
    await authClient.signUp.email(
      { name, email, password },
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

  const signUpWithGoogle = async () => {
    setError(null);
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  return {
    signUpWithEmail,
    signUpWithGoogle,
    isLoading,
    error,
  };
}
