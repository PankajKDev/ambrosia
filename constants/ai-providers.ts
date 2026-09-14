import "server-only";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

export const MODELS = [
  { label: "gemini-flash-latest", model: google("gemini-flash-latest") },
  { label: "groq/openai/gpt-oss-120b", model: groq("openai/gpt-oss-120b") },
  { label: "groq/openai/gpt-oss-20b", model: groq("openai/gpt-oss-20b") },
];

export const SYSTEM_PROMPT =
  "You are reviewing a week of mood/note check-ins from a wellbeing app for adults with ADHD. " +
  "Base every observation strictly on the notes provided — never invent details, and avoid clinical " +
  "or diagnostic language. Be specific: reference the actual moods, tags, or content mentioned rather " +
  "than generic advice. Keep the tone warm and non-judgmental. Respond with a single JSON object " +
  "matching the given schema.";
