import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTreeCoverLossTimeline } from "@/connections/TreeCoverLossTimeline";

/** Milliseconds per year while playing. Slow enough to read the year, quick enough to feel animated. */
const FRAME_MS = 900;

export interface LossTimeline {
  /** Years with at least one observation somewhere in scope. Empty when the project has no series. */
  years: number[];
  year: number | null;
  setYear: (year: number) => void;
  playing: boolean;
  toggle: () => void;
  /** Hectares lost in the selected year, keyed by site uuid (project scope) or polygon uuid (site scope). */
  lossByUuid: Record<string, number>;
  /** Total across everything in scope for the selected year. */
  yearTotal: number;
  /** Entities with loss greater than zero in the selected year. */
  affected: number;
  /** Entities carrying an observation for the selected year, and how many exist in scope. */
  observed: number;
  inScope: number;
  /** Sum across every observed year. */
  seriesTotal: number;
  loaded: boolean;
  /** True when the project genuinely has no loss series — distinct from still loading. */
  empty: boolean;
}

export const useLossTimeline = ({
  projectUuid,
  siteUuid,
  enabled
}: {
  projectUuid: string;
  siteUuid: string | null;
  enabled: boolean;
}): LossTimeline => {
  const [loaded, { data }] = useTreeCoverLossTimeline({
    projectUuid,
    siteUuid: siteUuid ?? undefined,
    enabled
  });
  const rows = useMemo(() => data ?? [], [data]);

  // Only years somebody actually observed. A year every polygon is missing would otherwise sit on
  // the scrubber reading "0 ha", which states an observation nobody made.
  const years = useMemo(() => {
    const seen = new Set<number>();
    for (const row of rows) {
      for (const [year, observed] of Object.entries(row.observedByYear ?? {})) {
        if (Number(observed) > 0) seen.add(Number(year));
      }
    }
    return [...seen].sort((a, b) => a - b);
  }, [rows]);

  const [year, setYear] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  // Park on the first year whenever the scope changes. Holding a year that this scope never
  // observed would show an empty map with no explanation.
  useEffect(() => {
    setYear(current => (current != null && years.includes(current) ? current : years[0] ?? null));
    setPlaying(false);
  }, [years]);

  const yearsRef = useRef(years);
  yearsRef.current = years;

  useEffect(() => {
    if (!playing || years.length === 0) return;
    const timer = setInterval(() => {
      setYear(current => {
        const list = yearsRef.current;
        const index = current == null ? -1 : list.indexOf(current);
        // Stop at the end rather than looping: a loop makes it ambiguous whether the last year is
        // the most recent observation or just where the animation happened to be.
        if (index >= list.length - 1) {
          setPlaying(false);
          return current;
        }
        return list[index + 1];
      });
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [playing, years.length]);

  const toggle = useCallback(() => {
    setPlaying(current => {
      if (current) return false;
      const list = yearsRef.current;
      // Replaying from the end should start over rather than sit still.
      if (list.length > 0) setYear(existing => (existing === list[list.length - 1] ? list[0] : existing));
      return list.length > 0;
    });
  }, []);

  const frame = useMemo(() => {
    const key = year == null ? null : String(year);
    const lossByUuid: Record<string, number> = {};
    let yearTotal = 0;
    let affected = 0;
    let observed = 0;
    let seriesTotal = 0;

    for (const row of rows) {
      seriesTotal += row.totalLoss ?? 0;
      if (key == null) continue;

      if (Number(row.observedByYear?.[key] ?? 0) > 0) observed += 1;
      const loss = Number(row.lossByYear?.[key] ?? 0);
      if (loss > 0) {
        lossByUuid[row.uuid] = loss;
        yearTotal += loss;
        affected += 1;
      }
    }

    return { lossByUuid, yearTotal, affected, observed, seriesTotal };
  }, [rows, year]);

  return {
    years,
    year,
    setYear,
    playing,
    toggle,
    ...frame,
    inScope: rows.length,
    loaded,
    empty: loaded && years.length === 0
  };
};
