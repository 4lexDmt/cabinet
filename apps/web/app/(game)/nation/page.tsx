import { loadSeat } from "@/lib/seat";
import { beliefsOf, evaluateVictory, type VictoryNode } from "@cabinet/sim";
import { Pillars } from "@/components/pillars/Pillars";
import { RelationshipBoard } from "@/components/nation/RelationshipBoard";
import { Objectives } from "@/components/nation/Objectives";
import { pillarReading, relationshipBoard, statusLabel, tradeExposure } from "@/lib/desk-model";
import { flattenObjectives } from "@/lib/objectives";
import { deskBelief, provenanceCopy, territoryReading } from "@/lib/belief-view";
import { Claim } from "@/components/Claim";
import Link from "next/link";

export default async function NationPage() {
  const { match, nation } = await loadSeat();
  const reading = pillarReading(match, nation);
  const relations = relationshipBoard(match, nation.id);
  const trade = tradeExposure(match, nation.id);
  const victory = match.world.victory[nation.id] as VictoryNode | undefined;
  const own = victory
    ? flattenObjectives(victory, {
        met: evaluateVictory(match.world, nation.id, victory),
        nationId: nation.id,
        evaluate: (node) => evaluateVictory(match.world, nation.id, node),
      })
    : [];
  const others = Object.values(match.world.nations)
    .filter((n) => n.id !== nation.id)
    .map((n) => ({ name: n.name }));
  const beliefs = beliefsOf(match.world.beliefs, nation.id).filter((b) => b.field === "controller");

  return (
    <div className="sheet-wrap" style={{ maxWidth: 1080 }}>
      <div className="label" style={{ marginBottom: 8 }}>
        Nation
      </div>
      <h1 style={{ fontSize: 36, color: "var(--paper)", margin: "0 0 6px" }}>{nation.name}</h1>
      <p style={{ fontSize: 17, color: "var(--desk-ink-dim)", margin: "0 0 28px", maxWidth: "68ch", lineHeight: 1.62 }}>
        {statusLabel(nation.status)}. This is a national file, not a character sheet.
        {nation.status === "exile"
          ? " You have no territory and no army. Correspondence, favours, and other people's disagreements remain."
          : ""}
      </p>

      <Pillars reading={reading} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, marginTop: 32 }} className="nation-spread">
        <article className="paper" style={{ padding: "28px 32px" }}>
          <Objectives own={own} others={others} />
        </article>
        <article className="paper" style={{ padding: "28px 32px" }}>
          <div className="label" style={{ color: "var(--ink-3)", marginBottom: 12 }}>
            Dependency
          </div>
          {trade.routes.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "var(--ink-3)" }}>No trade route naming this government is in file.</p>
          ) : (
            trade.routes.map((r) => (
              <div key={r.id} style={{ marginBottom: 12, borderLeft: `2px solid ${r.open ? "var(--alliance)" : "var(--hostility)"}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 17 }}>{r.counterparty}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                  {r.open ? "OPEN" : "CLOSED"} · {r.youSupply ? "THEY DEPEND ON YOU" : "YOU DEPEND ON THEM"}
                </div>
              </div>
            ))
          )}
          <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--ink-2)", lineHeight: 1.5, marginTop: 16 }}>
            Strangulation is a route, not a button. If a line is the only one, cutting it is the whole of the act.
          </p>
          <Link href="/chronicle" className="sans" style={{ display: "inline-block", marginTop: 18, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>
            Open the chronicle
          </Link>
        </article>
      </div>

      <h2 style={{ fontSize: 27, color: "var(--paper)", margin: "40px 0 8px" }}>The room</h2>
      <p style={{ fontSize: 17, color: "var(--desk-ink-dim)", maxWidth: "68ch", lineHeight: 1.62, marginBottom: 20 }}>
        Reputation is built from acts — signed, honoured, broken — with dates. It is not an opinion score.
      </p>
      <RelationshipBoard rows={relations} />

      <h2 style={{ fontSize: 27, color: "var(--paper)", margin: "40px 0 8px" }}>Your intelligence picture</h2>
      <p style={{ fontSize: 17, color: "var(--desk-ink-dim)", maxWidth: "68ch", lineHeight: 1.62, marginBottom: 20 }}>
        Provenance is how it arrived. Confidence is a property of the claim. Inspection will not tell you if you were lied to.
      </p>
      <section className="paper-cold" style={{ padding: 0 }}>
        {beliefs.length === 0 ? (
          <div style={{ padding: 18, fontStyle: "italic", color: "var(--ink-3)" }}>Nothing in file.</div>
        ) : (
          beliefs.map((b) => {
            const view = deskBelief(b);
            const territory = match.world.territories[b.subject_id];
            const reading = territory ? territoryReading(match.world, nation.id, territory) : null;
            const holder = String(b.believed_value);
            const name = match.world.nations[holder]?.name ?? holder;
            return (
              <div
                key={`${b.subject_id}-${b.field}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 120px",
                  gap: 8,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--rule-fine)",
                  background: reading?.contested ? "var(--uncertainty-wash)" : undefined,
                }}
              >
                <div>
                  <Claim confidence={view.visual} text={`${territory?.name ?? b.subject_id} held by ${name}`} />
                  {reading?.contested ? (
                    <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--uncertainty)", marginTop: 4 }}>
                      Two sources disagree.
                    </div>
                  ) : null}
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", alignSelf: "center" }}>
                  {provenanceCopy(view.provenance).toUpperCase()}
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", alignSelf: "center" }}>
                  T{b.last_updated_tick}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
