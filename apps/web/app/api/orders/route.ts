import { NextRequest, NextResponse } from "next/server";
import { enqueueOrder } from "@cabinet/runtime";
import type { Order, OrderKind, Pact } from "@cabinet/sim";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.nationId) return NextResponse.json({ error: "no session" }, { status: 401 });
  const store = getStore();
  const match = await store.getMatch(session.matchId);
  if (!match) return NextResponse.json({ error: "no match" }, { status: 404 });

  const contentType = req.headers.get("content-type") ?? "";
  let kind: OrderKind;
  let payload: Record<string, unknown> = {};
  if (contentType.includes("application/json")) {
    const body = (await req.json()) as { kind: OrderKind; pact?: Pact; pact_id?: string };
    kind = body.kind;
    payload = body as Record<string, unknown>;
  } else {
    const form = await req.formData();
    kind = String(form.get("kind")) as OrderKind;
    payload = Object.fromEntries(form.entries());
  }

  const seq = match.orders.length;
  const order: Order = {
    id: `ord-${match.world.tick}-${seq}-${session.nationId}`,
    nationId: session.nationId,
    seq,
    kind,
    payload,
  };
  await enqueueOrder(store, session.matchId, order);
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("application/json") || contentType.includes("application/json")) {
    return NextResponse.json({ ok: true, orderId: order.id });
  }
  return NextResponse.redirect(new URL("/pacts", req.url), 303);
}
