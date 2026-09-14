import { FC } from "react";

import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
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

/** The overlap-flag count. A warning-toned tag when flagged, a quiet "0" otherwise, "—" when unknown. */
export const AnomaliesCell: FC<{ count: number | null }> = ({ count }) => {
  if (count == null) {
    return <span className="text-xs text-theme-neutral-400">—</span>;
  }
  // ActionStatusTag's "attention" state renders the amber/warning palette (its "warning" state renders
  // error/red), so "attention" preserves the original warning-toned pill for the anomaly count.
  return count > 0 ? (
    <ActionStatusTag
      state="attention"
      size="small"
      label={count.toLocaleString()}
      icon={<WarningIcon boxSize={2.5} />}
    />
  ) : (
    <span className="text-xs text-theme-neutral-400">0</span>
  );
};

// This module lives under src/pages/**, where Next's pageExtensions ("tsx") collects every .tsx as
// a route and requires a default-exported React component (each sibling view file exports one).
// These are shared presentational cells, not a real page, so the default export is an inert
// placeholder that renders nothing; the named exports above are the real API.
const RollupTableCellsRoute: FC = () => null;
export default RollupTableCellsRoute;
