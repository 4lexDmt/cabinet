/** Staff-map geometry. Coordinates in a 900×560 viewBox. */

export interface RegionPath {
  id: string;
  d: string;
  label: [number, number];
  terrain?: "strait" | "desert" | "sea";
  focus: string;
}

export const THEATRE_REGIONS: RegionPath[] = [
  {
    id: "egypt_home",
    d: "M 210 250 L 455 250 L 455 455 L 240 490 L 170 380 Z",
    label: [300, 360],
    terrain: "desert",
    focus: "120 220 400 300",
  },
  {
    id: "canal_zone",
    d: "M 455 250 L 500 250 L 500 430 L 455 430 Z",
    label: [477, 340],
    focus: "420 220 160 250",
  },
  {
    id: "sinai",
    d: "M 500 250 L 640 250 L 670 400 L 560 455 L 500 430 Z",
    label: [575, 340],
    terrain: "desert",
    focus: "470 220 240 280",
  },
  {
    id: "straits_tiran",
    d: "M 560 455 L 670 400 L 690 490 L 575 510 Z",
    label: [630, 470],
    terrain: "strait",
    focus: "520 380 220 160",
  },
  {
    id: "israel_home",
    d: "M 560 175 L 655 175 L 655 250 L 560 250 Z",
    label: [607, 210],
    focus: "520 140 180 160",
  },
  {
    id: "cyprus",
    d: "M 430 70 L 530 85 L 545 125 L 500 155 L 410 130 Z",
    label: [478, 112],
    focus: "380 40 200 150",
  },
  {
    id: "malta",
    d: "M 255 145 L 300 150 L 305 175 L 260 180 Z",
    label: [280, 162],
    focus: "220 110 140 120",
  },
  {
    id: "algeria",
    d: "M 40 300 L 165 290 L 175 430 L 50 450 Z",
    label: [105, 370],
    terrain: "desert",
    focus: "10 260 200 220",
  },
];

export const STATIONS: Array<{ id: string; x: number; y: number; w: number; h: number }> = [
  { id: "home_isles", x: 40, y: 40, w: 150, h: 56 },
  { id: "metropolitan_france", x: 40, y: 108, w: 150, h: 56 },
  { id: "united_states_home", x: 710, y: 40, w: 160, h: 56 },
  { id: "soviet_home", x: 710, y: 108, w: 160, h: 56 },
  { id: "hungary", x: 710, y: 176, w: 160, h: 56 },
  { id: "vienna", x: 280, y: 200, w: 150, h: 56 },
  { id: "london", x: 80, y: 80, w: 150, h: 56 },
  { id: "petersburg", x: 670, y: 60, w: 170, h: 56 },
  { id: "berlin", x: 380, y: 80, w: 150, h: 56 },
  { id: "paris", x: 160, y: 160, w: 150, h: 56 },
  { id: "stockholm", x: 480, y: 40, w: 150, h: 56 },
  { id: "madrid", x: 40, y: 280, w: 150, h: 56 },
  { id: "frankfurt", x: 320, y: 140, w: 160, h: 56 },
  { id: "belgrade", x: 420, y: 280, w: 150, h: 56 },
  { id: "constantinople", x: 560, y: 300, w: 180, h: 56 },
];

export type MapZoom = "theatre" | "regional" | "local";

export function viewBoxFor(zoom: MapZoom, territoryId: string | null): string {
  if (zoom === "theatre" || !territoryId) return "0 0 900 560";
  const region = THEATRE_REGIONS.find((r) => r.id === territoryId);
  if (region && zoom === "local") return region.focus;
  if (region && zoom === "regional") {
    const parts = region.focus.split(" ").map(Number);
    const x = parts[0] ?? 0;
    const y = parts[1] ?? 0;
    const w = parts[2] ?? 200;
    const h = parts[3] ?? 200;
    return `${x - 80} ${y - 60} ${w + 160} ${h + 140}`;
  }
  const station = STATIONS.find((s) => s.id === territoryId);
  if (station) {
    const pad = zoom === "local" ? 40 : 120;
    return `${station.x - pad} ${station.y - pad} ${station.w + pad * 2} ${station.h + pad * 2}`;
  }
  return "0 0 900 560";
}

export function stationOf(id: string) {
  return STATIONS.find((s) => s.id === id);
}

export function regionOf(id: string) {
  return THEATRE_REGIONS.find((r) => r.id === id);
}
