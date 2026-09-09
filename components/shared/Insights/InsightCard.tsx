import { Sparkles, Cpu, Lightbulb, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WeeklyInsight } from "@/lib/generated/prisma/client";
import type { RuleBasedHighlights } from "@/types";

function formatPeriod(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

function RuleHighlights({ h }: { h: RuleBasedHighlights }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {h.dominantMood && (
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Dominant mood
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {h.dominantMood.toLowerCase()}
          </p>
        </div>
      )}
      {h.moodTrend !== "insufficient_data" && (
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Trend</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {h.moodTrend}
          </p>
        </div>
      )}
      {h.topTags.length > 0 && (
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Top tags</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {h.topTags.map((t) => (
              <span
                key={t.tag}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground"
              >
                {t.tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {h.bestDay && (
        <div className="rounded-2xl bg-muted px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Best day</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {new Date(h.bestDay.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}{" "}
            · {h.bestDay.mood.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}

export default function InsightCard({ insight }: { insight: WeeklyInsight }) {
  const isAi = insight.mode === "AI";

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-2xl",
              isAi ? "bg-(--mood-soft) text-(--mood-gold)" : "bg-muted text-muted-foreground",
            )}
          >
            {isAi ? <Sparkles className="size-5" /> : <Cpu className="size-5" />}
          </span>
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {formatPeriod(insight.periodStart, insight.periodEnd)}
            </h3>
            <p className="text-xs text-muted-foreground">
              {insight.noteCount} note{insight.noteCount === 1 ? "" : "s"} ·{" "}
              {isAi ? "AI insight" : "Summary"}
            </p>
          </div>
        </div>
      </div>

      {insight.summary && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {insight.summary}
        </p>
      )}

      {insight.themes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {insight.themes.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {isAi ? (
        Array.isArray(insight.highlights) && insight.highlights.length > 0 ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <List className="size-4 text-(--mood-gold)" /> Highlights
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              {(insight.highlights as string[]).map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null
      ) : (
        <RuleHighlights h={insight.highlights as unknown as RuleBasedHighlights} />
      )}

      {insight.experiments.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lightbulb className="size-4 text-(--mood-gold)" /> Things to try
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            {insight.experiments.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
