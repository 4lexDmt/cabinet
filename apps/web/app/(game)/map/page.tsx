import { loadSeat } from "@/lib/seat";
import { TheatreStage } from "@/components/map/TheatreStage";
import { asMapMode, buildTheatreView } from "@/lib/theatre-view";
import { scenarioById } from "@cabinet/scenarios";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; m?: string; force?: string }>;
}) {
  const { match, nation } = await loadSeat();
  const params = await searchParams;
  const theatreBbox = scenarioById(match.world.scenarioId).geo?.theatre_bbox ?? null;
  const view = buildTheatreView(match, nation, theatreBbox);
  const selected = params.t && view.territories.some((t) => t.id === params.t) ? params.t : null;

  return (
    <TheatreStage
      view={view}
      selectedId={selected}
      initialMode={asMapMode(params.m)}
      initialForce={params.force === "1"}
    />
  );
}
