import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database, Download, FileJson, ShieldCheck } from "lucide-react";

import { auth } from "@/auth";
import { DownloadAction } from "@/components/shared/Export/DownloadAction";
import { SectionCard } from "@/components/shared/Export/SectionCard";

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <Download className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Export your data
          </h1>
          <p className="text-sm text-muted-foreground">
            Download everything Ambrosia has stored for you.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-6">
        <SectionCard
          title="What's included"
          description="One file, everything that's yours."
          icon={Database}
        >
          <ul className="space-y-3">
            <li className="flex items-start gap-3 rounded-3xl border border-border bg-background px-4 py-3.5">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(--mood-soft) text-(--mood-gold)">
                <FileJson className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Notes</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Every check-in — date, mood, content, and tags.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-3xl border border-border bg-background px-4 py-3.5">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(--mood-soft) text-(--mood-gold)">
                <Database className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Weekly insights
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Summaries, highlights, themes, and experiments — AI or
                  rule-based.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-3xl border border-border bg-background px-4 py-3.5">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(--mood-soft) text-(--mood-gold)">
                <ShieldCheck className="size-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Profile</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Name, email, focus areas, and preferences.
                </p>
              </div>
            </li>
          </ul>

          <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0 text-(--mood-gold)" />
            Private by default. This export contains only your data.
          </p>
        </SectionCard>

        <SectionCard
          title="Download"
          description="A single JSON file you can keep, back up, or take anywhere."
          icon={Download}
        >
          <DownloadAction />
        </SectionCard>
      </div>
    </div>
  );
}
