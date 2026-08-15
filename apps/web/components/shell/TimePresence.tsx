"use client";

import { useEffect, useState } from "react";

export function TimePresence({
  tick,
  ownOrdersWaiting,
}: {
  tick: number;
  ownOrdersWaiting: boolean;
}) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    setClock(fmt());
    const id = window.setInterval(() => setClock(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="time-presence">
      <div className="mono wall-clock">{clock || "——"}</div>
      <div className="mono turn">TURN {tick}</div>
      <p className="caption">
        The sitting clock runs on the wall. Sittings are resolved in the ordinary interval — not from this page.
      </p>
      {ownOrdersWaiting ? (
        <p className="caption" style={{ color: "var(--paper)" }}>
          Your orders are on the queue.
        </p>
      ) : null}
    </div>
  );
}
