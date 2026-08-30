"use client";

import { authClient } from "@/lib/auth-client";

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  if (isPending || !session) return null;
  return <>{children}</>;
}
