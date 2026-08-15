import { listScenarios } from "@cabinet/scenarios";
import { getStore } from "@/lib/store";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SCENARIO_BRIEFS } from "@/lib/scenario-copy";

export default async function LobbyPage() {
  const scenarios = listScenarios();
  const matches = await getStore().listMatches();
  const session = await getSession();

  return (
    <main className="sheet-wrap" style={{ maxWidth: 920 }}>
      <p className="label">Cabinet · the desk is open</p>
      <h1 style={{ fontSize: "var(--t-display)", letterSpacing: "var(--track-display)", color: "var(--paper)", margin: "12px 0 16px" }}>
        The table is set.
      </h1>
      <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--desk-ink)", maxWidth: "46ch", marginBottom: 40 }}>
        Roles are unequal on purpose. The weak chairs are interesting because of what they can still do.
      </p>

      {matches.length > 0 ? (
        <section style={{ marginBottom: 36 }}>
          <div className="label" style={{ marginBottom: 12 }}>Tables already open</div>
          <div style={{ display: "grid", gap: 8 }}>
            {matches.map((m) => (
              <form key={m.id} action={resumeMatch} className="paper-cold" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <input type="hidden" name="matchId" value={m.id} />
                <div>
                  <div style={{ color: "var(--ink)", fontSize: 17 }}>{SCENARIO_BRIEFS[m.scenarioId]?.displayName ?? m.scenarioId}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    {m.id.slice(0, 8)} · TURN {m.world.tick}
                    {session?.matchId === m.id ? " · THIS MACHINE IS SEATED" : ""}
                  </div>
                </div>
                <button className="btn" type="submit">Return to the chairs</button>
              </form>
            ))}
          </div>
        </section>
      ) : null}

      <div className="catalog-grid">
        {scenarios.map((s) => {
          const brief = SCENARIO_BRIEFS[s.id];
          return (
            <section key={s.id} className="paper catalog-card">
              <div className="sans catalog-card-meta">
                {brief?.catalogNo ? `${brief.catalogNo} · ` : ""}
                {s.player_slots} chairs · {brief?.duration ?? `${s.duration_ticks} sittings`}
              </div>
              <h2>{s.display_name}</h2>
              <p>{brief?.situation ?? s.display_name}</p>
              <form action={openMatch}>
                <input type="hidden" name="scenarioId" value={s.id} />
                <button className="btn-ink btn" type="submit">
                  Open this table
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </main>
  );
}

async function openMatch(formData: FormData) {
  "use server";
  const { createMatch } = await import("@cabinet/runtime");
  const { getStore } = await import("@/lib/store");
  const { setSession } = await import("@/lib/session");
  const scenarioId = String(formData.get("scenarioId") ?? "sevres_1956");
  const match = await createMatch(getStore(), scenarioId, 1956);
  await setSession({ matchId: match.id, nationId: "" });
  redirect("/join");
}

async function resumeMatch(formData: FormData) {
  "use server";
  const { setSession } = await import("@/lib/session");
  await setSession({
    matchId: String(formData.get("matchId")),
    nationId: "",
  });
  redirect("/join");
}
