import { Level } from "./levelContract";
import { LossTimeline } from "./useLossTimeline";

/**
 * Scrub and play the annual tree cover loss series under the map.
 *
 * Two things this deliberately does not do. It does not present the animation as restoration
 * progress — the series is canopy *lost* inside project boundaries, and the heading says so. And it
 * does not project: there is no committed-trajectory data in TerraMatch, so the scrubber stops at
 * the last observed year rather than running into a dashed future.
 */
export interface LossTimelinePlayerProps {
  timeline: LossTimeline;
  level: Level;
}

const formatHa = (value: number) => (value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(2));

const LossTimelinePlayer = ({ timeline, level }: LossTimelinePlayerProps) => {
  const { years, year, setYear, playing, toggle, yearTotal, affected, observed, inScope, seriesTotal } = timeline;

  if (!timeline.loaded) {
    return <p className="px-1 py-2 text-[11px] text-theme-neutral-500">Loading loss history…</p>;
  }

  const noun = level === "project" ? "sites" : "polygons";

  if (timeline.empty) {
    return (
      <p className="px-1 py-2 text-[11px] leading-tight text-theme-neutral-500">
        No tree cover loss history for these {noun}. The annual series is not present for every project in this
        snapshot; where it is absent, nothing is claimed about what happened.
      </p>
    );
  }

  const first = years[0];
  const last = years[years.length - 1];
  const index = year == null ? 0 : years.indexOf(year);

  return (
    <div className="flex flex-col gap-1.5 px-1 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-xs font-semibold text-theme-neutral-900">
          Tree cover loss by year
          <span className="ml-1.5 font-normal text-theme-neutral-500">canopy lost, not planting</span>
        </h4>
        <span className="shrink-0 text-[11px] tabular-nums text-theme-neutral-500">
          {formatHa(seriesTotal)} ha total, {first}–{last}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-theme-primary-500 text-white hover:bg-theme-primary-700"
        >
          {playing ? (
            <span className="flex gap-[3px]">
              <span className="block h-3 w-[3px] bg-white" />
              <span className="block h-3 w-[3px] bg-white" />
            </span>
          ) : (
            <span className="ml-[2px] block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-white" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={Math.max(0, years.length - 1)}
          step={1}
          value={index < 0 ? 0 : index}
          onChange={event => setYear(years[Number(event.target.value)])}
          aria-label="Year"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-theme-neutral-200 accent-theme-primary-500"
        />

        <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-theme-neutral-900">
          {year ?? "—"}
        </span>
      </div>

      <p className="text-[11px] leading-tight text-theme-neutral-700">
        {yearTotal > 0 ? (
          <>
            <span className="font-semibold text-theme-warning-900">{formatHa(yearTotal)} ha</span> lost across{" "}
            {affected.toLocaleString()} {affected === 1 ? noun.slice(0, -1) : noun}
          </>
        ) : (
          <span className="text-theme-neutral-500">No loss recorded in {year}</span>
        )}
        {/* Coverage on every frame, same rule as the indicator rows above: a year measured on a
            subset must never read as a year measured on everything. */}
        <span className="text-theme-neutral-500">
          {" "}
          · {observed.toLocaleString()} of {inScope.toLocaleString()} {noun} observed
        </span>
      </p>
    </div>
  );
};

export default LossTimelinePlayer;
