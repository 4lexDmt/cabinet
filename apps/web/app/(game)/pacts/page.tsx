import { loadSeat } from "@/lib/seat";
import { obligationProse, roman } from "@cabinet/sim";
import { knownPacts } from "@/lib/desk-model";
import Link from "next/link";

type Scope = "all" | "mine" | "known" | "broken";

export default async function PactsPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const { match, nation } = await loadSeat();
  const params = await searchParams;
  const scope: Scope = ["all", "mine", "known", "broken"].includes(params.scope ?? "")
    ? (params.scope as Scope)
    : "all";
  const names = Object.fromEntries(Object.values(match.world.nations).map((n) => [n.id, n.name]));
  const known = knownPacts(match, nation.id);
  const filtered = known.filter((p) => {
    if (scope === "mine") return p.parties.includes(nation.id);
    if (scope === "known") return !p.parties.includes(nation.id);
    if (scope === "broken") return p.status === "broken";
    return true;
  });
  const ordered = [...filtered].sort((a, b) => {
    const rank = (s: string) => (s === "broken" ? 0 : s === "pending" ? 1 : s === "active" ? 2 : 3);
    return rank(a.status) - rank(b.status);
  });

  return (
    <div className="sheet-wrap" style={{ maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Pacts</div>
          <h1 style={{ fontSize: 36, color: "var(--paper)", margin: 0 }}>The registry</h1>
        </div>
        <Link className="btn" href="/pacts/new">Draft an instrument</Link>
      </div>
      <p style={{ fontSize: 17, color: "var(--desk-ink-dim)", maxWidth: "68ch", lineHeight: 1.62, marginBottom: 16 }}>
        Broken instruments remain on the register. The record of betrayal is the game's memory.
      </p>
      <div className="map-toolbar" style={{ marginBottom: 24 }}>
        {([
          ["all", "All in file"],
          ["mine", "You are party"],
          ["known", "Known, not party"],
          ["broken", "Broken"],
        ] as const).map(([id, label]) => (
          <Link key={id} href={`/pacts?scope=${id}`} className={scope === id ? "on" : ""}>
            {label}
          </Link>
        ))}
      </div>
      {ordered.length === 0 ? (
        <p style={{ color: "var(--desk-ink-dim)", fontStyle: "italic" }}>
          {scope === "known"
            ? "No instrument is in file that you are not party to. Discovering one is an intelligence outcome."
            : "Nothing in file."}
        </p>
      ) : null}
      {ordered.map((pact) => {
        const canReadPrivate = pact.parties.includes(nation.id) || pact.visible_to.includes(nation.id);
        const clauses = pact.public_terms.obligations;
        const privateClauses = canReadPrivate
          ? pact.private_terms.obligations.filter((o) => !clauses.some((p) => p.id === o.id))
          : [];
        const party = pact.parties.includes(nation.id);
        const broken = pact.status === "broken";
        return (
          <article
            key={pact.id}
            className="paper"
            style={{
              padding: "46px 56px 52px",
              marginBottom: 28,
              borderLeft: broken ? "4px solid var(--breach)" : party ? undefined : "3px solid var(--uncertainty)",
            }}
          >
            <div style={{ textAlign: "center", borderBottom: "2px solid var(--rule-heavy)", paddingBottom: 20, marginBottom: 30 }}>
              <div
                className="sans"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: broken ? "var(--breach)" : "var(--ink-2)",
                  marginBottom: 10,
                }}
              >
                {pact.secret ? "Secret instrument" : "Public instrument"} · {pact.status}
                {party ? "" : " · known, not party"}
                {broken && pact.broken_by ? ` · broken by ${names[pact.broken_by] ?? pact.broken_by}` : ""}
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 600, color: "var(--ink)", margin: "0 0 10px" }}>{pact.public_terms.title}</h2>
              <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink-2)", margin: "0 auto", maxWidth: "58ch" }}>
                Between {pact.parties.map((id) => names[id]).join(" and ")}.
              </p>
            </div>
            {clauses.map((ob, i) => (
              <div key={ob.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, marginBottom: 26 }}>
                <div className="mono" style={{ fontSize: 14, color: "var(--ink-3)", paddingTop: 3 }}>{roman(i)}.</div>
                <div>
                  <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink)", margin: "0 0 8px" }}>{obligationProse(ob, names)}</p>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{ob.must.replaceAll("_", " ").toUpperCase()}</div>
                </div>
              </div>
            ))}
            {privateClauses.map((ob, i) => (
              <div key={ob.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, marginBottom: 26 }}>
                <div className="mono" style={{ fontSize: 14, color: "var(--breach)", paddingTop: 3 }}>{roman(clauses.length + i)}.</div>
                <div style={{ borderLeft: "3px solid var(--breach)", background: "var(--breach-wash)", padding: "14px 18px" }}>
                  <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--breach)", marginBottom: 8 }}>Private term</div>
                  <p style={{ fontSize: 17, lineHeight: 1.62, color: "var(--ink)", margin: 0 }}>{obligationProse(ob, names)}</p>
                </div>
              </div>
            ))}
            {pact.status === "pending" && pact.parties.includes(nation.id) && !pact.signed_by.includes(nation.id) ? (
              <form action="/api/orders" method="post" style={{ marginTop: 28 }}>
                <input type="hidden" name="kind" value="accept_pact" />
                <input type="hidden" name="pact_id" value={pact.id} />
                <button className="btn-ink btn" type="submit">Put your hand to it</button>
              </form>
            ) : null}
            {pact.status === "active" && pact.parties.includes(nation.id) ? (
              <form action="/api/orders" method="post" style={{ marginTop: 28 }}>
                <input type="hidden" name="kind" value="break_pact" />
                <input type="hidden" name="pact_id" value={pact.id} />
                <button className="btn-ghost btn" type="submit" style={{ color: "var(--ink)", borderColor: "var(--rule)" }}>Renounce</button>
              </form>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
