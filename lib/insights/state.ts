import { getWeekFor } from "./window";

export type InsightView =
  | { kind: "waiting"; count: number; weekStart: Date; weekEnd: Date }
  | { kind: "ready"; count: number; weekStart: Date; weekEnd: Date }
  | { kind: "refreshable"; diff: number; count: number; weekStart: Date; weekEnd: Date }
  | { kind: "current"; count: number; weekStart: Date; weekEnd: Date };

type Latest = { periodStart: Date; periodEnd: Date; noteCount: number } | null;

// pure, DB-free — inject counts/rows from caller
export function decideInsightView(opts: {
  latest: Latest;
  countInWeek: number;
  now?: Date;
}): InsightView {
  const now = opts.now ?? new Date();
  const { weekStart, weekEnd } = getWeekFor(now);
  const count = opts.countInWeek;
  const latest = opts.latest;

  if (!latest) {
    return count < 3
      ? { kind: "waiting", count, weekStart, weekEnd }
      : { kind: "ready", count, weekStart, weekEnd };
  }

  const isCurrentWeek = latest.periodStart.getTime() === weekStart.getTime();
  if (!isCurrentWeek) {
    return count < 3
      ? { kind: "waiting", count, weekStart, weekEnd }
      : { kind: "ready", count, weekStart, weekEnd };
  }

  // current week exists
  if (count < 3) return { kind: "waiting", count, weekStart, weekEnd };
  if (count > latest.noteCount)
    return { kind: "refreshable", diff: count - latest.noteCount, count, weekStart, weekEnd };
  return { kind: "current", count, weekStart, weekEnd };
}
