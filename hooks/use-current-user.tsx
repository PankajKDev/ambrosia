"use client";

import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  return { user: session?.user ?? null, isPending };
}
