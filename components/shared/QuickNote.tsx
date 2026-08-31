"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PenLine, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TodayCheckIn } from "./Today/Mood";

const levels = [
  { value: "low", label: "Low", tone: "bg-(--mood-soft)" },
  { value: "meh", label: "Meh", tone: "bg-(--mood-gold)/35" },
  { value: "okay", label: "Okay", tone: "bg-(--mood-gold)/60" },
  { value: "good", label: "Good", tone: "bg-(--mood-gold)" },
  { value: "great", label: "Great", tone: "bg-(--mood-rose)" },
];

type QuickNoteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SectionLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <Icon className="size-4 text-(--mood-gold)" />
      {children}
    </div>
  );
}

export default function QuickNote({ open, onOpenChange }: QuickNoteProps) {
  const router = useRouter();
  const [mood, setMood] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reset = () => {
    setMood(undefined);
    setNote("");
    setSubmitError(null);
  };

  const handleSave = async () => {
    const data: TodayCheckIn = {
      mood,
      note,
      tags: ["#quick-note"],
    };

    setIsSaving(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setSubmitError(
          "Something went wrong saving your note. Please try again.",
        );
        setIsSaving(false);
        return;
      }

      reset();
      onOpenChange(false);
      router.refresh();
      setSuccessOpen(true);
    } catch {
      setSubmitError(
        "Something went wrong saving your note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg gap-5 p-5">
          <DialogHeader className="gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
              <Sun className="size-5" />
            </span>
            <DialogTitle>Quick check-in</DialogTitle>
            <DialogDescription>
              Drop a mood and a note. It&apos;ll be saved to your journal.
            </DialogDescription>
          </DialogHeader>

          <section>
            <SectionLabel icon={Sun}>Mood</SectionLabel>
            <div
              role="radiogroup"
              aria-label="Mood"
              className="mt-3 grid grid-cols-5 gap-2"
            >
              {levels.map((level) => {
                const active = mood === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMood(level.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border px-2 py-2.5 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-ring",
                      active
                        ? "border-(--mood-gold)/50 bg-(--mood-soft) shadow-sm"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full border border-border transition-transform",
                        level.tone,
                        active && "scale-110",
                      )}
                    />
                    {level.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <SectionLabel icon={PenLine}>Note</SectionLabel>
            <textarea
              aria-label="Quick note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              className="mt-2 w-full resize-none rounded-2xl border border-transparent bg-input/50 px-3 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </section>

          {submitError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter className="gap-2 pt-1">
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={reset}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <PenLine className="size-4" />
              )}
              {isSaving ? "Saving…" : "Save note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-md gap-5 p-5">
          <DialogHeader className="gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
              <Sparkles className="size-5" />
            </span>
            <DialogTitle>Saved.</DialogTitle>
            <DialogDescription>
              Your quick note is in your journal. Small check-ins still count.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button className="w-full sm:w-auto" />}>
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
