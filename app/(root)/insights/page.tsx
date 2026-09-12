import { headers } from "next/headers";
import Link from "next/link";
import { History, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { decideInsightView } from "@/lib/insights/state";
import { getWeekFor } from "@/lib/insights/window";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import InsightCard from "@/components/shared/Insights/InsightCard";
import InsightGenerator from "@/components/shared/Insights/InsightGenerator";
import { RefreshInsightButton } from "@/components/shared/Insights/RefreshInsightButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const latest = await prisma.weeklyInsight.findFirst({
    where: { userId: session.user.id },
    orderBy: { periodStart: "desc" },
  });

  const { weekStart, weekEnd } = getWeekFor(new Date());
  const countInWeek = await prisma.note.count({
    where: { userId: session.user.id, date: { gte: weekStart, lte: weekEnd } },
  });

  const view = decideInsightView({
    latest: latest
      ? { periodStart: latest.periodStart, periodEnd: latest.periodEnd, noteCount: latest.noteCount }
      : null,
    countInWeek,
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Insights</h1>
          <p className="text-sm text-muted-foreground">Patterns from your week, at a glance.</p>
        </div>
      </header>

      {view.kind === "waiting" && (
        <div className="mt-8 flex items-start gap-3 rounded-3xl border border-border bg-muted/40 p-5" role="alert">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">Not enough notes this week</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Log at least 3 check-ins this week for a fresh insight. ({view.count}/3)
            </p>
          </div>
        </div>
      )}

      {view.kind === "ready" && <InsightGenerator hasAny={latest !== null} />}

      {latest && (
        <section className="mt-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--mood-gold)">
            <Sparkles className="size-3.5" /> Latest insight
          </p>
          <div className="mt-3">
            <InsightCard insight={latest} />
          </div>

          {view.kind === "refreshable" && <RefreshInsightButton count={view.diff} />}

          <div className="mt-4">
            <Link
              href="/insights/timeline"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              <History className="size-4" /> View full timeline
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
