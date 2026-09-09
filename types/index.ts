import { Mood } from "@/lib/generated/prisma/enums";

export interface TagCount {
  tag: string;
  count: number;
}

export interface DayRef {
  date: string;
  mood: Mood;
  tags: string[];
}

export interface RuleBasedHighlights {
  moodDistribution: Record<Mood, number>;
  averageMoodScore: number | null;
  dominantMood: Mood | null;
  moodTrend: MoodTrend;
  topTags: TagCount[];
  tagCorrelations: { positive: string[]; negative: string[] };
  consistency: { daysLogged: number; totalDays: number; percentage: number };
  bestDay: DayRef | null;
  worstDay: DayRef | null;
}

export interface RuleBasedInsightData {
  noteCount: number;
  summary: string;
  highlights: RuleBasedHighlights;
  themes: string[];
  experiments: string[];
}

export type MoodTrend =
  "improving" | "declining" | "stable" | "insufficient_data";
