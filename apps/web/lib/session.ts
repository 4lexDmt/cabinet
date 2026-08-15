import { cookies } from "next/headers";

export interface Session {
  matchId: string;
  nationId: string;
}

const COOKIE = "cabinet_session";

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.matchId) return null;
    return { matchId: parsed.matchId, nationId: parsed.nationId ?? "" };
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(session), { httpOnly: true, sameSite: "lax", path: "/" });
}
