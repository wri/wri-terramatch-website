import Link from "next/link";

import { Anomaly, AnomalySeverity } from "../anomalies/types";

/**
 * One action row, shared by the project panel and the per-entity strip.
 *
 * The row is deliberately dumb: it renders the anomaly and whichever control applies, and calls back
 * up for the two side effects (approve, dismiss). All the "can this be approved" logic lives in
 * `useAnomalyActions`, so the visual and the behaviour cannot disagree.
 */

// high is the red-ish warning tone the design note calls for; medium is amber; low is neutral.
const SEVERITY_DOT: Record<AnomalySeverity, string> = {
  high: "bg-theme-warning-900",
  medium: "bg-theme-warning-500",
  low: "bg-theme-neutral-400"
};

const SEVERITY_LABEL: Record<AnomalySeverity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low"
};

/**
 * Where the affected entity lives. Project-level anomalies have no page of their own beyond the
 * project itself, so they return null and render as plain text rather than a link.
 */
const entityHref = (anomaly: Anomaly, projectUuid: string): string | null => {
  if (anomaly.level === "site") return `/site/${anomaly.entityUuid}`;
  if (anomaly.level === "polygon") return `/project/${projectUuid}/polygon/${anomaly.entityUuid}`;
  return null;
};

// The target a Review / Fix-data control routes to. Falls back to the project page for project-level
// anomalies, which have no narrower page.
const actionHref = (anomaly: Anomaly, projectUuid: string): string =>
  entityHref(anomaly, projectUuid) ?? `/project/${projectUuid}`;

const primaryButtonClass =
  "inline-flex items-center rounded border border-theme-success-500 bg-theme-success-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-theme-success-900 hover:border-theme-success-900 disabled:cursor-not-allowed disabled:opacity-60";

const linkButtonClass =
  "inline-flex items-center rounded border border-theme-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-theme-neutral-800 transition-colors hover:border-theme-primary-500 hover:text-theme-primary-500";

const dismissButtonClass =
  "inline-flex items-center rounded px-2 py-1 text-xs font-medium text-theme-neutral-400 transition-colors hover:text-theme-neutral-800";

export interface ActionRowProps {
  anomaly: Anomaly;
  projectUuid: string;
  approvable: boolean;
  approving: boolean;
  onApprove: (anomaly: Anomaly) => void;
  onDismiss: (anomalyId: string) => void;
  /** Condensed layout for the per-entity strip on a polygon page. */
  compact?: boolean;
}

const ActionRow = ({ anomaly, projectUuid, approvable, approving, onApprove, onDismiss, compact }: ActionRowProps) => {
  const href = entityHref(anomaly, projectUuid);
  const { suggestedAction } = anomaly;

  // The control set. When the anomaly is genuinely approvable, the primary act is a real Approve, and
  // the suggested label ("Fix geometry") stays available as a secondary deep-link to go and fix it.
  // Otherwise the suggested action drives a single deep-link, styled by its kind.
  const controls = (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {approvable ? (
        <>
          <button type="button" className={primaryButtonClass} onClick={() => onApprove(anomaly)} disabled={approving}>
            {approving ? "Approving…" : "Approve"}
          </button>
          <Link href={actionHref(anomaly, projectUuid)} className={linkButtonClass}>
            {suggestedAction.label}
          </Link>
        </>
      ) : (
        <Link href={actionHref(anomaly, projectUuid)} className={linkButtonClass}>
          {suggestedAction.kind === "review" ? "Review" : suggestedAction.label}
        </Link>
      )}
      <button
        type="button"
        className={dismissButtonClass}
        onClick={() => onDismiss(anomaly.id)}
        aria-label={`Dismiss “${anomaly.title}”`}
      >
        Dismiss
      </button>
    </div>
  );

  return (
    <li
      className={`flex items-start justify-between gap-3 ${
        compact ? "py-2" : "py-3"
      } border-b border-theme-neutral-200 last:border-b-0`}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[anomaly.severity]}`}
          role="presentation"
          title={`${SEVERITY_LABEL[anomaly.severity]} severity`}
        />
        <div className="min-w-0">
          <p className={`font-semibold text-theme-neutral-900 ${compact ? "text-xs" : "text-sm"}`}>{anomaly.title}</p>
          {!compact && <p className="mt-0.5 text-xs leading-snug text-theme-neutral-600">{anomaly.detail}</p>}
          {href == null ? (
            <p className="mt-1 truncate text-[11px] text-theme-neutral-400">{anomaly.entityName}</p>
          ) : (
            <Link
              href={href}
              className="mt-1 inline-block truncate text-[11px] text-theme-neutral-500 hover:text-theme-primary-500 hover:underline"
            >
              {anomaly.entityName}
            </Link>
          )}
        </div>
      </div>
      {controls}
    </li>
  );
};

export default ActionRow;
