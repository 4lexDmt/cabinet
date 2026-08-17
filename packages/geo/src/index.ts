/**
 * @cabinet/geo — the map domain.
 *
 * Pure geometry, projection, cartographic rule and point-of-view logic. No I/O,
 * no React, no database, and — the invariant this package exists to protect —
 * no dependency on @cabinet/sim in either direction.
 */

export type {
  BBox,
  BoundaryClass,
  BoundaryPerspective,
  LonLat,
  MaritimeZone,
  PlaceTier,
  Point,
  RoadClass,
  TerritoryGeometry,
  ZoneCharacter,
} from "./types.js";

export {
  BOUNDARY_LEGEND,
  NEUTRAL_OBSERVER,
  PERSPECTIVE_CODES,
  boundaryPerspectives,
  disagreements,
  fclassField,
  isBoundaryClass,
  normalizeBoundaryClass,
  povKey,
  readBoundary,
} from "./boundary.js";
export type { PerspectiveCode, PerspectiveResult, UnmappedBoundaryValue } from "./boundary.js";

export {
  CANNON_SHOT_ERA,
  DIFFERENCE_ORDER,
  NAUTICAL_MILE_KM,
  PUBLISHED_EEZ_INCLUDES_INNER_ZONES,
  SOVEREIGN_ZONES,
  UNCLOS_ERA,
  ZONE_LADDER,
  bandGaps,
  bandOverlaps,
  characterOf,
  isTerritorialWater,
  kmToNm,
  nmToKm,
  waterClassOf,
  zoneAtDistanceNm,
  zoneBands,
} from "./maritime.js";
export type { BandOverlap, MaritimeEra, WaterClass, ZoneBand } from "./maritime.js";

export {
  FIR_ESTABLISHED_YEAR,
  SOVEREIGN_AIRSPACE_COMPONENTS,
  VERTICAL_LIMIT,
  airspaceRules,
  firsExistInYear,
  sovereignAirspaceReachNm,
} from "./airspace.js";
export type { AirspaceComponent, AirspaceLayer, AirspaceRules } from "./airspace.js";

export {
  EARTH_RADIUS_M,
  RESOLUTION_Z0,
  bboxContains,
  conicConformal,
  equirectangular,
  fitBounds,
  kmPerPixel,
  mercator,
  project,
  projectionFor,
  projectionSuitsBbox,
  recommendProjection,
  unproject,
  viewportBounds,
  zoomOf,
} from "./projection.js";
export type { FitOptions, Projection, ProjectionKind, Viewport } from "./projection.js";

export {
  MOBILE_LABEL_BUDGET,
  PLACE_TIERS,
  REGISTERS,
  labelledPlaces,
  placeFrom,
  placeTierOf,
  visiblePlaces,
} from "./places.js";
export type { Place, RawPlaceProperties, ZoomRegister } from "./places.js";

export {
  KEPT_OVERTURE_CLASSES,
  ROAD_ERA_LABEL,
  ROAD_MIN_ZOOM,
  eraSupportsRoadLayer,
  roadClassOf,
  roadEraForYear,
  roadVisibleAt,
} from "./roads.js";
export type { RoadEra } from "./roads.js";

export {
  AREA_INK_BUDGET,
  BOUNDARY_INK,
  DEMOTED_INK_FACTOR,
  LABEL_ANCHORS,
  MEDIAN_LINE_INK,
  PLACE_MARK,
  TOKEN,
  WEIGHT,
  ZONE_INK,
  emphasise,
  inkLedger,
} from "./cartography.js";
export type { InkLedger, OverlayCost, PlaceMark, StrokeSpec, ZoneInk } from "./cartography.js";

export {
  STATE_INK,
  blindReading,
  boundaryConfidencePaint,
  collapseIntelSource,
  confidenceOf,
  forceMarkPaint,
  ownReading,
  readingFrom,
  readingState,
  stalenessOf,
  stateLegend,
  territoryPaint,
} from "./belief-paint.js";
export type {
  AreaPaint,
  LinePaint,
  MapConfidence,
  MapProvenance,
  MapReading,
  MapStaleness,
  MarkPaint,
  ReadingState,
} from "./belief-paint.js";

export {
  PHYSICAL_LAYERS,
  UNCLOS_IN_FORCE_YEAR,
  UNCLOS_SIGNED_YEAR,
  contiguousZoneExistsInYear,
  eezExistsInYear,
  layerAbsenceReason,
  layerPermitted,
  resolveScenarioGeo,
  scenarioGeoSchema,
  territorialSeaNmForYear,
} from "./scenario-geo.js";
export type { ResolvedScenarioGeo, ScenarioGeoConfig, ScenarioLayer } from "./scenario-geo.js";

export {
  bboxOf,
  createRegistry,
  parseManifest,
  polygonCentroid,
  territoryGeometrySchema,
  territoryManifestSchema,
} from "./registry.js";
export type { TerritoryManifest, TerritoryRegistry } from "./registry.js";

export { declutter } from "./declutter.js";
export type { LabelBox, PlacedLabel, DeclutterResult } from "./declutter.js";
