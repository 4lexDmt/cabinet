import { loadSeat } from "@/lib/seat";
import { visibleEvents } from "@cabinet/runtime";
import { Claim } from "@/components/Claim";
import { AlertStack } from "@/components/shell/AlertStack";
import { deskAlerts, pendingPacts } from "@/lib/desk-model";
import Link from "next/link";

export default async function BriefingPage() {
  const { match, nation } = await loadSeat();
  const visible = visibleEvents(match.events, nation.id);
  const compiled = [...visible].reverse().find((e) => e.type === "briefing.compiled");
  const payload = (compiled?.payload ?? null) as
    | {
        lede: string;
        paragraphs: Array<{ text: string; confidence: "confirmed" | "probable" | "unverified"; sourceEventId: string | null }>;
        requiring: string[];
      }
    | null;
  const standingMoves = visible.filter((e) => e.type === "standing.changed" && e.payload.nation_id === nation.id);
  const alerts = deskAlerts(match, nation.id).filter((a) => a.severity !== "critical");
  const waiting = pendingPacts(match, nation.id);
  const cables = match.messages.filter((m) => m.authorNationId !== nation.id).slice(-5);

  return (
    <div className="sheet-wrap briefing-spread" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 232px", gap: 40, maxWidth: 1360 }}>
      <article className="paper">
        <div style={{ borderTop: "4px solid var(--hostility)", padding: "30px 52px 26px", borderBottom: "2px solid var(--rule-heavy)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22, gap: 16 }}>
            <span className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--hostility)" }}>
              Top Secret — Eyes Only
            </span>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              TURN {match.world.tick} · {compiled?.id ?? "NO DIGEST YET"}
            </span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.14, color: "var(--ink)", margin: "0 0 10px" }}>
            While you were away
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)", margin: 0, maxWidth: "62ch" }}>
            {payload?.lede ??
              "No sitting has been resolved since you took this chair. Read this file, send a cable, put your hand to one instrument. Then resolve the sitting from the rail."}
          </p>
        </div>
        <div style={{ padding: "34px 52px 40px" }}>
          {alerts.length > 0 ? (
            <div style={{ marginBottom: 28 }}>
              <div className="sans" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 8, marginBottom: 12 }}>
                Accumulated
              </div>
              <div style={{ background: "var(--paper-carbon)" }}>
                <AlertStack alerts={alerts} onPaper />
              </div>
            </div>
          ) : null}
          <div className="sans" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 8, marginBottom: 20 }}>
            I · What happened
          </div>
          {(payload?.paragraphs ?? []).length === 0 ? (
            <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink-2)", maxWidth: "68ch" }}>
              The digest is compiled when a sitting resolves. Until then the file is the cables, the instruments, and the map as you believe it.
            </p>
          ) : null}
          {(payload?.paragraphs ?? []).map((p, i) => (
            <p key={i} style={{ fontSize: 17, lineHeight: 1.62, margin: "0 0 16px", maxWidth: "68ch" }}>
              <Claim confidence={p.confidence} text={p.text} />
            </p>
          ))}
          {standingMoves.length > 0 ? (
            <>
              <div className="sans" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink)", borderBottom: "1px solid var(--rule)", paddingBottom: 8, margin: "28px 0 16px" }}>
                II · On the record
              </div>
              <div style={{ background: "var(--paper-cold)", border: "1px solid var(--rule)", padding: "16px 18px" }}>
                {standingMoves.slice(-6).map((e) => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--rule-fine)" }}>
                    <span>
                      {String(e.payload.field) === "standing_external" ? "How much others trust you" : "How the house holds"} · {e.id}
                    </span>
                    <span className="mono" style={{ color: Number(e.payload.delta) < 0 ? "var(--hostility)" : "var(--alliance)" }}>
                      {Number(e.payload.delta) > 0 ? "+" : ""}
                      {String(e.payload.delta)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </article>
      <aside>
        <div className="label" style={{ borderBottom: "1px solid var(--desk-edge)", paddingBottom: 8, marginBottom: 14 }}>
          What needs you
        </div>
        {waiting > 0 ? (
          <Link href="/pacts" style={{ display: "block", borderLeft: "3px solid var(--breach)", paddingLeft: 12, marginBottom: 16, color: "var(--paper)" }}>
            {waiting === 1 ? "An instrument awaits your hand." : `${waiting} instruments await your hand.`}
          </Link>
        ) : null}
        {cables.map((m) => (
          <Link key={m.id} href="/channels" style={{ display: "block", borderLeft: "2px solid var(--alliance)", paddingLeft: 12, marginBottom: 16 }}>
            <div style={{ color: "var(--paper)", fontSize: 15 }}>{match.world.nations[m.authorNationId]?.name ?? m.authorNationId}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--desk-ink-dim)" }}>TURN {m.createdTick}</div>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--desk-ink-dim)", marginTop: 4 }}>{m.body.slice(0, 140)}</div>
          </Link>
        ))}
        <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--desk-ink-dim)", lineHeight: 1.55 }}>
          Everything here was compiled from events already in your file. Nothing is new information — it is the same evidence, ordered so it can be read.
        </p>
      </aside>
    </div>
  );
}
