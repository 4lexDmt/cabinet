import type { ObjectiveLine } from "@/lib/objectives";

export function Objectives({ own, others }: { own: ObjectiveLine[]; others: Array<{ name: string }> }) {
  return (
    <section>
      <div className="label" style={{ color: "var(--ink-3)", marginBottom: 10 }}>
        Your object
      </div>
      {own.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--ink-3)" }}>No object is on this file.</p>
      ) : (
        own.map((line) => (
          <div
            key={line.text}
            style={{
              display: "grid",
              gridTemplateColumns: "18px 1fr",
              gap: 10,
              marginBottom: 10,
              fontSize: 17,
              lineHeight: 1.5,
              color: "var(--ink)",
            }}
          >
            <span className="mono" style={{ color: line.met ? "var(--alliance)" : "var(--ink-3)" }}>
              {line.met ? "■" : "□"}
            </span>
            <span>{line.text}</span>
          </div>
        ))
      )}
      <div className="label" style={{ color: "var(--ink-3)", margin: "22px 0 10px" }}>
        What others are playing for
      </div>
      {others.map((row) => (
        <div key={row.name} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 16, color: "var(--ink)" }}>{row.name}</div>
          <div style={{ fontStyle: "italic", color: "var(--ink-3)", fontSize: 15 }}>
            Their object is not in your file.
          </div>
        </div>
      ))}
    </section>
  );
}
