import { WarningIcon } from "@/redesignComponents/foundations/Icons";

/**
 * Presentational cells shared by every polygon/site data table.
 *
 * These were duplicated in the project and site tables while those were built in parallel. They live
 * here so there is exactly one definition of how a status pill, a validation pill, an anomaly flag,
 * a select checkbox, and a null-vs-zero number render — the same guarantee the level contract gives
 * the indicators: one place per rule.
 */

// "—" for anything absent — never 0. A null hectare/tree/area figure means "not measured", which is
// a different fact than a genuine zero.
export const orDash = (value: number | null | undefined, suffix = ""): string =>
  value == null ? "—" : `${value.toLocaleString()}${suffix}`;

// Status is workflow position; validation is geometry health. Two separate axes, two separate pills,
// matching what PolygonDetailView shows.
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  "pending-approval": "Pending approval",
  "information-required": "Information required",
  approved: "Approved"
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-theme-neutral-200 text-theme-neutral-800",
  "pending-approval": "bg-theme-warning-100 text-theme-warning-900",
  "information-required": "bg-theme-warning-100 text-theme-warning-900",
  approved: "bg-theme-success-100 text-theme-success-900"
};

const VALIDATION_LABELS: Record<string, string> = {
  passed: "Passed",
  partial: "Partial",
  failed: "Failed"
};

const VALIDATION_STYLES: Record<string, string> = {
  passed: "bg-theme-success-100 text-theme-success-900",
  partial: "bg-theme-warning-100 text-theme-warning-900",
  failed: "bg-theme-error-100 text-theme-error-900"
};

export const Pill = ({ label, className }: { label: string; className: string }) => (
  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ${className}`}>
    {label}
  </span>
);

/** Workflow status pill; "—" and a neutral tone when the status is unset. */
export const StatusPill = ({ status }: { status: string | null | undefined }) => (
  <Pill
    label={status == null ? "—" : STATUS_LABELS[status] ?? status}
    className={
      status == null
        ? "bg-theme-neutral-100 text-theme-neutral-500"
        : STATUS_STYLES[status] ?? "bg-theme-neutral-200 text-theme-neutral-800"
    }
  />
);

/** Geometry-validation pill; "—" and a neutral tone when validation has not run. */
export const ValidationPill = ({ validationStatus }: { validationStatus: string | null | undefined }) => {
  const key = validationStatus?.toLowerCase() ?? null;
  return (
    <Pill
      label={key == null ? "—" : VALIDATION_LABELS[key] ?? validationStatus!}
      className={
        key == null
          ? "bg-theme-neutral-100 text-theme-neutral-500"
          : VALIDATION_STYLES[key] ?? "bg-theme-neutral-200 text-theme-neutral-800"
      }
    />
  );
};

/** The merged anomaly count. A flag pill when flagged, a quiet "0" otherwise — the count is a real
 * measurement (never null), so a genuine zero is "0", not "—". */
export const AnomaliesCell = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="inline-flex items-center gap-1 rounded bg-theme-warning-100 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-theme-warning-900">
      <WarningIcon boxSize={2.5} />
      {count.toLocaleString()}
    </span>
  ) : (
    <span className="text-xs text-theme-neutral-400">0</span>
  );

/** A checkbox that can show the "some but not all" indeterminate state (native checkboxes only
 * expose this via a DOM ref, not a prop). Stops click propagation so selecting never navigates. */
export const TriStateCheckbox = ({
  checked,
  indeterminate,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  ariaLabel: string;
}) => (
  <input
    ref={node => {
      if (node) node.indeterminate = !checked && indeterminate;
    }}
    type="checkbox"
    aria-label={ariaLabel}
    checked={checked}
    onChange={onChange}
    onClick={event => event.stopPropagation()}
    className="h-3.5 w-3.5 cursor-pointer accent-theme-primary-500"
  />
);

/** The "show only flagged" toggle button, shared by the table toolbars. */
export const FlaggedFilterButton = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={
      active
        ? "inline-flex items-center gap-1 rounded border border-theme-warning-500 bg-theme-warning-100 px-2 py-1 text-xs font-medium text-theme-warning-900"
        : "inline-flex items-center gap-1 rounded border border-theme-neutral-200 px-2 py-1 text-xs text-theme-neutral-600 hover:bg-theme-neutral-100"
    }
  >
    <WarningIcon boxSize={2.5} />
    Show only flagged
  </button>
);
