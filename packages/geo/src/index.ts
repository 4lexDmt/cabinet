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
} from "./types.ts";

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
} from "./boundary.ts";
export type { PerspectiveCode, PerspectiveResult, UnmappedBoundaryValue } from "./boundary.ts";

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
} from "./maritime.ts";
export type { BandOverlap, MaritimeEra, WaterClass, ZoneBand } from "./maritime.ts";

export {
  FIR_ESTABLISHED_YEAR,
  SOVEREIGN_AIRSPACE_COMPONENTS,
  VERTICAL_LIMIT,
  airspaceRules,
  firsExistInYear,
  sovereignAirspaceReachNm,
} from "./airspace.ts";
export type { AirspaceComponent, AirspaceLayer, AirspaceRules } from "./airspace.ts";

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
} from "./projection.ts";
export type { FitOptions, Projection, ProjectionKind, Viewport } from "./projection.ts";

export {
  MOBILE_LABEL_BUDGET,
  PLACE_TIERS,
  REGISTERS,
  labelledPlaces,
  placeFrom,
  placeTierOf,
  visiblePlaces,
} from "./places.ts";
export type { Place, RawPlaceProperties, ZoomRegister } from "./places.ts";

export {
  KEPT_OVERTURE_CLASSES,
  ROAD_ERA_LABEL,
  ROAD_MIN_ZOOM,
  eraSupportsRoadLayer,
  roadClassOf,
  roadEraForYear,
  roadVisibleAt,
} from "./roads.ts";
export type { RoadEra } from "./roads.ts";

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
  emphasiseZone,
  inkLedger,
} from "./cartography.ts";
export type { InkLedger, OverlayCost, PlaceMark, StrokeSpec, ZoneInk } from "./cartography.ts";

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
} from "./belief-paint.ts";
export type {
  AreaPaint,
  LinePaint,
  MapConfidence,
  MapProvenance,
  MapReading,
  MapStaleness,
  MarkPaint,
  ReadingState,
} from "./belief-paint.ts";

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
} from "./scenario-geo.ts";
export type { ResolvedScenarioGeo, ScenarioGeoConfig, ScenarioLayer } from "./scenario-geo.ts";

export {
  bboxOf,
  createRegistry,
  parseManifest,
  polygonCentroid,
  territoryGeometrySchema,
  territoryManifestSchema,
} from "./registry.ts";
export type { TerritoryManifest, TerritoryRegistry } from "./registry.ts";

export { declutter } from "./declutter.ts";
export type { LabelBox, PlacedLabel, DeclutterResult } from "./declutter.ts";

export { bboxIntersects, geometryBbox, geometryPath, padBbox } from "./path.ts";
export type { Projector } from "./path.ts";

export { marchingSquares, ringsToPath } from "./contour.ts";
export type { Ring } from "./contour.ts";

export {
  LAND,
  UNCLAIMED,
  buildMaritimeField,
  densify,
  highSeasPath,
  medianLinePath,
  zoneBandPath,
  zoneLadderPaths,
  zoneLimitPath,
} from "./maritime-field.ts";
export type { CoastSamples, FieldOptions, MaritimeField, ZoneBandPath } from "./maritime-field.ts";
