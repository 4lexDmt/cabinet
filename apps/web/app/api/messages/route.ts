import { NextRequest, NextResponse } from "next/server";
import { postCable } from "@cabinet/runtime";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.nationId) return NextResponse.json({ error: "no session" }, { status: 401 });
  const form = await req.formData();
  const channelId = String(form.get("channelId"));
  const quoteRaw = String(form.get("quoteOf") ?? "").trim();
  await postCable(
    getStore(),
    session.matchId,
    session.nationId,
    channelId,
    String(form.get("body")),
    quoteRaw || null,
  );
  const to = new URL("/channels", req.url);
  to.searchParams.set("ch", channelId);
  return NextResponse.redirect(to, 303);
}
