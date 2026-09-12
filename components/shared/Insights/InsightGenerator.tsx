"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "loading" | "done" | "notEnough" | "error";

export default function InsightGenerator({ hasAny }: { hasAny: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/insights", { method: "POST" });
        if (cancelled) return;

        if (res.status === 201 || res.status === 200) {
          setStatus("done");
          router.refresh();
        } else if (res.status === 400) {
          const body = await res.json().catch(() => null);
          setStatus("notEnough");
          setMessage(body?.message ?? "Not enough notes to generate an insight.");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "done") return null;

  if (status === "notEnough" && !hasAny) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-border py-16 text-center">
        <Sparkles className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-4 text-sm font-medium text-foreground">No insights yet</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          {message ??
            "Check in at least 3 times this week and your first insight will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-8 flex items-start gap-3 rounded-3xl border p-5",
        status === "notEnough"
          ? "border-border bg-muted/40"
          : "border-(--mood-gold)/40 bg-(--mood-soft)",
      )}
      role={status === "notEnough" || status === "error" ? "alert" : undefined}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
        {status === "loading" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Sparkles className="size-5" />
        )}
      </span>
      <div>
        {status === "loading" && (
          <>
            <p className="font-heading text-sm font-semibold text-foreground">
              Generating your weekly insight…
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reading your last few check-ins.
            </p>
          </>
        )}
        {status === "notEnough" && (
          <>
            <p className="font-heading text-sm font-semibold text-foreground">
              Not enough notes this week
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {message ?? "Log at least 3 check-ins this week for a fresh insight."}
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="font-heading text-sm font-semibold text-foreground">
              Couldn’t generate an insight
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong. Try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
