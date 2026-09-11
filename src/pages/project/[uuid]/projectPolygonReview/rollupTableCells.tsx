import { FC } from "react";

import { WarningIcon } from "@/redesignComponents/foundations/Icons";

/**
 * Small presentational cells shared by ProjectSiteRollupTable, ported from the prototype
 * (`design/project-data-experience:src/components/entityData/polygonTableCells.tsx`) — see
 * docs/plans/project-polygons-site-rollup-plan.md §1/T3.
 */

// "—" for anything absent — never 0. A null/undefined figure means "not measured" or "not yet
// computed" (see useProjectSiteRollup's interim bucket fields), a different fact than a genuine zero.
export const orDash = (value: number | null | undefined, suffix = ""): string =>
  value == null ? "—" : `${value.toLocaleString()}${suffix}`;

export const Pill: FC<{ label: string; className: string }> = ({ label, className }) => (
  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ${className}`}>
    {label}
  </span>
);

/** The overlap-flag count. A warning pill when flagged, a quiet "0" otherwise, "—" when unknown. */
export const AnomaliesCell: FC<{ count: number | null }> = ({ count }) => {
  if (count == null) {
    return <span className="text-xs text-theme-neutral-400">—</span>;
  }
  return count > 0 ? (
    <span className="inline-flex items-center gap-1 rounded bg-theme-warning-100 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-theme-warning-900">
      <WarningIcon boxSize={2.5} />
      {count.toLocaleString()}
    </span>
  ) : (
    <span className="text-xs text-theme-neutral-400">0</span>
  );
};

/** The "show only flagged" toggle button, matching the prototype's table toolbars. */
export const FlaggedFilterButton: FC<{ active: boolean; onClick: () => void; label: string }> = ({
  active,
  onClick,
  label
}) => (
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
    {label}
  </button>
);

// This module lives under src/pages/**, where Next's pageExtensions ("tsx") collects every .tsx as
// a route and requires a default-exported React component (each sibling view file exports one).
// These are shared presentational cells, not a real page, so the default export is an inert
// placeholder that renders nothing; the named exports above are the real API.
const RollupTableCellsRoute: FC = () => null;
export default RollupTableCellsRoute;
