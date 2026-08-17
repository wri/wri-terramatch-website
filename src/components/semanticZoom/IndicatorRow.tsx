import { Measurement, Reconciliation } from "./aggregate";
import CoverageNote from "./CoverageNote";
import { IndicatorContract, Level } from "./levelContract";
import ReconciliationRow from "./ReconciliationRow";
import SourceChip from "./SourceChip";

/**
 * One indicator at one level. This component is where the honesty rules are actually enforced,
 * rather than described in a caveat elsewhere:
 *
 *  1. A claim and a measurement never merge into one number. They are separate rows with separate
 *     chips, so a partner-reported figure can never be read as measured.
 *  2. Every aggregated measurement carries a coverage line.
 *  3. Empty renders an em-dash and a "not measured" chip. Never 0 — zero is a claim that something
 *     was observed to be absent.
 *  4. Divergence between claim and measurement is stated, not hidden.
 */
export interface IndicatorRowProps {
  contract: IndicatorContract;
  level: Level;
  measurement: Measurement;
  /** The reported figure, where one exists at this level. Rendered as its own row. */
  claim?: { value: number | null; label: string } | null;
  reconciliation?: Reconciliation | null;
  goal?: number | null;
  /**
   * Why an absent measurement is absent, and what would resolve it. Shown only where a claim sits
   * next to an em-dash — an open comparison with no explanation reads as a broken screen.
   */
  expectation?: string | null;
}

const formatValue = (value: number, unit: string | null) => {
  if (unit === "%") return value.toFixed(1);
  if (Math.abs(value) >= 1000) return Math.round(value).toLocaleString();
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toFixed(2);
};

const IndicatorRow = ({
  contract,
  level,
  measurement,
  claim,
  reconciliation,
  goal,
  expectation
}: IndicatorRowProps) => {
  const rule = contract.rule[level];
  const tier = contract.source[level];
  const unit = contract.unit;
  const format = (value: number) => formatValue(value, unit);

  const measured = measurement.value;

  // The bar tracks whichever quantity this indicator actually has. Where nothing is measured, that
  // is the partner's claim — and the caption says "reported" so the bar cannot be read as verified
  // progress.
  const progressValue = measured ?? claim?.value ?? null;
  const progressIsClaim = measured == null && claim?.value != null;
  const showGoal = goal != null && goal > 0;

  // The goal is a tick, never the end of the bar. A bar capped at 100% for a project at 250% of
  // goal reads as "on track" rather than as over-delivering, which is the opposite of the truth.
  const exceedsGoal = showGoal && progressValue != null && progressValue > goal;
  const barScale = showGoal ? (exceedsGoal && progressValue != null ? progressValue * 1.04 : goal) : null;
  const fillPct = barScale != null && progressValue != null ? Math.max(0, (progressValue / barScale) * 100) : 0;
  const goalTickPct = barScale != null && goal != null ? (goal / barScale) * 100 : 0;

  return (
    <li className="border-b border-theme-neutral-200 py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold text-theme-neutral-900">{contract.label}</h4>
        <span className="shrink-0 text-[11px] uppercase tracking-wide text-theme-neutral-400">
          {rule === "native" ? "as measured" : rule === "sum" ? "summed" : "area-weighted"}
        </span>
      </div>

      {claim != null && (
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs text-theme-neutral-700">Reported</span>
          <span className="flex items-baseline gap-2">
            <span className="text-sm tabular-nums text-theme-neutral-700">
              {claim.value == null ? "—" : `${format(claim.value)}${unit == null ? "" : ` ${unit}`}`}
            </span>
            <SourceChip tier="reported" label={claim.label} />
          </span>
        </div>
      )}

      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs text-theme-neutral-700">{claim == null ? "Value" : "Measured estimate"}</span>
        <span className="flex items-baseline gap-2">
          {measured == null ? (
            <span className="text-base tabular-nums text-theme-neutral-400">—</span>
          ) : (
            <span className="text-base font-semibold tabular-nums text-theme-neutral-900">
              {format(measured)}
              {unit == null ? "" : <span className="ml-1 text-xs font-normal text-theme-neutral-500">{unit}</span>}
            </span>
          )}
          <SourceChip tier={measured == null ? "notMeasured" : tier} />
        </span>
      </div>

      <CoverageNote measurement={measurement} />

      {expectation != null && (
        // Neutral, not the warning colour. An absent measurement is a state of the monitoring
        // programme, not an alarm about this project.
        <p className="mt-1 text-[11px] leading-tight text-theme-neutral-500">{expectation}</p>
      )}

      {reconciliation != null && <ReconciliationRow reconciliation={reconciliation} unit={unit} formatValue={format} />}

      {showGoal && (
        <div className="mt-2">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-theme-neutral-200">
            <div
              // A claim-driven bar is lighter than a measured one, so the two never look alike.
              className={`h-full rounded-full ${progressIsClaim ? "bg-theme-primary-200" : "bg-theme-primary-500"}`}
              style={{ width: `${fillPct}%` }}
              role="presentation"
            />
            {exceedsGoal && (
              <div
                className="absolute inset-y-0 w-0.5 bg-theme-warning-500"
                style={{ left: `${goalTickPct}%` }}
                role="presentation"
              />
            )}
          </div>
          <p className="mt-1 text-[11px] leading-tight text-theme-neutral-500">
            {progressValue == null
              ? "No measurement to compare"
              : `${format(progressValue)} ${progressIsClaim ? "reported" : "measured"} of ${format(goal)} goal`}
            {progressValue == null || unit == null ? "" : ` ${unit}`}
            {exceedsGoal ? " · exceeds goal" : ""}
          </p>
        </div>
      )}
    </li>
  );
};

export default IndicatorRow;
