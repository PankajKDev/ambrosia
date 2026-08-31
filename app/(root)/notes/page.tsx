import { headers } from "next/headers";
import { NotebookPen } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NoteCard, { type Note } from "@/components/shared/Notes/NoteCard";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <NotebookPen className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            Your journal, newest first.
          </p>
        </div>
      </header>

      {notes.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border py-16 text-center">
          <NotebookPen className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium text-foreground">
            No notes yet
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            Your check-ins will collect here. Start with one honest line.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={{ ...n, date: n.date.toISOString() } as Note}
            />
          ))}
        </div>
      )}
    </div>
  );
}
