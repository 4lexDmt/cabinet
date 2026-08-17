"use client";

import { NEUTRAL_OBSERVER, type InkLedger, type ZoomRegister } from "@cabinet/geo";
import { PERSPECTIVES, perspectiveOf } from "@/lib/atlas/perspectives";
import type { OverlayDef, OverlayId } from "@/lib/atlas/overlays";
import type { SheetConfig } from "@/lib/atlas/sheets";

export interface RailProps {
  sheets: SheetConfig[];
  sheetId: string;
  onSheet: (id: string) => void;
  observer: string;
  onObserver: (code: string) => void;
  parties: string[];
  overlays: OverlayDef[];
  enabled: Set<string>;
  demoted: Set<string>;
  onToggle: (id: OverlayId) => void;
  ledger: InkLedger;
  register: ZoomRegister;
  brief: string;
}

export function Rail(props: RailProps) {
  const perspective = perspectiveOf(props.observer);

  return (
    <aside className="atlas-rail">
      <section>
        <h2>Sheet</h2>
        <div className="atlas-sheets">
          {props.sheets.map((sheet) => (
            <button
              key={sheet.id}
              type="button"
              aria-pressed={sheet.id === props.sheetId}
              onClick={() => props.onSheet(sheet.id)}
            >
              {sheet.label}
              <span>{sheet.scale}</span>
            </button>
          ))}
        </div>
        <p className="note">{props.brief}</p>
      </section>

      <section>
        <h2>Perspective</h2>
        <div className="atlas-persp">
          <div className="row">
            <button
              type="button"
              aria-pressed={props.observer === NEUTRAL_OBSERVER}
              onClick={() => props.onObserver(NEUTRAL_OBSERVER)}
            >
              Neutral
            </button>
            {props.parties.slice(0, 5).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={props.observer === code}
                onClick={() => props.onObserver(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <label>
            <span className="sr-only">Perspective</span>
            <select
              value={props.observer}
              onChange={(event) => props.onObserver(event.target.value)}
            >
              {PERSPECTIVES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="note">{perspective.stance}</p>
      </section>

      <section>
        <h2>Overlays</h2>
        <div className="atlas-overlays">
          {props.overlays.map((overlay) => (
            <button
              key={overlay.id}
              type="button"
              className="atlas-overlay"
              data-on={props.enabled.has(overlay.id) ? "1" : "0"}
              data-demoted={props.demoted.has(overlay.id) ? "1" : "0"}
              aria-pressed={props.enabled.has(overlay.id)}
              onClick={() => props.onToggle(overlay.id)}
            >
              <span className="box" />
              <span>
                <span className="nm">{overlay.name}</span>
                <span className="q">{overlay.question}</span>
                {props.demoted.has(overlay.id) ? (
                  <span className="demote">LINE ONLY — AREA INK YIELDED</span>
                ) : null}
              </span>
            </button>
          ))}
        </div>

        <div className={props.ledger.overBudget ? "atlas-meter over" : "atlas-meter"}>
          <div className="cap">
            <span>AREA INK</span>
            <span>{props.ledger.spent.toFixed(2)} / 1.00</span>
          </div>
          <div className="bar">
            {props.ledger.active.map((id, index) => {
              const overlay = props.overlays.find((o) => o.id === id);
              const width = (index === 0 ? overlay?.area ?? 0 : (overlay?.area ?? 0) * 0.18) * 100;
              return (
                <i
                  key={id}
                  style={{
                    width: `${Math.min(100, width)}%`,
                    background: index === 0 ? "var(--ink-3)" : "var(--ink-5)",
                  }}
                />
              );
            })}
          </div>
        </div>
        <p className="note">
          Only one overlay may spend area ink. A second yields its fills and renders as line only,
          so any two stay legible stacked.
        </p>
      </section>

      <section>
        <h2>Register says</h2>
        <p className="note">{props.register.says}</p>
        <p className="note">
          <code>
            {props.register.label} · tiers {props.register.tiers.length} · budget{" "}
            {props.register.labelBudget}
          </code>
        </p>
      </section>
    </aside>
  );
}
