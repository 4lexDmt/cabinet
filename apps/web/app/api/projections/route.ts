import { NextRequest, NextResponse } from "next/server";
import { standingLedger, visibleEvents } from "@cabinet/runtime";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "no session" }, { status: 401 });
  const match = await getStore().getMatch(session.matchId);
  if (!match) return NextResponse.json({ error: "no match" }, { status: 404 });
  const kind = req.nextUrl.searchParams.get("kind") ?? "events";
  const visible = visibleEvents(match.events, session.nationId);
  if (kind === "ledger") {
    return NextResponse.json(standingLedger(visible, session.nationId));
  }
  return NextResponse.json(visible);
}
