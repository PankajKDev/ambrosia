import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const EXPORT_BATCH_SIZE = 500;

async function writePaginatedRows<T extends { id: string }>(
  fetchPage: (cursor?: string) => Promise<T[]>,
  enqueue: (value: string) => void,
) {
  let cursor: string | undefined;
  let first = true;

  while (true) {
    const batch = await fetchPage(cursor);
    if (batch.length === 0) break;

    for (const row of batch) {
      if (!first) enqueue(",");
      first = false;
      enqueue(JSON.stringify(row));
    }

    if (batch.length < EXPORT_BATCH_SIZE) break;
    cursor = batch[batch.length - 1].id;
  }
}

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

        await writePaginatedRows(
          (cursor) =>
            prisma.note.findMany({
              where: { userId: session.user.id },
              take: EXPORT_BATCH_SIZE,
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
            }),
          enqueue,
        );

        enqueue(`],"insights": [`);

        await writePaginatedRows(
          (cursor) =>
            prisma.weeklyInsight.findMany({
              where: { userId: session.user.id },
              take: EXPORT_BATCH_SIZE,
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
            }),
          enqueue,
        );

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
