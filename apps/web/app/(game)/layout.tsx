import { DeskRail } from "@/components/DeskRail";
import { AlertStack } from "@/components/shell/AlertStack";
import { StatusLine } from "@/components/shell/StatusLine";
import { Pillars } from "@/components/pillars/Pillars";
import { loadSeat } from "@/lib/seat";
import { deskAlerts, pillarReading } from "@/lib/desk-model";
import { scenarioSkin } from "@/lib/scenario-copy";

export const dynamic = "force-dynamic";

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  const { match, nation } = await loadSeat();
  const alerts = deskAlerts(match, nation.id);
  const reading = pillarReading(match, nation);
  return (
    <div className="desk" data-scenario={scenarioSkin(match.world.scenarioId)}>
      <DeskRail nation={nation} match={match} />
      <div className="desk-status">
        <StatusLine nation={nation} />
        <Pillars reading={reading} compact />
      </div>
      <div className="desk-alerts">
        <AlertStack alerts={alerts} interruptOnly />
      </div>
      <div className="desk-main">{children}</div>
    </div>
  );
}
