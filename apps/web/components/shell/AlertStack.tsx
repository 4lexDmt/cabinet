import type { DeskAlert } from "@/lib/desk-model";
import Link from "next/link";

export function AlertStack({
  alerts,
  interruptOnly = false,
  onPaper = false,
}: {
  alerts: DeskAlert[];
  interruptOnly?: boolean;
  onPaper?: boolean;
}) {
  const shown = interruptOnly ? alerts.filter((a) => a.severity === "critical") : alerts;
  if (shown.length === 0) return null;
  return (
    <div>
      {shown.map((alert) => (
        <Link
          key={alert.id}
          href={alert.href}
          className={`alert alert-${alert.severity}${onPaper ? " on-paper" : ""}`}
        >
          <div className="alert-kicker">{alert.severity}</div>
          <p className="alert-copy">{alert.copy}</p>
        </Link>
      ))}
    </div>
  );
}
