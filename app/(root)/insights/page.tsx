import { headers } from "next/headers";
import Link from "next/link";
import { History, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import InsightCard from "@/components/shared/Insights/InsightCard";
import InsightGenerator from "@/components/shared/Insights/InsightGenerator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const latest = await prisma.weeklyInsight.findFirst({
    where: { userId: session.user.id },
    orderBy: { periodStart: "desc" },
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const hasThisWeek = latest ? latest.createdAt >= sevenDaysAgo : false;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            Patterns from your week, at a glance.
          </p>
        </div>
      </header>

      {!hasThisWeek && <InsightGenerator hasAny={latest !== null} />}

      {latest && (
        <section className="mt-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--mood-gold)">
            <Sparkles className="size-3.5" /> Latest insight
          </p>
          <div className="mt-3">
            <InsightCard insight={latest} />
          </div>

          <div className="mt-4">
            <Link
              href="/insights/timeline"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              <History className="size-4" />
              View full timeline
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}