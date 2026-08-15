import { RailNav } from "./RailNav";
import { TimePresence } from "./shell/TimePresence";
import type { MatchRecord } from "@cabinet/db";
import type { Nation } from "@cabinet/sim";
import { navAttention, ownOrdersWaiting, pillarReading } from "@/lib/desk-model";

export function DeskRail({
  nation,
  match,
}: {
  nation: Nation;
  match: MatchRecord;
}) {
  const attention = navAttention(match, nation.id);
  const pillars = pillarReading(match, nation);

  return (
    <aside className="rail">
      <div className="rail-head">
        <h1>{nation.shortName}</h1>
        <div className="mono" style={{ fontSize: 11, color: "var(--desk-ink-dim)", marginTop: 4 }}>
          {match.world.scenarioId.replaceAll("_", " ").toUpperCase()}
        </div>
      </div>
      <TimePresence tick={match.world.tick} ownOrdersWaiting={ownOrdersWaiting(match, nation.id)} />
      <div style={{ padding: "0 20px" }}>
        <div className="label" style={{ marginBottom: 12 }}>
          The desk
        </div>
        <RailNav attention={attention} />
        <TickControl />
      </div>
      <div className="pillars-rail">
        <div className="mini">
          <span>Others trust you</span>
          <span className="v">{pillars.standingExternal}</span>
        </div>
        <div className="mini">
          <span>The house</span>
          <span className="v">{pillars.standingInternal}</span>
        </div>
        <div className="mini">
          <span>Intelligence</span>
          <span className="v">{pillars.intelAvailable}</span>
        </div>
        <div className="mini">
          <span>Economy</span>
          <span className="v">{pillars.economyAvailable}</span>
        </div>
        <div className="mini force-row">
          <span>Force</span>
          <span className="v">{pillars.force}</span>
        </div>
      </div>
      <div className="rail-table" style={{ padding: "0 20px", marginTop: 28 }}>
        <div className="label" style={{ margin: "0 0 10px" }}>
          This machine
        </div>
        <div style={{ borderTop: "1px solid var(--desk-edge)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.values(match.world.nations).map((n) => (
            <form key={n.id} action="/api/session" method="post" style={{ display: "flex", justifyContent: "space-between" }}>
              <input type="hidden" name="matchId" value={match.id} />
              <input type="hidden" name="nationId" value={n.id} />
              <button
                type="submit"
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  color: n.id === nation.id ? "var(--paper)" : "var(--desk-ink)",
                  fontSize: 15,
                  textAlign: "left",
                }}
              >
                {n.shortName}
              </button>
              <span className="mono" style={{ fontSize: 12, color: "var(--desk-ink-dim)" }}>
                {n.status === "sovereign" ? "" : n.status}
              </span>
            </form>
          ))}
        </div>
      </div>
    </aside>
  );
}

function TickControl() {
  return (
    <form action="/api/tick" method="post" className="tick-block" style={{ marginTop: 20 }}>
      <button className="btn" type="submit" style={{ width: "100%" }}>
        Resolve this sitting
      </button>
      <p className="mono tick-note" style={{ fontSize: 11, color: "var(--desk-ink-dim)", margin: "8px 0 0", lineHeight: 1.5 }}>
        Orders already on the queue are applied. The clock does not run in the browser.
      </p>
    </form>
  );
}
