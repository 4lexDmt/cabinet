import type { CableMessage, Channel, MatchRecord } from "@cabinet/db";
import type { Nation } from "@cabinet/sim";
import Link from "next/link";

function membersCopy(channel: Channel, nations: Record<string, Nation>): string {
  const names = channel.memberNationIds.map((id) => nations[id]?.name ?? id);
  if (channel.kind === "public") return `Heard by every chair at this table. ${names.length} seats.`;
  if (channel.kind === "dm") return `Heard only by ${names.join(" and ")}.`;
  return `Heard by ${names.join(", ")}. Membership is exact.`;
}

export function ChannelDesk({
  match,
  nation,
  channelId,
  quoteId,
}: {
  match: MatchRecord;
  nation: Nation;
  channelId: string | null;
  quoteId: string | null;
}) {
  const mine = match.channels
    .filter((c) => c.memberNationIds.includes(nation.id))
    .sort((a, b) => {
      if (a.kind === "public") return -1;
      if (b.kind === "public") return 1;
      const aLive = match.messages.some((m) => m.channelId === a.id) ? 0 : 1;
      const bLive = match.messages.some((m) => m.channelId === b.id) ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;
      const aName = a.memberNationIds.find((id) => id !== nation.id) ?? a.id;
      const bName = b.memberNationIds.find((id) => id !== nation.id) ?? b.id;
      return aName.localeCompare(bName);
    });
  const active = mine.find((c) => c.id === channelId) ?? mine[0];
  if (!active) {
    return <p style={{ color: "var(--desk-ink-dim)", fontStyle: "italic" }}>No channel is open to this chair.</p>;
  }
  const messages = match.messages.filter((m) => m.channelId === active.id);
  const quoted = quoteId ? match.messages.find((m) => m.id === quoteId) : null;
  const declaration = active.kind === "public";

  return (
    <div className="channel-desk">
      <aside className="channel-list">
        <div className="label" style={{ marginBottom: 8 }}>
          Open to you
        </div>
        {mine.map((ch) => {
          const last = match.messages.filter((m) => m.channelId === ch.id).at(-1);
          return (
            <Link key={ch.id} href={`/channels?ch=${encodeURIComponent(ch.id)}`} className={ch.id === active.id ? "on" : ""}>
              <div>{ch.kind === "public" ? "Declaration" : ch.kind === "backchannel" ? "Back channel" : "Private cable"}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--desk-ink-dim)", marginTop: 2 }}>
                {ch.kind === "public"
                  ? "THE TABLE"
                  : ch.memberNationIds
                      .filter((id) => id !== nation.id)
                      .map((id) => match.world.nations[id]?.shortName ?? id)
                      .join(" / ")
                      .toUpperCase()}
                {last ? ` · T${last.createdTick}` : ""}
              </div>
            </Link>
          );
        })}
      </aside>
      <section>
        <article className={declaration ? "cable declaration" : "cable"}>
          <div
            className="sans"
            style={{
              padding: "12px 18px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: active.kind === "backchannel" ? "var(--breach)" : declaration ? "var(--ink)" : "var(--ink-2)",
              borderBottom: declaration ? "2px solid var(--rule-heavy)" : "1px solid var(--rule)",
              textAlign: declaration ? "center" : "left",
            }}
          >
            {declaration ? active.title : active.title}
          </div>
          <p className="membership">{membersCopy(active, match.world.nations)}</p>
          {messages.length === 0 ? (
            <p style={{ padding: "0 18px 18px", fontStyle: "italic", color: "var(--ink-3)" }}>
              Nothing on this wire. A message takes two taps. A signature takes a sitting.
            </p>
          ) : null}
          {messages.map((m) => (
            <Cable key={m.id} message={m} match={match} channelId={active.id} />
          ))}
          <form action="/api/messages" method="post" style={{ padding: 16, display: "grid", gap: 10, borderTop: "1px solid var(--rule)" }}>
            <input type="hidden" name="channelId" value={active.id} />
            {quoted ? <input type="hidden" name="quoteOf" value={quoted.id} /> : null}
            {quoted ? (
              <div className="quote-evidence" style={{ margin: 0 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>
                  CITING {quoted.id.slice(0, 8).toUpperCase()} · T{quoted.createdTick} · {quoted.authorNationId.toUpperCase()}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.5 }}>{quoted.body}</div>
              </div>
            ) : null}
            <textarea
              className="field"
              name="body"
              rows={declaration ? 5 : 3}
              required
              placeholder={declaration ? "Issue a declaration. It will be heard by every chair." : "Write in the language of a cable."}
            />
            <button className="btn-ink btn" type="submit">
              {declaration ? "Issue" : "Transmit"}
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}

function Cable({
  message,
  match,
  channelId,
}: {
  message: CableMessage;
  match: MatchRecord;
  channelId: string;
}) {
  const quoted = message.quoteOf ? match.messages.find((m) => m.id === message.quoteOf) : null;
  const author = match.world.nations[message.authorNationId];
  return (
    <article style={{ borderBottom: "1px solid var(--rule-fine)" }}>
      <div className="cable-head">
        <span>FROM</span>
        <span>{author?.name.toUpperCase() ?? message.authorNationId.toUpperCase()}</span>
        <span>TIME</span>
        <span>TURN {message.createdTick}</span>
        <span>REF</span>
        <span>{message.id.slice(0, 8).toUpperCase()}</span>
      </div>
      {quoted ? (
        <div className="quote-evidence">
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>
            AS SAID · {quoted.authorNationId.toUpperCase()} · T{quoted.createdTick} · {quoted.id.slice(0, 8).toUpperCase()}
          </div>
          <div style={{ fontSize: 16, lineHeight: 1.5 }}>{quoted.body}</div>
        </div>
      ) : null}
      <p className="cable-body">{message.body}</p>
      <div style={{ padding: "0 18px 14px" }}>
        <Link
          className="sans"
          href={`/channels?ch=${encodeURIComponent(channelId)}&quote=${message.id}`}
          style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}
        >
          Cite as evidence
        </Link>
      </div>
    </article>
  );
}
