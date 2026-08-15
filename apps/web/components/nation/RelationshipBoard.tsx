import type { RelationRow } from "@/lib/desk-model";
import { statusLabel } from "@/lib/desk-model";

export function RelationshipBoard({ rows }: { rows: RelationRow[] }) {
  return (
    <div className="relation-grid">
      {rows.map((row) => (
        <article key={row.nationId} className="relation-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <h3 style={{ fontSize: 21, fontWeight: 600, margin: 0 }}>{row.name}</h3>
            <span className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              {statusLabel(row.status)}
            </span>
          </div>
          <div className="label" style={{ color: "var(--ink-3)", margin: "12px 0 6px" }}>
            With you
          </div>
          {row.pactsWithYou.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>No instrument between you is in file.</p>
          ) : (
            row.pactsWithYou.map((line) => (
              <div key={line} style={{ fontSize: 16, marginBottom: 4 }}>
                {line}
              </div>
            ))
          )}
          <div className="label" style={{ color: "var(--ink-3)", margin: "14px 0 6px" }}>
            Among others · as far as you know
          </div>
          {row.pactsAmongOthers.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>Nothing in file.</p>
          ) : (
            row.pactsAmongOthers.map((line) => (
              <div key={line} style={{ fontSize: 16, marginBottom: 4 }}>
                {line}
              </div>
            ))
          )}
          <div className="label" style={{ color: "var(--ink-3)", margin: "14px 0 6px" }}>
            Reputation · from the record
          </div>
          {row.record.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "var(--ink-3)", margin: 0 }}>
              No signed, honoured, or broken act is in your file. Trustworthiness here is not an opinion score.
            </p>
          ) : (
            row.record.map((entry) => (
              <div key={entry.eventId} className="rep-row">
                <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  T{entry.tick}
                </span>
                <span className={`kind-${entry.kind}`}>{entry.copy}</span>
              </div>
            ))
          )}
        </article>
      ))}
    </div>
  );
}
