import { auth } from "@/auth";
import {
  generateAIBasedInsight,
  generateRuleBasedInsight,
} from "@/lib/insights/generate";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const notes = await prisma.note.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  if (notes.length < 3) {
    return NextResponse.json(
      { message: "Not enough notes to generate an insight" },
      { status: 400 },
    );
  }

  const ProducedInsight = session.user.aiEnabled
    ? await generateAIBasedInsight({
        userId: session.user.id,
        notes,
        periodStart: sevenDaysAgo,
        periodEnd: today,
        focusAreas:
          (session.user as { focusAreas?: string[] }).focusAreas ?? [],
      })
    : await generateRuleBasedInsight({
        userId: session.user.id,
        notes,
        periodStart: sevenDaysAgo,
        periodEnd: today,
      });

  return NextResponse.json(
    {
      message: "success",
      insight: ProducedInsight,
    },
    { status: 201 },
  );
}
