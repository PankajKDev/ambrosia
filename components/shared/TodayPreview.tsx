import { Sparkles } from "lucide-react";

import MoodCheckIn from "@/components/ui/mood-check-in";

function QuickNote() {
  return (
    <div aria-hidden="true">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Quick note
      </p>
      <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground">
        Morning walk felt like a reset
      </div>
    </div>
  );
}

function Suggestion() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-(--mood-soft) px-4 py-3"
    >
      <Sparkles className="size-4 shrink-0 text-(--mood-gold)" />
      <p className="text-sm text-foreground">
        Two-word check-ins count today. No perfect entries needed.
      </p>
    </div>
  );
}

function TodayPreview() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mx-auto w-full max-w-sm rounded-4xl border border-border bg-background/80 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm sm:p-6"
    >
      <div className="mb-5 flex items-baseline justify-between">
        <p className="font-heading text-lg font-semibold tracking-tight">
          Today
        </p>
        <p className="text-xs text-muted-foreground">
          Tuesday · quiet, slow
        </p>
      </div>
      <div className="space-y-5">
        <MoodCheckIn />
        <QuickNote />
        <Suggestion />
      </div>
    </div>
  );
}

export default TodayPreview;