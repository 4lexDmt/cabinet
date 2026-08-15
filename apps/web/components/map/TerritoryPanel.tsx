import Link from "next/link";
import type { TerritoryPaint } from "@/lib/theatre-view";

function privateCableHref(matchId: string, a: string, b: string): string {
  const [x, y] = [a, b].sort();
  return `/channels?ch=${encodeURIComponent(`${matchId}:dm:${x}:${y}`)}`;
}

export function TerritoryPanel({
  paint,
  tick,
  holdings = [],
  matchId,
  nationId,
  onSelect,
}: {
  paint: TerritoryPaint | null;
  tick: number;
  holdings?: TerritoryPaint[];
  matchId: string;
  nationId: string;
  onSelect: (id: string) => void;
}) {
  const cableHref =
    paint?.controllerId && paint.controllerId !== nationId
      ? privateCableHref(matchId, nationId, paint.controllerId)
      : "/channels";

  return (
    <aside className="theatre-panel">
      {paint ? (
        <>
          <p className="theatre-panel-kicker">{paint.region}</p>
          <h2>{paint.name}</h2>
          {paint.nothingInFile ? (
            <p className="theatre-panel-lede">Nothing in file. Absence of a holding is not emptiness.</p>
          ) : (
            <>
              <p className="theatre-panel-lede">
                Held, as far as this cabinet believes, by {paint.holderName}.
                {paint.occupied ? " The owner of record and the controller are not the same." : ""}
                {paint.contested ? " Two sources in file do not agree." : ""}
              </p>
              <p className="theatre-panel-meta">
                {paint.visual.toUpperCase()}
                {paint.provenanceLabel ? ` · ${paint.provenanceLabel}` : ""}
                {paint.stale && paint.stale !== "fresh" ? ` · last confirmed T${paint.lastUpdatedTick}` : ""}
                <br />
                Yield {paint.supplyValue} · supply on the estimate · sitting {tick}
              </p>
            </>
          )}
          <div className="theatre-acts">
            <Link href="/briefing">Read this sitting</Link>
            <Link href="/pacts/new">Draft an instrument</Link>
            <Link href={cableHref}>
              {paint.controllerId && paint.controllerId !== nationId ? `Cable ${paint.holderName}` : "Open a channel"}
            </Link>
          </div>
          <p className="theatre-panel-kicker" style={{ marginTop: 18 }}>
            Instruments covering this ground
          </p>
          {paint.instruments.length === 0 ? (
            <p className="theatre-panel-muted">No obligation in file names this ground.</p>
          ) : (
            paint.instruments.map((p) => (
              <Link key={p.id} href="/pacts" className="theatre-pact">
                <div>{p.title}</div>
                <div className="theatre-panel-meta">
                  {p.status.toUpperCase()}
                  {p.youAreParty ? " · you are party" : " · known, not party"}
                </div>
              </Link>
            ))
          )}
        </>
      ) : (
        <>
          <p className="theatre-panel-kicker">Theatre</p>
          <h2>Holdings in file</h2>
          <p className="theatre-panel-lede">
            Click a coloured holding, or pick one below. The chart is belief, not truth. Orders are cables and instruments, not counters.
          </p>
          <div className="theatre-acts">
            <Link href="/briefing">Read this sitting</Link>
            <Link href="/channels">Send a cable</Link>
            <Link href="/pacts/new">Draft an instrument</Link>
          </div>
        </>
      )}
      <p className="theatre-panel-kicker" style={{ marginTop: 18 }}>
        Jump
      </p>
      <div className="theatre-jump">
        {(holdings ?? []).map((holding) => (
          <button
            key={holding.id}
            type="button"
            className={holding.id === paint?.id ? "on" : ""}
            onClick={() => onSelect(holding.id)}
          >
            <span>{holding.name}</span>
            <span>{holding.nothingInFile ? "—" : holding.holderName}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
