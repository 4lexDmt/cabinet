"use client";

import { useMemo, useState } from "react";
import { obligationProse, roman, type Obligation, type PredicateName } from "@cabinet/sim";

const PREDICATES: { must: PredicateName; label: string }[] = [
  { must: "not_declare_war_on", label: "Forbear from war" },
  { must: "not_move_forces_into", label: "Not move forces into" },
  { must: "maintain_trade_route", label: "Keep a trade route" },
  { must: "provide_passage", label: "Provide passage" },
  { must: "share_intelligence_on", label: "Share intelligence" },
  { must: "pay_tribute", label: "Pay tribute" },
];

export function PactComposer({
  nationId,
  nations,
}: {
  nationId: string;
  nations: Array<{ id: string; name: string }>;
}) {
  const [title, setTitle] = useState("Understanding");
  const [counterparty, setCounterparty] = useState(nations.find((n) => n.id !== nationId)?.id ?? "");
  const [secret, setSecret] = useState(true);
  const [view, setView] = useState<"private" | "public">("private");
  const [clauses, setClauses] = useState<Obligation[]>([]);
  const names = useMemo(
    () => Object.fromEntries(nations.map((n) => [n.id, n.name])),
    [nations],
  );

  function add(must: PredicateName) {
    const id = `cl-${clauses.length + 1}`;
    const next: Obligation = {
      id,
      party: nationId,
      must,
      target: counterparty,
      params: must === "pay_tribute" ? { amount: 3 } : undefined,
    };
    setClauses((c) => [...c, next]);
  }

  async function propose() {
    const pact = {
            id: `pct-${crypto.randomUUID()}`,
      parties: [nationId, counterparty].sort(),
      secret,
      visible_to: [nationId, counterparty].sort(),
      public_terms: {
        title,
        type: "custom",
        secret,
        obligations: view === "public" ? clauses : clauses.slice(0, Math.max(0, clauses.length - 1)),
      },
      private_terms: {
        title,
        type: "custom",
        secret,
        obligations: clauses,
      },
      status: "draft",
      broken_by: null,
      broken_tick: null,
      signed_by: [],
      created_tick: 0,
      activated_tick: null,
    };
    await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "propose_pact", pact }),
    });
    window.location.href = "/pacts";
  }

  const publicCount = Math.max(0, clauses.length - (secret ? 1 : 0));

  return (
    <div className="desk with-margin" style={{ minHeight: "auto", display: "contents" }}>
      <main className="sheet-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div className="label" style={{ color: "var(--uncertainty)", marginBottom: 6 }}>
              In draft — not transmitted
            </div>
            <h1 style={{ fontSize: 27, color: "var(--paper)", margin: 0 }}>Drafting an instrument</h1>
          </div>
          <label className="mono" style={{ fontSize: 12, color: "var(--desk-ink-dim)" }}>
            <input type="checkbox" checked={secret} onChange={(e) => setSecret(e.target.checked)} /> Secret
          </label>
        </div>

        <article className="paper" style={{ padding: "46px 56px 52px" }}>
          <div style={{ textAlign: "center", borderBottom: "2px solid var(--rule-heavy)", paddingBottom: 20, marginBottom: 30 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: 36, fontWeight: 600, color: "var(--ink)", width: "100%", textAlign: "center", border: 0, background: "transparent" }}
            />
            <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink-2)" }}>
              Between <strong>{names[nationId]}</strong> and{" "}
              <select value={counterparty} onChange={(e) => setCounterparty(e.target.value)} style={{ font: "inherit", background: "transparent" }}>
                {nations.filter((n) => n.id !== nationId).map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button type="button" className={view === "private" ? "btn-ink btn" : "btn-ghost btn"} onClick={() => setView("private")}>
              What we actually agreed
            </button>
            <button type="button" className={view === "public" ? "btn-ink btn" : "btn-ghost btn"} onClick={() => setView("public")}>
              What the world sees
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", rowGap: 26, columnGap: 16 }}>
            {clauses.map((ob, i) => {
              const sealed = secret && i >= publicCount;
              if (view === "public" && sealed) return null;
              return (
                <ClauseRow key={ob.id} index={i} sealed={Boolean(sealed)} text={obligationProse(ob, names)} vocab={ob.must} />
              );
            })}
            <div className="mono" style={{ fontSize: 14, color: "var(--ink-faint)", paddingTop: 3 }}>{roman(clauses.length)}.</div>
            <div style={{ border: "1px dashed var(--rule)", padding: "14px 18px", background: "rgba(255,255,255,.22)" }}>
              <p style={{ fontSize: 17, fontStyle: "italic", color: "var(--ink-faint)", margin: 0 }}>
                Choose a term from the drafting table and it will be set here in the language of the instrument.
              </p>
            </div>
          </div>
        </article>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn" type="button" onClick={() => void propose()}>
            Put it to them
          </button>
        </div>
      </main>

      <aside style={{ background: "var(--desk)", borderLeft: "1px solid var(--desk-edge)", padding: "40px 26px 60px" }}>
        <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--paper)", borderBottom: "2px solid var(--desk-edge)", paddingBottom: 10, marginBottom: 8 }}>
          The drafting table
        </div>
        <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--desk-ink-dim)", lineHeight: 1.55 }}>
          A closed vocabulary. Every term below has a fixed meaning in the simulation. You are choosing obligations, not writing prose.
        </p>
        <div className="label" style={{ color: "var(--alliance)", margin: "18px 0 10px" }}>Undertakings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PREDICATES.map((p) => (
            <button
              key={p.must}
              type="button"
              onClick={() => add(p.must)}
              style={{ textAlign: "left", background: "transparent", color: "var(--desk-ink)", border: "1px solid var(--desk-edge)", padding: "9px 12px" }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: "2px solid var(--breach)", marginTop: 26, paddingTop: 16 }}>
          <div className="label" style={{ color: "var(--breach)", marginBottom: 10 }}>Exposure grading</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--desk-ink)" }}>
            {secret ? "CATEGORY II — CLOSE HOLD" : "CATEGORY I — OPEN TEXT"}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ClauseRow({ index, sealed, text, vocab }: { index: number; sealed: boolean; text: string; vocab: string }) {
  return (
    <>
      <div className="mono" style={{ fontSize: 14, color: sealed ? "var(--breach)" : "var(--ink-3)", paddingTop: 3 }}>{roman(index)}.</div>
      <div style={sealed ? { borderLeft: "3px solid var(--breach)", background: "var(--breach-wash)", marginLeft: -19, padding: "14px 18px" } : undefined}>
        {sealed ? (
          <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--breach)", marginBottom: 8 }}>
            Private term
          </div>
        ) : null}
        <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink)", margin: "0 0 8px" }}>{text}</p>
        <div className="mono" style={{ fontSize: 11, color: sealed ? "var(--breach)" : "var(--ink-3)" }}>{vocab.replaceAll("_", " ").toUpperCase()}</div>
      </div>
    </>
  );
}
