import { isPartial, Measurement } from "./aggregate";

/**
 * "142 of 180 polygons analysed". Sits under every aggregated figure.
 *
 * Without this line a reader assumes a sum is complete, which is the single easiest way for this
 * UI to mislead. When coverage is partial the note says so in words as well as numbers, because
 * "6,503 of 7,293" is easy to skim past and "(partial)" is not.
 */
export interface CoverageNoteProps {
  measurement: Measurement;
  /** What is being counted. Polygons at every level today. */
  unit?: string;
}

const CoverageNote = ({ measurement, unit = "polygons" }: CoverageNoteProps) => {
  const { value, measuredCount, totalCount } = measurement;

  // Nothing measured at all is the em-dash's job, not this note's.
  if (value == null || totalCount === 0) return null;

  const partial = isPartial(measurement);

  return (
    <p className={`mt-0.5 text-[11px] leading-tight ${partial ? "text-orange-700" : "text-neutral-500"}`}>
      {measuredCount.toLocaleString()} of {totalCount.toLocaleString()} {unit} analysed
      {partial ? " (partial sum)" : ""}
    </p>
  );
};

export default CoverageNote;
