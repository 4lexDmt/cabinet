import { NextRequest, NextResponse } from "next/server";
import { advanceMatch } from "@cabinet/runtime";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "no session" }, { status: 401 });
  const result = await advanceMatch(getStore(), session.matchId, "web-advance");
  void result;
  return NextResponse.redirect(new URL("/briefing", req.url), 303);
}
