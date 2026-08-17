import { Level } from "./levelContract";

/**
 * One line saying what just changed, shown after a level transition.
 *
 * The premise of this feature is that a number changes meaning as you descend, and the moment that
 * premise is either taught or missed is the transition itself. Without this line, the Reported row
 * simply vanishes between project and site and the reader is left to wonder whether the data broke.
 *
 * It is deliberately not the full level contract. A paragraph in a 25rem scrolling column is a
 * documentation convention; this fires only on navigation and costs nothing at rest.
 */
const TRANSITIONS: Partial<Record<`${Level}->${Level}`, string>> = {
  "project->site":
    "Reported figures stay at the project — partners report planting in site reports, rolled up above. Values below are measured over this site's polygons only.",
  "site->polygon":
    "Native level — nothing here is aggregated. No reported figure and no goal exists for a single polygon.",
  "polygon->site": "Back to aggregates — values are summed over this site's polygons again.",
  "site->project": "Back to the project — reported figures and goals return.",
  // Possible via the breadcrumb, which can jump two levels at once.
  "polygon->project": "Back to the project — reported figures and goals return.",
  "project->polygon":
    "Native level — nothing here is aggregated. No reported figure and no goal exists for a single polygon."
};

export interface DeltaStripProps {
  level: Level;
  previousLevel: Level | null;
}

const DeltaStrip = ({ level, previousLevel }: DeltaStripProps) => {
  if (previousLevel == null || previousLevel === level) return null;

  const copy = TRANSITIONS[`${previousLevel}->${level}`];
  if (copy == null) return null;

  return (
    <p className="border-l-2 border-theme-warning-500 bg-theme-warning-100 px-3 py-2 text-[11px] leading-tight text-theme-warning-900">
      <span className="font-semibold">Δ </span>
      {copy}
    </p>
  );
};

export default DeltaStrip;
