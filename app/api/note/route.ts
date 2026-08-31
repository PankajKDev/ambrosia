import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Mood } from "@/lib/generated/prisma/enums";

type TodayCheckIn = {
  mood?: string | null;
  note: string;
  tags?: string[];
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TodayCheckIn;
  try {
    body = (await request.json()) as TodayCheckIn;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body.note !== "string" ||
    body.note.trim() === "" ||
    (body.tags !== undefined &&
      (!Array.isArray(body.tags) ||
        body.tags.some((t) => typeof t !== "string")))
  ) {
    return NextResponse.json(
      { error: "note must be a non-empty string and tags must be an array of strings" },
      { status: 400 },
    );
  }

  const value = body.mood?.toUpperCase() as Mood | undefined;
  const mood = value && value in Mood ? value : null;

  await prisma.note.create({
    data: {
      userId: session.user.id,
      mood,
      content: body.note,
      tags: body.tags ?? [],
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.note.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}