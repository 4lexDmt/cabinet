"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { TerritoryPanel } from "./TerritoryPanel";
import { MAP_MODES, periodChartOf, type MapMode, type TheatreView } from "@/lib/theatre-view";

const PoliticalMap = dynamic(() => import("./PoliticalMap").then((m) => m.PoliticalMap), {
  ssr: false,
  loading: () => <div className="theatre-loading">Charting the theatre…</div>,
});

const MODE_LABEL: Record<MapMode, string> = {
  political: "Political",
  period: "Period chart",
  alignment: "Alignment",
  intel: "Intel",
};

export function TheatreStage({
  view,
  selectedId: selectedFromUrl,
  initialMode,
  initialForce,
}: {
  view: TheatreView;
  selectedId: string | null;
  initialMode: MapMode;
  initialForce: boolean;
}) {
  const [mode, setMode] = useState<MapMode>(initialMode);
  const [showForce, setShowForce] = useState(initialForce);
  const [selectedId, setSelectedId] = useState<string | null>(selectedFromUrl);
  const [jumpNonce, setJumpNonce] = useState(0);
  const chart = periodChartOf(view.scenarioId);
  const selected = useMemo(
    () => view.territories.find((t) => t.id === selectedId) ?? null,
    [selectedId, view.territories],
  );

  return (
    <div className="theatre-stage">
      <PoliticalMap
        view={view}
        mode={mode}
        showForce={showForce}
        selectedId={selectedId}
        jumpNonce={jumpNonce}
        onSelect={setSelectedId}
      />

      <div className="theatre-hud">
        <div className="theatre-modes" role="tablist" aria-label="Map mode">
          {MAP_MODES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              className={mode === item ? "on" : ""}
              onClick={() => setMode(item)}
            >
              {MODE_LABEL[item]}
            </button>
          ))}
          <button type="button" className={showForce ? "on" : ""} onClick={() => setShowForce((v) => !v)}>
            Force
          </button>
        </div>

        <div className="theatre-resources" aria-label="National estimate">
          <div>
            <span>Others</span>
            <b>{view.pillars.standingExternal}</b>
          </div>
          <div>
            <span>House</span>
            <b>{view.pillars.standingInternal}</b>
          </div>
          <div>
            <span>Intel</span>
            <b>{view.pillars.intel}</b>
          </div>
          <div>
            <span>Economy</span>
            <b>{view.pillars.economy}</b>
          </div>
          <div>
            <span>Force</span>
            <b>{view.pillars.force}</b>
          </div>
        </div>
      </div>

      <TerritoryPanel
        paint={selected}
        tick={view.tick}
        holdings={view.territories}
        matchId={view.matchId}
        nationId={view.nationId}
        onSelect={(id) => {
          setSelectedId(id);
          setJumpNonce((n) => n + 1);
        }}
      />

      <div className="theatre-legend">
        <div>
          ■ confirmed · ◧ probable · □ unverified · dashed ochre is nothing in file
        </div>
        <div>
          Sitting {view.tick} · {view.nationName} · belief, not truth
          {mode === "period" && chart ? ` · ${chart.credit}` : " · Natural Earth, public domain"}
        </div>
      </div>
    </div>
  );
}
