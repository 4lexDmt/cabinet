import type { VictoryNode } from "@cabinet/sim";

export interface ObjectiveLine {
  text: string;
  met: boolean;
}

export function flattenObjectives(
  node: VictoryNode,
  ctx: { met: boolean; nationId: string; evaluate: (n: VictoryNode) => boolean },
): ObjectiveLine[] {
  if ("all_of" in node) {
    return node.all_of.flatMap((child) =>
      flattenObjectives(child, { ...ctx, met: ctx.evaluate(child) }),
    );
  }
  if ("any_of" in node) {
    return node.any_of.flatMap((child) =>
      flattenObjectives(child, { ...ctx, met: ctx.evaluate(child) }),
    );
  }
  return [{ text: leafCopy(node), met: ctx.met }];
}

function leafCopy(node: VictoryNode): string {
  if ("gte" in node) {
    const [path, n] = node.gte;
    if (path === "standing_external") return `How much others trust you remains at ${n} or above.`;
    if (path === "standing_internal") return `The house holds together at ${n} or above.`;
    if (path.includes("standing_external")) return `A rival's standing falls to where you need it.`;
    return `${path} at ${n} or above.`;
  }
  if ("lte" in node) {
    const [path, n] = node.lte;
    if (path === "hungary_attention") return `Attention stays off Hungary.`;
    return `${path} no higher than ${n}.`;
  }
  if ("control" in node) {
    const place = node.control.replace("territory:", "").replaceAll("_", " ");
    return `Control of ${place}.`;
  }
  if ("status_not" in node) {
    if (node.status_not === "occupied") return "This government remains unoccupied.";
    return `This government is not ${node.status_not}.`;
  }
  if ("retain" in node) {
    if (node.retain === "canal_nationalized") return "The nationalization of the canal still stands.";
    return `Retain ${node.retain.replaceAll("_", " ")}.`;
  }
  if ("flag_eq" in node) {
    const [flag, value] = node.flag_eq;
    if (flag === "straits_tiran_open" && value === true) return "The Straits of Tiran stand open.";
    return `${flag.replaceAll("_", " ")} stands as agreed.`;
  }
  return "A condition on file.";
}
