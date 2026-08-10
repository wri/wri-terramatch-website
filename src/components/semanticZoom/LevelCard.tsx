import { LevelAggregate, Reconciliation } from "./aggregate";
import IndicatorRow from "./IndicatorRow";
import { INDICATOR_ORDER, Level, LEVEL_CONTRACT } from "./levelContract";

export type ChildEntry = {
  id: string;
  name: string;
  /** Approved polygons beneath this child. */
  polygons: number;
  inReviewCount: number;
};

const LEVEL_NOUN: Record<Level, string> = { project: "Project", site: "Site", polygon: "Polygon" };
const CHILD_NOUN: Record<Level, string | null> = { project: "Sites", site: "Polygons", polygon: null };

/**
 * The right-hand panel: the same six indicators at whichever level the user has descended to,
 * plus the list of children to descend into.
 *
 * The panel deliberately renders all six indicators at every level, including the three with no
 * data. Hiding an unmeasured indicator would misrepresent the monitoring picture as more complete
 * than it is; showing it as an em-dash says "we do not know", which is the true statement.
 */
export interface LevelCardProps {
  aggregate: LevelAggregate;
  title: string;
  subtitle?: string;
  childEntries?: ChildEntry[];
  claims?: Partial<Record<(typeof INDICATOR_ORDER)[number], { value: number | null; label: string }>>;
  reconciliations?: Partial<Record<(typeof INDICATOR_ORDER)[number], Reconciliation | null>>;
  goals?: Partial<Record<(typeof INDICATOR_ORDER)[number], number | null>>;
  onSelectChild?: (id: string) => void;
}

const LevelCard = ({
  aggregate,
  title,
  subtitle,
  childEntries,
  claims,
  reconciliations,
  goals,
  onSelectChild
}: LevelCardProps) => {
  const { level, polygons, inReviewCount } = aggregate;
  const childNoun = CHILD_NOUN[level];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-lg border border-theme-neutral-200 bg-white">
      <header className="border-b border-theme-neutral-200 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">{LEVEL_NOUN[level]}</p>
        <h3 className="truncate text-base font-semibold text-theme-neutral-900" title={title}>
          {title}
        </h3>
        {subtitle != null && <p className="truncate text-xs text-theme-neutral-500">{subtitle}</p>}
        <p className="mt-1 text-xs text-theme-neutral-700">
          {polygons.toLocaleString()} approved {polygons === 1 ? "polygon" : "polygons"}
          {inReviewCount > 0 && (
            // Stated on every level. Measurements exclude these, so the exclusion has to be
            // visible or the smaller number reads as the whole picture.
            <span className="text-theme-warning-900">
              {" "}
              · {inReviewCount.toLocaleString()} in review, not counted below
            </span>
          )}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4">
        <ul>
          {INDICATOR_ORDER.map(key => (
            <IndicatorRow
              key={key}
              contract={LEVEL_CONTRACT[key]}
              level={level}
              measurement={aggregate.indicators[key]}
              claim={claims?.[key] ?? null}
              reconciliation={reconciliations?.[key] ?? null}
              goal={goals?.[key] ?? null}
            />
          ))}
        </ul>

        {childNoun != null && childEntries != null && childEntries.length > 0 && (
          <div className="border-t border-theme-neutral-200 py-3">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-theme-neutral-400">
              {childNoun} ({childEntries.length.toLocaleString()})
            </p>
            <ul className="flex flex-col gap-1">
              {childEntries.map(child => (
                <li key={child.id}>
                  <button
                    type="button"
                    onClick={() => onSelectChild?.(child.id)}
                    className="flex w-full items-baseline justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-theme-neutral-100"
                  >
                    <span className="truncate text-xs text-theme-neutral-800">{child.name}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-theme-neutral-500">
                      {child.polygons.toLocaleString()}
                      {child.inReviewCount > 0 && (
                        <span className="text-theme-warning-900"> +{child.inReviewCount.toLocaleString()}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default LevelCard;
