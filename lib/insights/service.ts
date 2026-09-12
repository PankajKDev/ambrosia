import { prisma } from "../prisma";
import { generateAIBasedInsight, generateRuleBasedInsight } from "./generate";
import { getWeekFor } from "./window";

const inflight = new Map<string, Promise<unknown>>();

export async function ensureInsight(opts: {
  userId: string;
  aiEnabled: boolean;
  focusAreas?: string[];
}) {
  const { weekStart, weekEnd } = getWeekFor(new Date());
  const key = `${opts.userId}:${weekStart.toISOString()}`;
  if (inflight.has(key)) return inflight.get(key) as Promise<never>;

  const p = (async () => {
    const notes = await prisma.note.findMany({
      where: { userId: opts.userId, date: { gte: weekStart, lte: weekEnd } },
      orderBy: { date: "desc" },
    });
    if (notes.length < 3) {
      const err = new Error(
        "Not enough notes to generate an insight",
      ) as Error & { status?: number };
      err.status = 400;
      throw err;
    }

    const existing = await prisma.weeklyInsight.findFirst({
      where: { userId: opts.userId, periodStart: weekStart },
    });
    if (existing && notes.length <= existing.noteCount) {
      return { unchanged: true as const, insight: existing };
    }

    const insight = opts.aiEnabled
      ? await generateAIBasedInsight({
          userId: opts.userId,
          notes,
          periodStart: weekStart,
          periodEnd: weekEnd,
          focusAreas: opts.focusAreas ?? [],
        })
      : await generateRuleBasedInsight({
          userId: opts.userId,
          notes,
          periodStart: weekStart,
          periodEnd: weekEnd,
        });

    return { unchanged: false as const, insight };
  })();

  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
}
