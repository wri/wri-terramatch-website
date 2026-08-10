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
}

const formatValue = (value: number, unit: string | null) => {
  if (unit === "%") return value.toFixed(1);
  if (Math.abs(value) >= 1000) return Math.round(value).toLocaleString();
  if (Number.isInteger(value)) return value.toLocaleString();
  return value.toFixed(2);
};

const IndicatorRow = ({ contract, level, measurement, claim, reconciliation, goal }: IndicatorRowProps) => {
  const rule = contract.rule[level];
  const tier = contract.source[level];
  const unit = contract.unit;
  const format = (value: number) => formatValue(value, unit);

  const measured = measurement.value;
  const goalPct = goal != null && goal > 0 && measured != null ? Math.min(100, (measured / goal) * 100) : null;

  return (
    <li className="border-b border-neutral-200 py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold text-neutral-900">{contract.label}</h4>
        <span className="shrink-0 text-[11px] uppercase tracking-wide text-neutral-400">
          {rule === "native" ? "as measured" : rule === "sum" ? "summed" : "area-weighted"}
        </span>
      </div>

      {claim != null && (
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs text-neutral-600">Reported</span>
          <span className="flex items-baseline gap-2">
            <span className="text-sm tabular-nums text-neutral-700">
              {claim.value == null ? "—" : `${format(claim.value)}${unit == null ? "" : ` ${unit}`}`}
            </span>
            <SourceChip tier="reported" label={claim.label} />
          </span>
        </div>
      )}

      <div className="mt-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs text-neutral-600">{claim == null ? "Value" : "Measured estimate"}</span>
        <span className="flex items-baseline gap-2">
          {measured == null ? (
            <span className="text-base tabular-nums text-neutral-400">—</span>
          ) : (
            <span className="text-base font-semibold tabular-nums text-neutral-900">
              {format(measured)}
              {unit == null ? "" : <span className="ml-1 text-xs font-normal text-neutral-500">{unit}</span>}
            </span>
          )}
          <SourceChip tier={measured == null ? "notMeasured" : tier} />
        </span>
      </div>

      <CoverageNote measurement={measurement} />

      {reconciliation != null && <ReconciliationRow reconciliation={reconciliation} unit={unit} formatValue={format} />}

      {goal != null && goal > 0 && (
        <div className="mt-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${goalPct ?? 0}%` }}
              role="presentation"
            />
          </div>
          <p className="mt-1 text-[11px] leading-tight text-neutral-500">
            {measured == null ? "No measurement to compare" : `${format(measured)} of ${format(goal)} goal`}
            {unit == null ? "" : ` ${unit}`}
          </p>
        </div>
      )}
    </li>
  );
};

export default IndicatorRow;
