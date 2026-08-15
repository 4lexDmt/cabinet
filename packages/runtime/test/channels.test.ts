import { describe, expect, it } from "vitest";
import { ensurePrivateChannels, openChannels, privateChannelId } from "../src/advance.ts";
import type { MatchRecord } from "@cabinet/db";

function stubMatch(nationIds: string[]): MatchRecord {
  return {
    id: "match-1",
    channels: openChannels("match-1", nationIds),
    world: {
      nations: Object.fromEntries(nationIds.map((id) => [id, { id }])),
    },
  } as unknown as MatchRecord;
}

describe("channel opening", () => {
  it("opens only the public wire at match start", () => {
    const channels = openChannels("m", ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
    expect(channels).toHaveLength(1);
    expect(channels[0]?.kind).toBe("public");
  });

  it("opens private cables for the seated chair only", () => {
    const match = stubMatch(["uk", "fr", "de", "us", "su"]);
    expect(ensurePrivateChannels(match, "uk")).toBe(true);
    expect(match.channels.filter((c) => c.kind === "dm")).toHaveLength(4);
    expect(match.channels.map((c) => c.id)).toContain(privateChannelId("match-1", "uk", "fr"));
    expect(ensurePrivateChannels(match, "uk")).toBe(false);
    expect(ensurePrivateChannels(match, "fr")).toBe(true);
    expect(match.channels.filter((c) => c.kind === "dm")).toHaveLength(7);
  });
});
