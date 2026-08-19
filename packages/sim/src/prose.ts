import type { Obligation, PactTerms } from "./types.ts";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export function roman(index: number): string {
  return ROMAN[index] ?? String(index + 1);
}

export function obligationProse(
  obligation: Obligation,
  names: Record<string, string>,
): string {
  const party = names[obligation.party] ?? obligation.party;
  const target = obligation.target ? (names[obligation.target] ?? obligation.target) : "the named territory";
  switch (obligation.must) {
    case "not_move_forces_into":
      return `${party} undertakes not to move forces into ${target}.`;
    case "maintain_trade_route":
      return `${party} undertakes to keep open the trade route with ${target}.`;
    case "not_declare_war_on":
      return `${party} undertakes not to declare war upon ${target}.`;
    case "share_intelligence_on":
      return `${party} undertakes to share intelligence concerning ${target} with the other signatories.`;
    case "provide_passage":
      return `${party} undertakes to provide passage to the forces of ${target}.`;
    case "pay_tribute": {
      const amount = Number(obligation.params?.amount ?? 0);
      return `${party} undertakes to pay tribute of ${amount} to ${target} each sitting.`;
    }
    case "maintain_minimum_flow":
      return `${party} undertakes to maintain minimum flow on ${target}.`;
    case "not_construct_upstream_of":
      return `${party} undertakes not to construct upstream of ${target}.`;
    case "share_hydrological_data":
      return `${party} undertakes to share hydrological data on ${target}.`;
    case "permit_navigation":
      return `${party} undertakes to permit navigation to ${target}.`;
    default:
      return `${party} undertakes the obligation recorded herein.`;
  }
}

export function assembleTreatyBody(terms: PactTerms, names: Record<string, string>): string[] {
  return terms.obligations.map((o) => obligationProse(o, names));
}
