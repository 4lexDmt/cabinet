import { loadSeat } from "@/lib/seat";
import { visibleEvents } from "@cabinet/runtime";

export default async function ChroniclePage() {
  const { match, nation } = await loadSeat();
  const events = visibleEvents(match.events, nation.id).filter((e) => e.type !== "belief.updated");

  return (
    <div className="sheet-wrap" style={{ maxWidth: 780 }}>
      <article className="paper" style={{ padding: "48px 56px" }}>
        <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Chronicle · a projection over the event log
        </div>
        <h1 style={{ fontSize: 36, color: "var(--ink)", margin: "12px 0 24px" }}>{match.world.scenarioId}</h1>
        {events.map((e) => (
          <p key={e.id} style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink)", maxWidth: "68ch" }}>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{e.id} · T{e.tick} · </span>
            {e.type.replaceAll(".", " ")}
            {e.actor_id ? ` — ${e.actor_id}` : ""}
          </p>
        ))}
      </article>
    </div>
  );
}
