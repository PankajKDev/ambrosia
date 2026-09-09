import { InsightMode, Note, Prisma } from "../generated/prisma/client";
import { generateAiInsightContent } from "../helpers/aibasedinsight";
import { buildRuleBasedInsightData } from "../helpers/rulebasedinsight";
import { prisma } from "../prisma";

export async function generateRuleBasedInsight({
  userId,
  notes,
  periodStart,
  periodEnd,
}: {
  userId: string;
  notes: Note[];
  periodStart: Date;
  periodEnd: Date;
}) {
  const data = buildRuleBasedInsightData(notes, periodStart, periodEnd);
  const highlights = data.highlights as unknown as Prisma.InputJsonValue;

  return prisma.weeklyInsight.upsert({
    where: { userId_periodStart: { userId, periodStart } },
    create: {
      userId,
      periodStart,
      periodEnd,
      mode: InsightMode.RULE_BASED,
      noteCount: data.noteCount,
      summary: data.summary,
      highlights,
      themes: data.themes,
      experiments: data.experiments,
    },
    update: {
      periodEnd,
      mode: InsightMode.RULE_BASED,
      noteCount: data.noteCount,
      summary: data.summary,
      highlights,
      themes: data.themes,
      experiments: data.experiments,
    },
  });
}

export async function generateAIBasedInsight({
  userId,
  notes,
  periodStart,
  periodEnd,
  focusAreas = [],
}: {
  userId: string;
  notes: Note[];
  periodStart: Date;
  periodEnd: Date;
  focusAreas?: string[];
}) {
  if (notes.length === 0) return null;

  const data = await generateAiInsightContent(notes, focusAreas);

  return prisma.weeklyInsight.upsert({
    where: { userId_periodStart: { userId, periodStart } },
    create: {
      userId,
      periodStart,
      periodEnd,
      mode: InsightMode.AI,
      noteCount: notes.length,
      summary: data.summary,
      highlights: data.highlights,
      themes: data.themes,
      experiments: data.experiments,
    },
    update: {
      periodEnd,
      mode: InsightMode.AI,
      noteCount: notes.length,
      summary: data.summary,
      highlights: data.highlights,
      themes: data.themes,
      experiments: data.experiments,
    },
  });
}
