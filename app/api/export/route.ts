import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [user, notes, insights] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          focusAreas: true,
          aiEnabled: true,
          isOnboarded: true,
          createdAt: true,
        },
      }),
      prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        select: {
          id: true,
          mood: true,
          content: true,
          tags: true,
          date: true,
          updatedAt: true,
        },
      }),
      prisma.weeklyInsight.findMany({
        where: { userId: session.user.id },
        orderBy: { periodStart: "desc" },
        select: {
          id: true,
          periodStart: true,
          periodEnd: true,
          summary: true,
          highlights: true,
          themes: true,
          experiments: true,
          createdAt: true,
        },
      }),
    ]);

    const exportedAt = new Date().toISOString();
    const datePart = exportedAt.slice(0, 10);
    const body = JSON.stringify({ exportedAt, user, notes, insights }, null, 2);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="ambrosia-export-${datePart}.json"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
