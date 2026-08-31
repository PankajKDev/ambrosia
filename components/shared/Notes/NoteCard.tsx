"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Trash2 } from "lucide-react";

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

const moodMeta: Record<string, { label: string; tone: string }> = {
  LOW: { label: "Low", tone: "bg-(--mood-soft)" },
  MEH: { label: "Meh", tone: "bg-(--mood-gold)/35" },
  OKAY: { label: "Okay", tone: "bg-(--mood-gold)/60" },
  GOOD: { label: "Good", tone: "bg-(--mood-gold)" },
  GREAT: { label: "Great", tone: "bg-(--mood-rose)" },
};

export type Note = {
  id: string;
  mood: string | null;
  content: string;
  tags: string[];
  date: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NoteCard({ note }: { note: Note }) {
  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const meta = note.mood ? moodMeta[note.mood] : undefined;

  const close = () => {
    setDetailOpen(false);
    setConfirming(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/note?id=${note.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setDeleting(false);
        setConfirming(false);
        return;
      }
      close();
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <>
      <article
        onClick={() => setDetailOpen(true)}
        className="flex cursor-pointer flex-col gap-3 rounded-3xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
        tabIndex={0}
        role="button"
        aria-label="Open note"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {meta ? (
            <span
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground",
                meta.tone,
              )}
            >
              <span className="size-2 rounded-full bg-current" />
              {meta.label}
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-current" />
              No mood
            </span>
          )}
          <div className="flex items-center gap-2">
            <time
              dateTime={note.date}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <CalendarDays className="size-3.5" />
              {formatDate(note.date)} · {formatTime(note.date)}
            </time>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {note.content}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <Dialog open={detailOpen} onOpenChange={(open) => {
        setDetailOpen(open);
        if (!open) setConfirming(false);
      }}>
        <DialogContent className="max-w-2xl gap-6 p-6 sm:p-8">
          <DialogHeader className="gap-3">
            <div className="flex items-center justify-between gap-3">
              {meta ? (
                <span
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground",
                    meta.tone,
                  )}
                >
                  <span className="size-2 rounded-full bg-current" />
                  {meta.label}
                </span>
              ) : (
                <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  No mood
                </span>
              )}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap justify-end gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <DialogTitle>{formatDate(note.date)}</DialogTitle>
            <DialogDescription>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDateFull(note.date)} at {formatTime(note.date)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {note.content}
          </p>

          {confirming ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-foreground">
                Delete this note? This can&apos;t be undone.
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="size-4" />
                  {deleting ? "Deleting…" : "Yes, delete"}
                </Button>
              </div>
            </div>
          ) : (
            <DialogFooter className="gap-2">
              <Button
                variant="destructive"
                onClick={() => setConfirming(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
              <DialogClose
                render={
                  <Button variant="ghost" className="w-full sm:w-auto" />
                }
              >
                Close
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
