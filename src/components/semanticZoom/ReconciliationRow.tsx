import { Reconciliation } from "./aggregate";

/**
 * States the gap between what was reported and what was measured.
 *
 * The two numbers are already rendered as separate rows; this line exists so the reader does not
 * have to do the subtraction, and so a divergence cannot be quietly skimmed past. Divergence is
 * information — it is often the most useful thing on the panel — so it is stated, never hidden.
 */
export interface ReconciliationRowProps {
  reconciliation: Reconciliation;
  unit: string | null;
  formatValue: (value: number) => string;
}

const ReconciliationRow = ({ reconciliation, unit, formatValue }: ReconciliationRowProps) => {
  const { delta, deltaFraction } = reconciliation;

  // Rounded to what the rows above actually display, an exact tie still leaves a hair of float
  // behind — "Measured is 0% below reported, Δ −0.00 ha" is a worse statement than "they agree",
  // and it reads as a divergence when there is none. Anything under a tenth of a percent is a tie.
  if (delta === 0 || (deltaFraction != null && Math.abs(deltaFraction) < 0.001)) {
    return <p className="mt-1 text-[11px] leading-tight text-theme-neutral-500">Measured matches reported.</p>;
  }

  const direction = delta < 0 ? "below" : "above";
  const magnitude = deltaFraction == null ? null : `${Math.abs(deltaFraction * 100).toFixed(0)}%`;
  const signed = `${delta < 0 ? "−" : "+"}${formatValue(Math.abs(delta))}${unit == null ? "" : ` ${unit}`}`;

  return (
    <p className="mt-1 text-[11px] leading-tight text-theme-warning-900">
      {magnitude == null ? "Measured differs from reported" : `Measured is ${magnitude} ${direction} reported`}, Δ{" "}
      {signed}
    </p>
  );
};

export default ReconciliationRow;
