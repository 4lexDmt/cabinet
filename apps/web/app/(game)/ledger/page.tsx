import { loadSeat } from "@/lib/seat";
import { causalChain, standingLedger, visibleEvents } from "@cabinet/runtime";
import Link from "next/link";

export default async function LedgerPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string; field?: string }>;
}) {
  const { match, nation } = await loadSeat();
  const params = await searchParams;
  const field = params.field === "standing_internal" ? "standing_internal" : "standing_external";
  const visible = visibleEvents(match.events, nation.id);
  const rows = standingLedger(visible, nation.id).filter((e) => e.payload.field === field);
  const openId = params.open;
  const opening = nation[field];
  let running = opening;
  const chronological = [...rows].reverse();
  const withBalance = chronological.map((row) => {
    const after = Number(row.payload.after ?? running);
    running = after;
    return { row, after };
  });
  const display = [...withBalance].reverse();

  const folios = [
    { id: "standing_external", label: "General account", value: nation.standing_external, copy: "How the room reads you." },
    { id: "standing_internal", label: "Internal", value: nation.standing_internal, copy: "How your own house reads you." },
  ];

  return (
    <div className="sheet-wrap" style={{ maxWidth: 1400 }}>
      <header style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid var(--desk-edge)", paddingBottom: 18, marginBottom: 28 }}>
        <div>
          <div className="label" style={{ marginBottom: 8 }}>Register of standing · Complete and auditable</div>
          <h1 style={{ fontSize: 36, fontWeight: 600, color: "var(--paper)", margin: 0 }}>
            Standing Ledger — {nation.name}
          </h1>
        </div>
        <div className="mono" style={{ fontSize: 12, color: "var(--desk-ink-dim)", textAlign: "right", lineHeight: 1.6 }}>
          EVERY ENTRY CARRIES A SOURCE
          <br />
          {display.length} ENTRIES
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--desk-edge)", border: "1px solid var(--desk-edge)", marginBottom: 32 }}>
        {folios.map((f) => (
          <Link
            key={f.id}
            href={`/ledger?field=${f.id}`}
            style={{ background: "var(--desk)", padding: "16px 18px", borderTop: field === f.id ? "2px solid var(--hostility)" : "2px solid transparent" }}
          >
            <div className="label" style={{ marginBottom: 6 }}>{f.label}</div>
            <div className="mono" style={{ fontSize: 27, color: "var(--paper)" }}>{f.value}</div>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "var(--desk-ink-dim)", marginTop: 4 }}>{f.copy}</div>
          </Link>
        ))}
      </section>

      <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--desk-ink-dim)", maxWidth: "68ch", marginBottom: 24 }}>
        There is no single reputation. A number without a cause is a bug, not a design.
      </p>

      <section className="paper-cold">
        <div style={{ display: "grid", gridTemplateColumns: "96px 110px 1fr 78px 88px", background: "var(--paper-carbon)", borderTop: "3px solid var(--rule-heavy)", borderBottom: "2px solid var(--rule-heavy)" }}>
          {["Tick", "Source", "Particulars", "Movt.", "Balance"].map((h) => (
            <div key={h} className="sans" style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-2)" }}>
              {h}
            </div>
          ))}
        </div>
        {display.length === 0 ? (
          <div style={{ padding: 18, fontStyle: "italic", color: "var(--ink-3)" }}>
            The register opens with the scenario. No movement has been posted since.
          </div>
        ) : null}
        {display.map(({ row, after }) => {
          const open = openId === row.id;
          const chain = open ? causalChain(match.events, row.id) : [];
          return (
            <div key={row.id} style={{ borderBottom: "1px solid var(--rule-fine)", background: open ? "var(--breach-wash)" : undefined, borderLeft: open ? "4px solid var(--breach)" : undefined }}>
              <Link href={open ? `/ledger?field=${field}` : `/ledger?field=${field}&open=${row.id}`} style={{ display: "grid", gridTemplateColumns: "96px 110px 1fr 78px 88px", alignItems: "baseline" }}>
                <div className="mono" style={{ padding: "13px 14px", fontSize: 12, color: "var(--ink-3)" }}>{row.tick}</div>
                <div className="mono" style={{ padding: "13px 14px", fontSize: 12, color: "var(--alliance)" }}>{row.id}</div>
                <div style={{ padding: "13px 14px" }}>
                  <div style={{ fontSize: 16, color: "var(--ink)" }}>{String(row.payload.trigger ?? row.type)}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>
                    {row.cause_event_id ? `CAUSE ${row.cause_event_id}` : "ROOT"}
                  </div>
                </div>
                <div className="mono" style={{ padding: "13px 14px", fontSize: 14, textAlign: "right", color: Number(row.payload.delta) < 0 ? "var(--hostility)" : "var(--alliance)" }}>
                  {Number(row.payload.delta) > 0 ? "+" : ""}
                  {String(row.payload.delta)}
                </div>
                <div className="mono" style={{ padding: "13px 14px", fontSize: 14, textAlign: "right", color: "var(--ink)" }}>{after}</div>
              </Link>
              {open ? (
                <div style={{ padding: "0 14px 18px 110px" }}>
                  <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--breach)", marginBottom: 8 }}>
                    Causal chain
                  </div>
                  {chain.map((e) => (
                    <div key={e.id} className="mono" style={{ fontSize: 12, lineHeight: 1.9, color: "var(--ink)" }}>
                      {e.id} · {e.type}
                      {e.cause_event_id ? ` ← ${e.cause_event_id}` : ""}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
