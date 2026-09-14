import {
  DayRef,
  MoodTrend,
  RuleBasedHighlights,
  RuleBasedInsightData,
} from "@/types";
import { Note } from "../generated/prisma/client";
import { Mood } from "../generated/prisma/enums";

const MOOD_SCORE: Record<Mood, number> = {
  LOW: 1,
  MEH: 2,
  OKAY: 3,
  GOOD: 4,
  GREAT: 5,
};
const MOOD_ORDER: Mood[] = ["LOW", "MEH", "OKAY", "GOOD", "GREAT"];

export function computeMoodTrend(
  scoredNotes: (Note & { mood: Mood })[],
): MoodTrend {
  if (scoredNotes.length < 4) return "insufficient_data";

  const sorted = [...scoredNotes].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const mid = Math.floor(sorted.length / 2);
  const avg = (list: typeof sorted) =>
    list.reduce((sum, n) => sum + MOOD_SCORE[n.mood], 0) / list.length;
  const diff = avg(sorted.slice(mid)) - avg(sorted.slice(0, mid));

  if (diff >= 0.5) return "improving";
  if (diff <= -0.5) return "declining";
  return "stable";
}

export function computeMoodStats(notes: Note[]) {
  const moodDistribution = {
    LOW: 0,
    MEH: 0,
    OKAY: 0,
    GOOD: 0,
    GREAT: 0,
  } as Record<Mood, number>;
  const scored = notes.filter(
    (n): n is Note & { mood: Mood } => n.mood !== null,
  );

  for (const note of scored) moodDistribution[note.mood]++;

  const averageMoodScore =
    scored.length > 0
      ? scored.reduce((sum, n) => sum + MOOD_SCORE[n.mood], 0) / scored.length
      : null;

  const dominantMood =
    MOOD_ORDER.filter((m) => moodDistribution[m] > 0).sort(
      (a, b) => moodDistribution[b] - moodDistribution[a],
    )[0] ?? null;

  return {
    moodDistribution,
    averageMoodScore,
    dominantMood,
    moodTrend: computeMoodTrend(scored),
  };
}

export function computeTagStats(
  notes: Note[],
  averageMoodScore: number | null,
) {
  const stats = new Map<
    string,
    { total: number; scoreSum: number; scoreCount: number }
  >();

  for (const note of notes) {
    const score = note.mood ? MOOD_SCORE[note.mood] : null;
    for (const tag of note.tags) {
      const entry = stats.get(tag) ?? { total: 0, scoreSum: 0, scoreCount: 0 };
      entry.total++;
      if (score !== null) {
        entry.scoreSum += score;
        entry.scoreCount++;
      }
      stats.set(tag, entry);
    }
  }

  const topTags = [...stats.entries()]
    .map(([tag, s]) => ({ tag, count: s.total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const tagCorrelations = {
    positive: [] as string[],
    negative: [] as string[],
  };
  if (averageMoodScore !== null) {
    for (const [tag, s] of stats) {
      if (s.scoreCount < 2) continue;
      const delta = s.scoreSum / s.scoreCount - averageMoodScore;
      if (delta >= 0.5) tagCorrelations.positive.push(tag);
      else if (delta <= -0.5) tagCorrelations.negative.push(tag);
    }
    tagCorrelations.positive = tagCorrelations.positive.slice(0, 2);
    tagCorrelations.negative = tagCorrelations.negative.slice(0, 2);
  }

  return { topTags, tagCorrelations };
}

export function computeConsistency(
  notes: Note[],
  periodStart: Date,
  periodEnd: Date,
) {
  const totalDays = Math.max(
    1,
    Math.ceil((periodEnd.getTime() - periodStart.getTime()) / 86_400_000),
  );
  const daysLogged = new Set(
    notes.map((n) => n.date.toISOString().slice(0, 10)),
  ).size;
  return { daysLogged, totalDays, percentage: daysLogged / totalDays };
}

export function findBestAndWorstDay(notes: Note[]) {
  const scored = notes.filter(
    (n): n is Note & { mood: Mood } => n.mood !== null,
  );
  let bestDay: DayRef | null = null;
  let worstDay: DayRef | null = null;

  for (const note of scored) {
    const score = MOOD_SCORE[note.mood];
    const ref: DayRef = {
      date: note.date.toISOString(),
      mood: note.mood,
      tags: note.tags,
    };
    if (!bestDay || score > MOOD_SCORE[bestDay.mood]) bestDay = ref;
    if (!worstDay || score < MOOD_SCORE[worstDay.mood]) worstDay = ref;
  }

  return { bestDay, worstDay };
}

export function buildSummary(
  noteCount: number,
  h: RuleBasedHighlights,
): string {
  if (noteCount === 0) return "No notes were logged this week.";

  const parts = [
    `You logged ${noteCount} note${noteCount === 1 ? "" : "s"} this week.`,
  ];
  if (h.dominantMood)
    parts.push(`Your mood was most often ${h.dominantMood.toLowerCase()}.`);
  if (h.moodTrend === "improving")
    parts.push("It trended upward as the week went on.");
  if (h.moodTrend === "declining")
    parts.push("It trended downward as the week went on.");
  if (h.topTags.length)
    parts.push(
      `Frequent themes: ${h.topTags
        .slice(0, 3)
        .map((t) => t.tag)
        .join(", ")}.`,
    );
  return parts.join(" ");
}

export function buildExperiments(h: RuleBasedHighlights): string[] {
  const experiments: string[] = [];

  if (h.moodTrend === "declining")
    experiments.push(
      "Mood dipped through the week — look at what changed midweek.",
    );
  if (h.moodTrend === "improving")
    experiments.push("Mood improved through the week — note what you changed.");
  for (const tag of h.tagCorrelations.negative)
    experiments.push(`"${tag}" tends to show up on lower-mood days.`);
  for (const tag of h.tagCorrelations.positive)
    experiments.push(`"${tag}" tends to show up on better-mood days.`);
  if (h.consistency.percentage < 0.5)
    experiments.push(
      "Logged less than half the week — try quicker, more frequent check-ins.",
    );
  if (experiments.length === 0)
    experiments.push("Keep logging — more notes will make patterns clearer.");

  return experiments;
}

export function buildRuleBasedInsightData(
  notes: Note[],
  periodStart: Date,
  periodEnd: Date,
): RuleBasedInsightData {
  const moodStats = computeMoodStats(notes);
  const { topTags, tagCorrelations } = computeTagStats(
    notes,
    moodStats.averageMoodScore,
  );
  const consistency = computeConsistency(notes, periodStart, periodEnd);
  const { bestDay, worstDay } = findBestAndWorstDay(notes);

  const highlights: RuleBasedHighlights = {
    ...moodStats,
    topTags,
    tagCorrelations,
    consistency,
    bestDay,
    worstDay,
  };

  return {
    noteCount: notes.length,
    summary: buildSummary(notes.length, highlights),
    highlights,
    themes: topTags.map((t) => t.tag),
    experiments: buildExperiments(highlights),
  };
}
