import { SOURCE_LABELS, SourceTier } from "./levelContract";

/**
 * A provenance chip. Every figure carries one, because "12.4%" means something different when it
 * was measured in a field than when a partner typed it into a report.
 *
 * `reported` is styled distinctly on purpose: it is the only tier that is a claim rather than a
 * measurement, and the two must never be mistaken for each other at a glance.
 */
const TIER_STYLES: Record<SourceTier, string> = {
  field: "bg-theme-success-100 text-theme-success-900",
  // Neutral on purpose: a boundary-derived area is not evidence of anything happening on the
  // ground, so it should not borrow the field tier's green.
  geometry: "bg-theme-neutral-200 text-theme-neutral-800",
  satellite: "bg-theme-secondary-200 text-theme-secondary-800",
  modeled: "bg-theme-information-100 text-theme-information-900",
  reported: "border border-dashed border-theme-warning-300 bg-theme-warning-100 text-theme-warning-900",
  derived: "bg-theme-neutral-200 text-theme-neutral-800",
  notMeasured: "bg-theme-neutral-100 text-theme-neutral-500"
};

export interface SourceChipProps {
  tier: SourceTier;
  /** Optional override, e.g. "Reported (polygon attribute)". */
  label?: string;
}

const SourceChip = ({ tier, label }: SourceChipProps) => (
  <span
    className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[11px] font-medium leading-none ${TIER_STYLES[tier]}`}
  >
    {label ?? SOURCE_LABELS[tier]}
  </span>
);

export default SourceChip;
