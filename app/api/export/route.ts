import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        focusAreas: true,
        aiEnabled: true,
        isOnboarded: true,
        createdAt: true,
      },
    });

    const exportedAt = new Date().toISOString();
    const datePart = exportedAt.slice(0, 10);

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enqueue = (s: string) => controller.enqueue(encoder.encode(s));

        enqueue(`{"exportedAt":${JSON.stringify(exportedAt)},"user":${JSON.stringify(user)},"notes": [`);

        let cursor: string | undefined;
        let first = true;
        while (true) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const batch: any = await prisma.note.findMany({
            where: { userId: session.user.id },
            take: 500,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: { id: "asc" },
            select: {
              id: true,
              mood: true,
              content: true,
              tags: true,
              date: true,
              updatedAt: true,
            },
          });
          if (batch.length === 0) break;
          for (const row of batch) {
            if (!first) enqueue(",");
            first = false;
            enqueue(JSON.stringify(row));
          }
          if (batch.length < 500) break;
          cursor = batch[batch.length - 1].id;
        }

        enqueue(`],"insights": [`);

        cursor = undefined;
        first = true;
        while (true) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const batch: any = await prisma.weeklyInsight.findMany({
            where: { userId: session.user.id },
            take: 500,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: { id: "asc" },
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
          });
          if (batch.length === 0) break;
          for (const row of batch) {
            if (!first) enqueue(",");
            first = false;
            enqueue(JSON.stringify(row));
          }
          if (batch.length < 500) break;
          cursor = batch[batch.length - 1].id;
        }

        enqueue(`]}`);
        controller.close();
      },
    });

    return new NextResponse(stream, {
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
