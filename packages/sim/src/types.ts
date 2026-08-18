/** Integer milles: 1 = 0.01%. 10_000 = 100%. */

export type NationStatus = "sovereign" | "rump" | "occupied" | "exile" | "client";

export type PactStatus = "draft" | "pending" | "active" | "broken" | "expired";

export type BeliefSource =
  | "direct_observation"
  | "ally_share"
  | "purchased_intel"
  | "inference"
  | "planted";

export type PredicateName =
  | "not_move_forces_into"
  | "maintain_trade_route"
  | "not_declare_war_on"
  | "share_intelligence_on"
  | "provide_passage"
  | "pay_tribute";

export type OrderKind =
  | "propose_pact"
  | "accept_pact"
  | "reject_pact"
  | "break_pact"
  | "declare_war"
  | "move_formation"
  | "economic_pressure"
  | "share_intelligence"
  | "pay_tribute"
  | "set_posture";

export type VisibilityRule =
  | { kind: "public" }
  | { kind: "nations"; nation_ids: string[] };

export interface Obligation {
  id: string;
  party: string;
  must: PredicateName;
  target?: string;
  params?: Record<string, number | string | boolean>;
}

export interface PactTerms {
  title: string;
  type: "defense" | "non_aggression" | "trade" | "passage" | "tribute" | "custom";
  duration_ticks?: number;
  secret: boolean;
  obligations: Obligation[];
}

export interface Nation {
  id: string;
  name: string;
  shortName: string;
  adjective: string;
  standing_external: number;
  standing_internal: number;
  economy: number;
  intelligence_capacity: number;
  supply: number;
  status: NationStatus;
  playerId: string | null;
}

export interface Territory {
  id: string;
  name: string;
  owner: string;
  controller: string;
  region: string;
  supplyValue: number;
}

export interface Formation {
  id: string;
  nationId: string;
  location: string;
  destination: string | null;
  strength: number;
  inTransit: boolean;
  /** Remaining travel on the corridor graph. 0 when idle or teleporting. */
  ticks_remaining: number;
}

export interface Corridor {
  id: string;
  a: string;
  b: string;
  travel_ticks: number;
  kind: string;
  gauge_from?: number;
  gauge_to?: number;
}

export interface Pact {
  id: string;
  parties: string[];
  secret: boolean;
  visible_to: string[];
  public_terms: PactTerms;
  private_terms: PactTerms;
  status: PactStatus;
  broken_by: string | null;
  broken_tick: number | null;
  signed_by: string[];
  created_tick: number;
  activated_tick: number | null;
}

export interface Belief {
  observer_nation_id: string;
  subject_type: "nation" | "territory" | "formation" | "pact" | "flag" | "war";
  subject_id: string;
  field: string;
  believed_value: unknown;
  confidence: number;
  source: BeliefSource;
  last_updated_tick: number;
}

export interface War {
  id: string;
  attacker: string;
  defender: string;
  declared_tick: number;
}

export interface TradeRoute {
  id: string;
  from: string;
  to: string;
  open: boolean;
}

export interface Posture {
  nationId: string;
  engagement: "hold" | "defend" | "pressure" | "withdraw";
  /** Delegation may never include break_pact or declare_war. */
  delegation: Array<Exclude<OrderKind, "break_pact" | "declare_war">>;
}

export interface Tuning {
  secret_pact_leak_base_chance_mille: number;
  standing_penalty_on_breach: number;
  cascade_depth_cap: number;
}

export interface GameEvent {
  id: string;
  tick: number;
  type: string;
  actor_id: string | null;
  subject_ids: string[];
  payload: Record<string, unknown>;
  visibility_rule: VisibilityRule;
  cause_event_id: string | null;
}

export interface Order {
  id: string;
  nationId: string;
  seq: number;
  kind: OrderKind;
  payload: Record<string, unknown>;
}

export interface WorldState {
  matchId: string;
  scenarioId: string;
  tick: number;
  seed: number;
  nations: Record<string, Nation>;
  territories: Record<string, Territory>;
  formations: Record<string, Formation>;
  pacts: Record<string, Pact>;
  beliefs: Belief[];
  wars: War[];
  tradeRoutes: TradeRoute[];
  corridors: Corridor[];
  postures: Record<string, Posture>;
  flags: Record<string, number | string | boolean>;
  victory: Record<string, unknown>;
  tuning: Tuning;
  lastEventSeq: number;
}

export interface TickOptions {
  assertEvents?: boolean;
  /** Test-only: shuffle internal iteration so order-sensitivity can be proven. */
  shuffleIteration?: boolean;
  effectRules?: EffectRule[];
  advisorTemplates?: AdvisorTemplate[];
}

export interface EffectRule {
  id: string;
  trigger: string;
  condition?: string;
  effects: Array<{
    target: EffectTarget;
    delta: number;
  }>;
  emits: string[];
}

export type EffectTarget =
  | { nation: "event.actor_id"; field: NationNumericField }
  | { nation: "event.subject"; field: NationNumericField }
  | { nationId: string; field: NationNumericField };

export type NationNumericField =
  | "standing_external"
  | "standing_internal"
  | "economy"
  | "intelligence_capacity"
  | "supply";

export interface AdvisorTemplate {
  id: string;
  advisor_set: string;
  when: string;
  voice: string;
  body: string;
}

export interface TickResult {
  state: WorldState;
  events: GameEvent[];
  warnings: string[];
}

export interface TickContext {
  state: WorldState;
  orders: Order[];
  rng: SeededRng;
  events: GameEvent[];
  warnings: string[];
  options: TickOptions;
  mutationCount: number;
  /** Baseline snapshot used by the silent-mutation assertion. */
  baseline: WorldState;
}

export interface SeededRng {
  nextU32(): number;
  int(maxExclusive: number): number;
  intRange(minInclusive: number, maxExclusive: number): number;
  chanceMille(mille: number): boolean;
  pick<T>(items: readonly T[]): T;
  shuffleInPlace<T>(items: T[]): T[];
}
