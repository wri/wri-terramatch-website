import { SemanticZoom } from "./useSemanticZoom";

/**
 * Project / Site / Polygon, with every ancestor clickable.
 *
 * On the Overview tab the map and the indicator panel sit in separate cards, so this is the one
 * piece of chrome that tells a reader the two are showing the same level. It renders above the map.
 */
const SemanticZoomBreadcrumb = ({ zoom }: { zoom: SemanticZoom }) => (
  <nav className="flex items-center gap-1 text-xs text-theme-neutral-700" aria-label="Zoom path">
    <button
      type="button"
      className="hover:underline disabled:no-underline"
      disabled={zoom.level === "project"}
      onClick={() => zoom.navigate({ site: null, polygon: null })}
    >
      {zoom.projectName}
    </button>
    {zoom.siteUuid != null && (
      <>
        <span className="text-theme-neutral-400">/</span>
        <button
          type="button"
          className="hover:underline disabled:no-underline"
          disabled={zoom.level === "site"}
          onClick={() => zoom.navigate({ polygon: null })}
        >
          {zoom.siteName ?? "Site"}
        </button>
      </>
    )}
    {zoom.polygonUuid != null && (
      <>
        <span className="text-theme-neutral-400">/</span>
        <span className="text-theme-neutral-900">{zoom.polygonName ?? "Polygon"}</span>
      </>
    )}
  </nav>
);

export default SemanticZoomBreadcrumb;
