import Link from "next/link";
import { useState } from "react";

import { Anomaly, AnomalySeverity, AnomalyType } from "../anomalies/types";
import ActionRow from "./ActionRow";

/**
 * A collapsed summary of many same-kind anomalies.
 *
 * Validation runs on every polygon, and "partial" is the common resting state, so a raw list buries
 * the few anomalies that actually warrant a decision under dozens of identical validation rows. This
 * row states the group once — "75 polygons need geometry review" — offers a single bulk action, and
 * expands to the individual rows only on request. Singleton groups never reach this component; the
 * panel renders those as plain ActionRows so a lone watchlist anomaly keeps its own voice.
 */

const SEVERITY_DOT: Record<AnomalySeverity, string> = {
  high: "bg-theme-warning-900",
  medium: "bg-theme-warning-500",
  low: "bg-theme-neutral-400"
};

// Noun phrase per type, used only when a group has more than one member. geometryValidation is split
// by severity (failed vs partial) in groupTitle rather than here.
const GROUP_NOUN: Record<AnomalyType, string> = {
  geometryValidation: "polygons",
  underMapped: "under-mapped areas",
  overMapped: "over-mapped areas",
  noActivityAfterPlantStart: "sites with no polygon activity",
  implausibleDensity: "polygons with implausible tree density",
  treesVsHectaresDesync: "trees / hectares mismatches",
  hectaresProgressOutlier: "hectares-progress outliers",
  reportsVsPolygons: "report vs polygon mismatches"
};

const groupTitle = (type: AnomalyType, severity: AnomalySeverity, count: number): string => {
  if (type === "geometryValidation") {
    return severity === "high"
      ? `${count} polygons failed geometry validation`
      : `${count} polygons need geometry review`;
  }
  return `${count} ${GROUP_NOUN[type]}`;
};

const linkButtonClass =
  "inline-flex items-center rounded border border-theme-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-theme-neutral-800 transition-colors hover:border-theme-primary-500 hover:text-theme-primary-500";

const primaryButtonClass =
  "inline-flex items-center rounded border border-theme-success-500 bg-theme-success-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-theme-success-900 hover:border-theme-success-900 disabled:cursor-not-allowed disabled:opacity-60";

export interface ActionGroupRowProps {
  items: Anomaly[];
  projectUuid: string;
  isApprovable: (anomaly: Anomaly) => boolean;
  isApproving: (anomalyId: string) => boolean;
  onApprove: (anomaly: Anomaly) => void;
  onApproveMany: (group: Anomaly[]) => void;
  onDismiss: (anomalyId: string) => void;
  onDismissMany: (anomalyIds: string[]) => void;
}

const ActionGroupRow = ({
  items,
  projectUuid,
  isApprovable,
  isApproving,
  onApprove,
  onApproveMany,
  onDismiss,
  onDismissMany
}: ActionGroupRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const { type, severity } = items[0];
  const approvableCount = items.filter(isApprovable).length;
  const groupApproving = items.some(item => isApproving(item.id));

  return (
    <li className="border-b border-theme-neutral-200 last:border-b-0">
      <div className="flex items-start justify-between gap-3 py-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[severity]}`} role="presentation" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-theme-neutral-900">{groupTitle(type, severity, items.length)}</p>
            <button
              type="button"
              onClick={() => setExpanded(value => !value)}
              className="mt-0.5 text-xs text-theme-neutral-500 hover:text-theme-primary-500 hover:underline"
              aria-expanded={expanded}
            >
              {expanded ? "Hide" : "Show"} {items.length} {items.length === 1 ? "item" : "items"}
            </button>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {approvableCount > 0 && (
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => onApproveMany(items)}
              disabled={groupApproving}
            >
              {groupApproving ? "Approving…" : `Approve all ${approvableCount}`}
            </button>
          )}
          {/* The Details tab carries the "show only flagged" table, which is where a reviewer works
              through the group one polygon at a time. */}
          <Link href={`/project/${projectUuid}?tab=details`} className={linkButtonClass}>
            Review in table
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded px-2 py-1 text-xs font-medium text-theme-neutral-400 transition-colors hover:text-theme-neutral-800"
            onClick={() => onDismissMany(items.map(item => item.id))}
          >
            Dismiss all
          </button>
        </div>
      </div>

      {expanded && (
        <ul className="border-t border-theme-neutral-100 pl-5">
          {items.map(anomaly => (
            <ActionRow
              key={anomaly.id}
              anomaly={anomaly}
              projectUuid={projectUuid}
              approvable={isApprovable(anomaly)}
              approving={isApproving(anomaly.id)}
              onApprove={onApprove}
              onDismiss={onDismiss}
              compact
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default ActionGroupRow;
