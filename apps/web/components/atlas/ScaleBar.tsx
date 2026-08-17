"use client";

/** Kilometres and nautical miles both, because half this map is about the sea. */
export function ScaleBar({ kmPerPx }: { kmPerPx: number }) {
  if (!Number.isFinite(kmPerPx) || kmPerPx <= 0) return null;
  const target = 130;
  const raw = target * kmPerPx;
  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const nice = [1, 2, 2.5, 5, 10]
    .map((m) => m * power)
    .reduce((a, b) => (Math.abs(b - raw) < Math.abs(a - raw) ? b : a));
  const widthPx = nice / kmPerPx;

  return (
    <div className="atlas-scale">
      <svg width={widthPx + 2} height={13} aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={1 + (i * widthPx) / 4}
            y={4}
            width={widthPx / 4}
            height={5}
            fill={i % 2 ? "var(--paper)" : "var(--ink)"}
            stroke="var(--ink)"
            strokeWidth={0.5}
          />
        ))}
      </svg>
      <div>
        0 — {nice.toLocaleString()} KM · {Math.round(nice / 1.852).toLocaleString()} NM
      </div>
    </div>
  );
}
