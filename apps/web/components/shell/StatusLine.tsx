import type { Nation } from "@cabinet/sim";
import { statusLabel } from "@/lib/desk-model";

export function StatusLine({ nation }: { nation: Nation }) {
  return (
    <header className={`status-line status-${nation.status}`}>
      <h1 className="status-nation">{nation.name}</h1>
      <div className="status-flag">{statusLabel(nation.status)}</div>
    </header>
  );
}
