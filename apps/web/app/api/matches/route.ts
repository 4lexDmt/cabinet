import { NextRequest, NextResponse } from "next/server";
import { createMatch } from "@cabinet/runtime";
import { getStore } from "@/lib/store";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { scenarioId?: string; seed?: number };
  const match = await createMatch(getStore(), body.scenarioId ?? "sevres_1956", body.seed ?? 1956);
  const nationId = Object.keys(match.world.nations).sort()[0]!;
  await setSession({ matchId: match.id, nationId });
  return NextResponse.json({ matchId: match.id, nationId });
}
