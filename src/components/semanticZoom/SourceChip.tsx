import { SOURCE_LABELS, SourceTier } from "./levelContract";

/**
 * A provenance chip. Every figure carries one, because "12.4%" means something different when it
 * was measured in a field than when a partner typed it into a report.
 *
 * `reported` is styled distinctly on purpose: it is the only tier that is a claim rather than a
 * measurement, and the two must never be mistaken for each other at a glance.
 */
const TIER_STYLES: Record<SourceTier, string> = {
  field: "bg-green-100 text-green-700",
  satellite: "bg-blue-100 text-blue-700",
  modeled: "bg-purple-100 text-purple-700",
  reported: "border border-dashed border-orange-400 bg-orange-50 text-orange-700",
  derived: "bg-neutral-150 text-neutral-800",
  notMeasured: "bg-neutral-100 text-neutral-500"
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
