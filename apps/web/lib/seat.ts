import { getSession } from "./session";
import { getStore } from "./store";
import { redirect } from "next/navigation";

export async function loadMatch() {
  const session = await getSession();
  if (!session) redirect("/");
  const match = await getStore().getMatch(session.matchId);
  if (!match) redirect("/");
  return { session, match };
}

export async function loadSeat() {
  const { session, match } = await loadMatch();
  if (!session.nationId) redirect("/join");
  const nation = match.world.nations[session.nationId];
  if (!nation) redirect("/join");
  return { session, match, nation };
}
