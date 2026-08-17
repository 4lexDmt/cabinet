"use client";

import { useEffect, useState } from "react";
import { loadAttribution, type Attribution } from "@/lib/atlas/layers";

/**
 * The colophon says where the geometry comes from and under what terms.
 *
 * It is shown by default rather than hidden behind an icon. Every source here
 * is public-domain Natural Earth, so nothing on this sheet carries an
 * attribution obligation — which is a deliberate starting position and worth
 * stating, because the moment an Overture layer arrives it stops being true.
 */
export function Colophon({ onDismiss }: { onDismiss: () => void }) {
  const [attribution, setAttribution] = useState<Attribution | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAttribution()
      .then((data) => {
        if (!cancelled) setAttribution(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const used = attribution?.sources.filter((s) => s.used) ?? [];
  const owed = used.filter((s) => s.required);

  return (
    <div className="atlas-colophon">
      <h3>A map is a claim, not a fact</h3>
      <p>
        One geometry, several beliefs about it. Switch perspective and contested boundaries redraw —
        no refetch, no second tileset. Every segment carries one property per government, and where a
        government has no entry it simply accepts the neutral line.
      </p>
      <p>
        Start on Kashmir. From Delhi the Line of Control is an international boundary. From Islamabad
        it is an internal administrative line. To nobody in particular it is a de facto military line
        with no agreed legal status. All three ship in the same file.
      </p>
      <p className="src">
        {used.length > 0
          ? `${used.length} sources · ${owed.length === 0 ? "none require attribution" : `${owed.length} require attribution`}`
          : "Natural Earth 1:50m and 1:10m"}
        {attribution ? ` · generated ${attribution.generatedAt}` : ""}
      </p>
      <button type="button" onClick={onDismiss}>
        Read the map
      </button>
    </div>
  );
}
