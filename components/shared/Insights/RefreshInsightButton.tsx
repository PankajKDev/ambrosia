"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RefreshInsightButton({ count }: { count: number }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Failed to refresh insight");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh insight");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full sm:w-auto"
      >
        {isRefreshing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <RefreshCw className="size-4" />
        )}
        {isRefreshing
          ? "Refreshing…"
          : `Refresh insight · +${count} new note${count === 1 ? "" : "s"}`}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
