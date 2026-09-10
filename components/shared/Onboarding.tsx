"use client";

import { useState } from "react";
import {
  Check,
  CloudRain,
  HeartPulse,
  Loader2,
  Moon,
  Pill,
  Repeat,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const focusAreas = [
  { value: "mood", label: "Mood", icon: HeartPulse },
  { value: "focus", label: "Focus", icon: Target },
  { value: "energy", label: "Energy", icon: Zap },
  { value: "sleep", label: "Sleep", icon: Moon },
  { value: "overwhelm", label: "Overwhelm", icon: CloudRain },
  { value: "routines", label: "Routines", icon: Repeat },
  { value: "medication", label: "Medication", icon: Pill },
];

function Onboarding() {
  const { data: session, isPending } = authClient.useSession();
  const isOnboarded = (session?.user as { isOnboarded?: boolean } | null)
    ?.isOnboarded;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const showOverlay = !isPending && !!session && !isOnboarded;

  if (!showOverlay) return null;

  const toggle = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await authClient.updateUser({
        focusAreas: Array.from(selected),
        isOnboarded: true,
      } as unknown as Parameters<typeof authClient.updateUser>[0]);
    } catch {
      setSubmitError(
        "Something went wrong saving your preferences. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto border-0 bg-transparent p-0 shadow-none"
      >
        <div className="rounded-4xl border border-border bg-background/85 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Welcome to Ambrosia.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              What would you like to better understand about your days? Pick
              any that feel relevant — you can change this later.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {focusAreas.map((area) => {
                const active = selected.has(area.value);
                return (
                  <button
                    key={area.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(area.value)}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full border py-2 pl-3 pr-4 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-ring",
                      active
                        ? "border-(--mood-gold)/40 bg-(--mood-soft) text-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full transition-colors",
                        active
                          ? "bg-(--mood-gold) text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <area.icon
                        className={cn("size-3.5", !active && "opacity-70")}
                      />
                    </span>
                    {area.label}
                    {active && (
                      <Check className="size-3.5 text-(--mood-gold)" />
                    )}
                  </button>
                );
              })}
            </div>

            {submitError && (
              <p role="alert" className="mt-4 text-sm font-medium text-destructive">
                {submitError}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {selected.size === 0
                  ? "Select at least one"
                  : `${selected.size} selected`}
              </p>
              <Button
                type="submit"
                disabled={selected.size === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Onboarding;
