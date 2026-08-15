import { loadSeat } from "@/lib/seat";
import { PactComposer } from "@/components/PactComposer";

export default async function NewPactPage() {
  const { match, nation } = await loadSeat();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(420px,1fr) 348px", minHeight: "100%" }}>
      <PactComposer
        nationId={nation.id}
        nations={Object.values(match.world.nations).map((n) => ({ id: n.id, name: n.name }))}
      />
    </div>
  );
}
