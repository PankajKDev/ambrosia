import { MODELS, SYSTEM_PROMPT } from "@/constants/ai-providers";
import { Note } from "../generated/prisma/client";
import { z } from "zod";
import { generateText, Output } from "ai";
export function formatNotesForPrompt(notes: Note[]): string {
  return notes
    .map((n) => {
      const day = n.date.toISOString().slice(0, 10);
      const mood = n.mood ?? "unspecified";
      const tags = n.tags.length ? n.tags.join(", ") : "none";
      return `- ${day} | mood: ${mood} | tags: ${tags}\n  "${n.content}"`;
    })
    .join("\n");
}

export const insightSchema = z.object({
  summary: z
    .string()
    .describe(
      "Warm, specific 2-3 sentence summary of the week's mood and notable patterns.",
    ),
  highlights: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe(
      "Specific observations tying mood to what was actually happening — not generic advice.",
    ),
  themes: z
    .array(z.string())
    .min(1)
    .max(6)
    .describe("Short recurring topics or situations across the notes."),
  experiments: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe(
      "Small, concrete things to try next week, grounded in what showed up in the notes.",
    ),
});

export async function generateAiInsightContent(
  notes: Note[],
  focusAreas: string[] = [],
) {
  const focusBlock = focusAreas.length
    ? `\n\nThe user's focus areas: ${focusAreas.join(", ")}. Prefer observations and experiments that relate to these areas when the notes support it.`
    : "";
  const prompt = `Here are this week's notes (${notes.length} total), most recent first:\n\n${formatNotesForPrompt(notes)}${focusBlock}`;
  let lastError: unknown;

  for (const { label, model } of MODELS) {
    try {
      const { output } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt,
        output: Output.object({
          schema: insightSchema,
        }),
      });
      return output;
    } catch (err) {
      lastError = err;
      console.error(`[ai-insight] ${label} failed, trying next model`, err);
    }
  }

  throw lastError;
}
