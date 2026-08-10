import LevelCard from "./LevelCard";
import { POLYGON_PAGE_SIZE, SemanticZoom } from "./useSemanticZoom";

export interface SemanticZoomPanelProps {
  zoom: SemanticZoom;
  /** "wide" when the panel spans the page rather than sitting in a column beside the map. */
  layout?: "column" | "wide";
}

/** The indicator half of the drill-down. Reads the same hook the map does, so the two agree. */
const SemanticZoomPanel = ({ zoom, layout = "column" }: SemanticZoomPanelProps) => {
  if (!zoom.rollupLoaded) {
    return <p className="p-4 text-sm text-theme-neutral-500">Loading indicators…</p>;
  }

  return (
    <>
      {zoom.aggregate == null ? (
        <section className="rounded-lg border border-theme-neutral-200 bg-white p-4">
          <p className="text-[11px] uppercase tracking-wide text-theme-neutral-400">Polygon</p>
          <h3 className="text-base font-semibold text-theme-neutral-900">{zoom.polygonName ?? "Polygon"}</h3>
          <p className="mt-2 text-xs text-theme-warning-900">
            This polygon is not in the loaded page, so its own measurements are not available. The site aggregate is
            deliberately not shown here — it would be a different number under a polygon heading.
          </p>
        </section>
      ) : (
        <LevelCard
          layout={layout}
          aggregate={zoom.aggregate}
          title={zoom.title}
          subtitle={zoom.level === "project" ? `${zoom.siteCount} sites` : undefined}
          childEntries={zoom.childEntries}
          claims={zoom.claims}
          reconciliations={zoom.reconciliations}
          goals={zoom.goals}
          onSelectChild={id =>
            zoom.level === "project" ? zoom.navigate({ site: id, polygon: null }) : zoom.navigate({ polygon: id })
          }
        />
      )}
      {zoom.truncatedAt != null && (
        // Never let a truncated list read as the whole list.
        <p className="mt-2 text-[11px] text-theme-warning-900">
          Showing the first {POLYGON_PAGE_SIZE} of {zoom.truncatedAt.toLocaleString()} polygons. Indicator figures above
          cover all of them.
        </p>
      )}
    </>
  );
};

export default SemanticZoomPanel;
