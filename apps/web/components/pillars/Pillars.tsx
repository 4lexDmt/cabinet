import type { PillarReading } from "@/lib/desk-model";

function trend(n: number) {
  if (n > 0) return <span className="trend-up">rising {n}</span>;
  if (n < 0) return <span className="trend-down">falling {Math.abs(n)}</span>;
  return <span>unchanged this sitting</span>;
}

export function Pillars({ reading, compact = false }: { reading: PillarReading; compact?: boolean }) {
  if (compact) {
    return (
      <div className="pillars-strip">
        <div className="mini">
          <div className="k">Others</div>
          <div className="v">{reading.standingExternal}</div>
        </div>
        <div className="mini">
          <div className="k">House</div>
          <div className="v">{reading.standingInternal}</div>
        </div>
        <div className="mini">
          <div className="k">Intel</div>
          <div className="v">{reading.intelAvailable}</div>
        </div>
        <div className="mini">
          <div className="k">Economy</div>
          <div className="v">{reading.economyAvailable}</div>
        </div>
        <div className="mini">
          <div className="k">Force</div>
          <div className="v">{reading.force}</div>
        </div>
      </div>
    );
  }

  const intelLeft = reading.intelAvailable - reading.intelCommitted;
  const econLeft = reading.economyAvailable - reading.economyCommitted;

  return (
    <section className="pillars">
      <div className="pillar">
        <div className="pillar-kicker">Standing · a condition</div>
        <div className="pillar-dual">
          <div>
            <div className="label" style={{ color: "var(--ink-3)", marginBottom: 4 }}>
              How much others trust you
            </div>
            <div className="pillar-value">{reading.standingExternal}</div>
          </div>
          <div>
            <div className="label" style={{ color: "var(--ink-3)", marginBottom: 4 }}>
              How the house holds
            </div>
            <div className="pillar-value">{reading.standingInternal}</div>
          </div>
        </div>
        <p className="pillar-note">
          The gap is {Math.abs(reading.standingGap)}. You cannot spend this. You can only spend against it.{" "}
          {trend(reading.standingTrend)}.
        </p>
      </div>
      <div className="pillar">
        <div className="pillar-kicker">Intelligence · a budget</div>
        <div className="pillar-value">{intelLeft}</div>
        <p className="pillar-note">
          {reading.intelCommitted} committed this sitting · {reading.intelAvailable} on the estimate. Spend it on
          collection, or on not being lied to. Not both, fully.
        </p>
      </div>
      <div className="pillar">
        <div className="pillar-kicker">Economy · a budget</div>
        <div className="pillar-value">{econLeft}</div>
        <p className="pillar-note">
          {reading.economyCommitted} committed · {reading.economyAvailable} on the estimate. {trend(reading.economyTrend)}.
        </p>
      </div>
      <div className="pillar pillar-force">
        <div className="pillar-kicker">Force · derived</div>
        <div className="pillar-value">{reading.force}</div>
        <p className="pillar-note">
          From economy {reading.economyAvailable}, the house {reading.standingInternal}, and supply {reading.supply}.
          There is no purchase. This is what the house produces.
        </p>
      </div>
    </section>
  );
}
