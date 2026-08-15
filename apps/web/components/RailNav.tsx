"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AttentionKind, Destination } from "@/lib/desk-model";

const NAV: Array<{ href: string; dest: Destination; label: string }> = [
  { href: "/briefing", dest: "briefing", label: "Briefing" },
  { href: "/map", dest: "map", label: "Map" },
  { href: "/channels", dest: "channels", label: "Channels" },
  { href: "/pacts", dest: "pacts", label: "Pacts" },
  { href: "/nation", dest: "nation", label: "Nation" },
  { href: "/ledger", dest: "ledger", label: "Ledger" },
];

const MARK: Record<Exclude<AttentionKind, "none">, string> = {
  message: "·",
  instrument: "§",
  breach: "‡",
  ledger: "¶",
};

export function RailNav({ attention }: { attention: Record<Destination, AttentionKind> }) {
  const path = usePathname();
  return (
    <nav className="nav-destinations">
      {NAV.map((item) => {
        const on = path === item.href || path.startsWith(`${item.href}/`);
        const kind = attention[item.dest];
        const classes = ["dest-link", on ? "on" : "", kind !== "none" ? `kind-${kind}` : ""]
          .filter(Boolean)
          .join(" ");
        return (
          <Link key={item.href} href={item.href} className={classes}>
            <span>{item.label}</span>
            {kind !== "none" ? (
              <span className={`attn attn-${kind}`} title={kind}>
                {MARK[kind]}
              </span>
            ) : (
              <span />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
