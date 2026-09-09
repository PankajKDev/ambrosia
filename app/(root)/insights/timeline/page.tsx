import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import InsightCard from "@/components/shared/Insights/InsightCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InsightTimelinePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const insights = await prisma.weeklyInsight.findMany({
    where: { userId: session.user.id },
    orderBy: { periodStart: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/insights"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
      >
        <ArrowLeft className="size-4" />
        This week
      </Link>

      <header className="mt-4 flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
          <History className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Full timeline
          </h1>
          <p className="text-sm text-muted-foreground">
            Every weekly insight, newest first.
          </p>
        </div>
      </header>

      {insights.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border py-16 text-center">
          <History className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium text-foreground">
            No insights yet
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            Check in at least 3 times a week and insights will collect here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {insights.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      )}
    </div>
  );
}