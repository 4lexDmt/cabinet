import { loadSeat } from "@/lib/seat";
import { ChannelDesk } from "@/components/channels/ChannelDesk";

export default async function ChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{ ch?: string; quote?: string }>;
}) {
  const { match, nation } = await loadSeat();
  const params = await searchParams;
  return (
    <div className="sheet-wrap" style={{ maxWidth: 1100 }}>
      <div className="label" style={{ marginBottom: 8 }}>
        Channels
      </div>
      <h1 style={{ fontSize: 36, color: "var(--paper)", margin: "0 0 8px" }}>Correspondence</h1>
      <p style={{ fontSize: 17, color: "var(--desk-ink-dim)", maxWidth: "68ch", lineHeight: 1.62, marginBottom: 28 }}>
        Messages are permanent and can be cited. A public declaration is heard by every chair. A private cable is heard only by those named.
      </p>
      <ChannelDesk match={match} nation={nation} channelId={params.ch ?? null} quoteId={params.quote ?? null} />
    </div>
  );
}
