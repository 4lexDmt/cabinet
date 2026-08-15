import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
import { getStore } from "@/lib/store";
import { ensurePrivateChannels } from "@cabinet/runtime";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const matchId = String(form.get("matchId"));
  const nationId = String(form.get("nationId"));
  const match = await getStore().getMatch(matchId);
  if (match && nationId && ensurePrivateChannels(match, nationId)) {
    await getStore().saveMatch(match);
  }
  await setSession({ matchId, nationId });
  return NextResponse.redirect(new URL("/briefing", req.url), 303);
}
