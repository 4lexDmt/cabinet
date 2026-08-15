import { loadMatch } from "@/lib/seat";
import { briefFor, scenarioSkin } from "@/lib/scenario-copy";
import { statusLabel } from "@/lib/desk-model";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const { match } = await loadMatch();
  const brief = briefFor(match.scenarioId);

  return (
    <main className="sheet-wrap" style={{ maxWidth: 980 }} data-scenario={scenarioSkin(match.scenarioId)}>
      <p className="label">{brief?.displayName ?? match.scenarioId} · choose a chair</p>
      <h1 style={{ fontSize: 36, color: "var(--paper)", margin: "8px 0 12px" }}>The seats are not equal.</h1>
      <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--desk-ink)", maxWidth: "58ch", marginBottom: 32 }}>
        {brief?.situation ?? "A table is open."} What makes a weak chair worth taking is its instruments, not its army.
      </p>
      <div className="chair-grid">
        {Object.values(match.world.nations).map((n) => {
          const chair = brief?.chairs[n.id];
          return (
            <form key={n.id} action={sit}>
              <input type="hidden" name="matchId" value={match.id} />
              <input type="hidden" name="nationId" value={n.id} />
              <button className="chair-card" type="submit">
                <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>
                  {statusLabel(n.status)}
                </div>
                <div style={{ fontSize: 21, fontWeight: 600, marginBottom: 8 }}>{n.name}</div>
                <p style={{ fontSize: 16, lineHeight: 1.5, color: "var(--ink-2)", margin: "0 0 10px" }}>
                  {chair?.posture ?? "A chair at this table."}
                </p>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink-3)", lineHeight: 1.5, margin: "0 0 8px" }}>
                  {chair?.instruments ?? ""}
                </p>
                <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.45, margin: 0 }}>
                  {chair?.victory ?? ""}
                </p>
              </button>
            </form>
          );
        })}
      </div>
    </main>
  );
}

async function sit(formData: FormData) {
  "use server";
  const matchId = String(formData.get("matchId"));
  const nationId = String(formData.get("nationId"));
  const { setSession } = await import("@/lib/session");
  const { getStore } = await import("@/lib/store");
  const { ensurePrivateChannels } = await import("@cabinet/runtime");
  const store = getStore();
  const match = await store.getMatch(matchId);
  if (match && ensurePrivateChannels(match, nationId)) {
    await store.saveMatch(match);
  }
  await setSession({ matchId, nationId });
  redirect("/briefing");
}
