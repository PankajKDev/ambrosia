import { auth } from "@/auth";
import { ensureInsight } from "@/lib/insights/service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ensureInsight({
      userId: session.user.id,
      aiEnabled: Boolean((session.user as { aiEnabled?: boolean }).aiEnabled),
      focusAreas: (session.user as { focusAreas?: string[] }).focusAreas ?? [],
    });

    if (result.unchanged) {
      return NextResponse.json(
        { message: "up to date", insight: result.insight },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { message: "success", insight: result.insight },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to generate insight";
    const status = (e as { status?: number }).status ?? 500;
    if (status === 400)
      return NextResponse.json({ message: msg }, { status: 400 });
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
