"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PenLine, Sparkles, Sun, Tags } from "lucide-react";

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

const levels = [
  { value: "low", label: "Low", tone: "bg-(--mood-soft)" },
  { value: "meh", label: "Meh", tone: "bg-(--mood-gold)/35" },
  { value: "okay", label: "Okay", tone: "bg-(--mood-gold)/60" },
  { value: "good", label: "Good", tone: "bg-(--mood-gold)" },
  { value: "great", label: "Great", tone: "bg-(--mood-rose)" },
];

const tagOptions = ["#win", "#heavy-day", "#proud", "#brain-fog", "#restful"];

export type TodayCheckIn = {
  mood?: string;
  note: string;
  tags: string[];
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

function Mood({
  value,
  onChange,
  defaultValue,
}: {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [moodInternal, setMoodInternal] = useState<string | undefined>(
    defaultValue,
  );
  const mood = value ?? moodInternal;

  const [note, setNote] = useState("");
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
  const date = now.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const selectMood = (next: string) => {
    if (onChange) onChange(next);
    else setMoodInternal(next);
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleSave = async () => {
    const data: TodayCheckIn = {
      mood,
      note,
      tags: Array.from(tags),
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

      setNote("");
      setTags(new Set());
      setDialogOpen(true);
      router.refresh();
    } catch {
      setSubmitError(
        "Something went wrong saving your note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <Sun className="size-5" />
        </span>
        <div>
          <p className="font-heading text-lg font-semibold leading-tight tracking-tight text-foreground">
            {weekday}
          </p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-balance font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How are we feeling today?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A five-second check-in — there&apos;s no wrong answer.
        </p>

        <div
          role="radiogroup"
          aria-label="Mood"
          className="mt-6 grid gap-2.5 sm:grid-cols-2"
        >
          {levels.map((level, i) => {
            const active = mood === level.value;
            return (
              <button
                key={level.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => selectMood(level.value)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                  e.preventDefault();
                  const next =
                    e.key === "ArrowDown"
                      ? levels[Math.min(i + 1, levels.length - 1)]
                      : levels[Math.max(i - 1, 0)];
                  selectMood(next.value);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-4xl border px-4 py-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-ring",
                  active
                    ? "border-(--mood-gold)/50 bg-(--mood-soft) shadow-sm"
                    : "border-border hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "size-5 shrink-0 rounded-full border border-border transition-transform",
                    level.tone,
                    active && "scale-110 animate-in zoom-in-95",
                  )}
                />
                <span
                  className={cn(
                    "text-base font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {level.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <SectionLabel icon={PenLine}>Quick note</SectionLabel>
        <textarea
          aria-label="Quick note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind? Two words counts."
          className="mt-3 w-full resize-none rounded-3xl border border-transparent bg-input/50 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
      </section>

      <section className="mt-8">
        <SectionLabel icon={Tags}>Tags</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {tagOptions.map((tag) => {
            const active = tags.has(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  active
                    ? "border-(--mood-gold)/40 bg-(--mood-soft) text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {submitError && (
        <p role="alert" className="mt-6 text-sm font-medium text-destructive">
          {submitError}
        </p>
      )}

      <Button
        size="lg"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-8 w-full"
      >
        {isSaving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <PenLine />
        )}
        {isSaving ? "Saving…" : "Create Note"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader className="gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
              <Sparkles className="size-5" />
            </span>
            <DialogTitle>Nice — that&apos;s a real check-in.</DialogTitle>
            <DialogDescription>
              Your note is saved. You don&apos;t have to organize it perfectly
              or write more today — even one honest line counts. Small entries
              add up into the patterns you&apos;re here to see.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button />}>Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Mood;