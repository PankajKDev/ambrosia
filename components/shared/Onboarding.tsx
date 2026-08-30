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
import { Input } from "@/components/ui/input";
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

function Progress({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6 flex items-center gap-2" aria-hidden="true">
      <span className="text-xs font-medium text-muted-foreground">
        Step {step} of 2
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-(--mood-gold) transition-all duration-500"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>
    </div>
  );
}

function Onboarding() {
  const { data: session, isPending } = authClient.useSession();
  const isOnboarded = (session?.user as { isOnboarded?: boolean } | null)
    ?.isOnboarded;

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isPending) return null;
  if (isOnboarded) return null;

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
    if (reminderEnabled && reminderTime === "") return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await authClient.updateUser({
        focusAreas: Array.from(selected),
        reminderEnabled,
        reminderTime: reminderEnabled ? reminderTime : null,
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

  const continueStep = () => {
    if (selected.size > 0) setStep(2);
  };

  return (
    <main className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-105 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
        </div>

        <div className="rounded-4xl border border-border bg-background/85 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-8">
          <Progress step={step} />

          {step === 1 ? (
            <div>
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

              <div className="mt-7 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selected.size === 0
                    ? "Select at least one"
                    : `${selected.size} selected`}
                </p>
                <Button
                  type="button"
                  onClick={continueStep}
                  disabled={selected.size === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  ← Back
                </button>
                <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Set a gentle reminder
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A daily nudge to check in — no streak pressure, and you can
                  turn it off whenever.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  aria-pressed={!reminderEnabled}
                  onClick={() => setReminderEnabled(false)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-3xl border px-4 py-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-ring",
                    !reminderEnabled
                      ? "border-(--mood-gold)/40 bg-(--mood-soft)"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      No reminder
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Just open Ambrosia when it feels right
                    </span>
                  </span>
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                      !reminderEnabled
                        ? "border-(--mood-gold) bg-(--mood-gold)"
                        : "border-border",
                    )}
                  >
                    {!reminderEnabled && (
                      <Check className="size-3 text-background" />
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={reminderEnabled}
                  onClick={() => setReminderEnabled(true)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-3xl border px-4 py-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-ring",
                    reminderEnabled
                      ? "border-(--mood-gold)/40 bg-(--mood-soft)"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      Set a daily reminder
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      A gentle nudge at a time that suits you
                    </span>
                  </span>
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                      reminderEnabled
                        ? "border-(--mood-gold) bg-(--mood-gold)"
                        : "border-border",
                    )}
                  >
                    {reminderEnabled && (
                      <Check className="size-3 text-background" />
                    )}
                  </span>
                </button>
              </div>

              {reminderEnabled && (
                <div>
                  <label
                    htmlFor="reminder-time"
                    className="mb-2 flex items-center gap-2 text-sm font-medium"
                  >
                    Daily reminder time
                  </label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              )}

              {submitError && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {submitError}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Onboarding;
