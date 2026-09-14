import { useT } from "@transifex/react";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { mapboxToken } from "@/constants/environment";
import { getThemedColor } from "@/lib/theme";

/**
 * The site-rollup map for project polygon review's "rollup" mode (plan §3.2/T4) — a read-only map on
 * its own Mapbox instance, drawing one labelled feature per site and firing `onSelectSite` (a site
 * uuid) on click so the caller can drill in.
 *
 * Each site is drawn as an APPROXIMATE footprint: a rectangle spanning the bounding box of its active
 * polygon centroids (from the rollup row's bbox fields). It is understated relative to the true
 * polygon geometry — no polygon geometry is ever loaded at this level, that is the whole point of
 * rollup mode — but it conveys extent and location far better than a single dot. Sites whose box is
 * degenerate (a single polygon, so min == max) fall back to a centroid circle; the feature collection
 * (buildSiteCentroidFeatureCollection) decides per site, and the fill/line and circle layers are each
 * filtered by geometry type so only the right one renders.
 *
 * Copied from the prototype's `DrilldownMap`
 * (`design/project-data-experience:src/components/semanticZoom/DrilldownMap.tsx`, 318 lines) and
 * trimmed: the per-polygon marker layers and the `lossByUuid` loss-timeline overlay are dropped.
 *
 * Deliberately isolated from the app's shared map context (`MapAreaProvider`/`PolygonsMap`): this map
 * answers one question — "where are this project's sites, and how big/where is each" — and it never
 * mounts alongside the editing map (rollup and drill-in are mutually exclusive views).
 */
// Pulled from the design-system theme tokens rather than picked by eye, so the map tracks the palette.
const SITE_FILL = getThemedColor("primary", 500);
const SITE_LINE = getThemedColor("primary", 700);
const ANOMALY_FILL = getThemedColor("error", 500); // risk red — sites with failed/overlapping polygons
// error has no 600 token; 900 is the nearest darker shade, keeping the line darker than the fill.
const ANOMALY_LINE = getThemedColor("error", 900);

// 420px — kept as a named constant so the container avoids an arbitrary Tailwind value.
const SITE_ROLLUP_MAP_MIN_HEIGHT = "26.25rem";

const SOURCE_ID = "project-site-rollup";
const FILL_LAYER = "project-site-rollup-fill";
const LINE_LAYER = "project-site-rollup-line";
const POINT_LAYER = "project-site-rollup-point";
const LABEL_LAYER = "project-site-rollup-label";

// Selection highlight, shared by the footprint fill/line and the fallback point.
const SELECTED_FILL = getThemedColor("warning", 500);

// Only render the footprint layers for Polygon features and the circle layer for the degenerate
// (single-polygon) Point fallback — a circle layer would otherwise drop a dot on every polygon vertex.
const POLYGON_ONLY: mapboxgl.Expression = ["==", ["geometry-type"], "Polygon"];
const POINT_ONLY: mapboxgl.Expression = ["==", ["geometry-type"], "Point"];

export interface SiteRollupMapProps {
  featureCollection?: FeatureCollection | null;
  onSelectSite?: (siteUuid: string) => void;
  loading?: boolean;
}

/** Walks coordinates rather than pulling in turf for one bounding box. */
const boundsOf = (collection: FeatureCollection): mapboxgl.LngLatBounds | null => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lng, lat] = coords as [number, number];
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
      west = Math.min(west, lng);
      east = Math.max(east, lng);
      south = Math.min(south, lat);
      north = Math.max(north, lat);
      return;
    }
    for (const child of coords) visit(child);
  };

  for (const feature of collection.features) {
    if (feature.geometry != null && "coordinates" in feature.geometry) visit(feature.geometry.coordinates);
  }

  if (west === Infinity) return null;
  return new mapboxgl.LngLatBounds([west, south], [east, north]);
};

const SiteRollupMap = ({ featureCollection, onSelectSite, loading }: SiteRollupMapProps) => {
  const t = useT();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectRef = useRef(onSelectSite);
  onSelectRef.current = onSelectSite;
  // Kept so a resize can re-frame. fitBounds computed against a stale canvas size frames wrongly,
  // and the framing is the whole point of this view.
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null);
  // Set once the user pans/zooms; suppresses auto-fit on resize so their view is preserved.
  const hasUserInteractedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current == null || mapRef.current != null) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 0],
      zoom: 1,
      attributionControl: false
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    // Once the reviewer pans/zooms, stop auto-framing so a resize (e.g. dragging the ResizeBox
    // splitter) doesn't snap the map back to the full-project bounds and throw away their view.
    // `movestart` covers pan/zoom/rotate; originalEvent is present only for user-initiated moves
    // (not our programmatic fitBounds).
    map.on("movestart", event => {
      if (event.originalEvent != null) hasUserInteractedRef.current = true;
    });

    // The tab mounts inside a flex row that settles after first paint, so the canvas can be
    // created at zero width and stay blank. Watch the container and resize with it — but only
    // re-fit while the user hasn't taken over the view.
    const observer = new ResizeObserver(() => {
      map.resize();
      if (!hasUserInteractedRef.current && boundsRef.current != null) {
        map.fitBounds(boundsRef.current, { padding: 32, duration: 0, maxZoom: 17 });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null || featureCollection == null) return;

    const apply = () => {
      const existing = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (existing != null) {
        existing.setData(featureCollection);
      } else {
        map.addSource(SOURCE_ID, { type: "geojson", data: featureCollection, promoteId: "uuid" });

        // Approximate site footprint (bbox of the site's polygon centroids). Selected wins; otherwise
        // sites with anomalies (failed / overlapping polygons) are red so problem sites stand out at a
        // glance — the project-level analog of the per-polygon overlap markers in the site review.
        map.addLayer({
          id: FILL_LAYER,
          type: "fill",
          source: SOURCE_ID,
          filter: POLYGON_ONLY,
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED_FILL,
              ["boolean", ["get", "hasAnomaly"], false],
              ANOMALY_FILL,
              SITE_FILL
            ],
            // Translucent so the satellite basemap reads through; darker when selected.
            "fill-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 0.45, 0.28]
          }
        });
        map.addLayer({
          id: LINE_LAYER,
          type: "line",
          source: SOURCE_ID,
          filter: POLYGON_ONLY,
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED_FILL,
              ["boolean", ["get", "hasAnomaly"], false],
              ANOMALY_LINE,
              SITE_LINE
            ],
            "line-width": ["case", ["boolean", ["feature-state", "selected"], false], 3, 2]
          }
        });
        // Fallback marker for single-polygon sites, whose bbox is a degenerate point.
        map.addLayer({
          id: POINT_LAYER,
          type: "circle",
          source: SOURCE_ID,
          filter: POINT_ONLY,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 10, 12, 18],
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED_FILL,
              ["boolean", ["get", "hasAnomaly"], false],
              ANOMALY_FILL,
              SITE_FILL
            ],
            "circle-opacity": 0.85,
            "circle-stroke-width": 2,
            "circle-stroke-color": ["case", ["boolean", ["get", "hasAnomaly"], false], ANOMALY_LINE, SITE_LINE]
          }
        });
        map.addLayer({
          id: LABEL_LAYER,
          type: "symbol",
          source: SOURCE_ID,
          layout: {
            // Name first, count second: a reader needs to know which site before how big it is.
            "text-field": ["format", ["get", "name"], {}, "\n", {}, ["get", "polygonsLabel"], { "font-scale": 0.85 }],
            "text-size": 12,
            "text-offset": [0, 0.8],
            "text-anchor": "top",
            "text-allow-overlap": true
          },
          paint: {
            // Anomaly sites get red label text (with a white halo so it stays legible on satellite),
            // matching their red footprint; normal sites keep white-on-dark.
            "text-color": ["case", ["boolean", ["get", "hasAnomaly"], false], ANOMALY_FILL, "#FFFFFF"],
            "text-halo-color": ["case", ["boolean", ["get", "hasAnomaly"], false], "#FFFFFF", SITE_LINE],
            "text-halo-width": 1.6
          }
        });

        const handleSelect = (event: mapboxgl.MapLayerMouseEvent) => {
          const uuid = event.features?.[0]?.properties?.uuid;
          if (typeof uuid === "string") onSelectRef.current?.(uuid);
        };
        const setPointer = () => (map.getCanvas().style.cursor = "pointer");
        const clearPointer = () => (map.getCanvas().style.cursor = "");
        for (const layer of [FILL_LAYER, POINT_LAYER]) {
          map.on("click", layer, handleSelect);
          map.on("mouseenter", layer, setPointer);
          map.on("mouseleave", layer, clearPointer);
        }
      }

      const bounds = boundsOf(featureCollection);
      boundsRef.current = bounds;
      if (bounds != null) map.fitBounds(bounds, { padding: 32, duration: 600, maxZoom: 14 });
    };

    if (map.isStyleLoaded()) {
      apply();
      return;
    }
    // Defer until the style loads, but remove this pending handler on re-run/unmount so rapid
    // featureCollection changes before load don't stack multiple applies.
    map.once("load", apply);
    return () => {
      map.off("load", apply);
    };
  }, [featureCollection]);

  return (
    <div
      className="relative h-full overflow-hidden rounded-lg border border-theme-neutral-200"
      style={{ minHeight: SITE_ROLLUP_MAP_MIN_HEIGHT }}
    >
      <div ref={containerRef} className="h-full w-full" />
      {loading === true && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-700">
          {t("Loading sites…")}
        </div>
      )}
      {loading !== true && (featureCollection?.features.length ?? 0) === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-500">
          {t("No site locations to show yet")}
        </div>
      )}
    </div>
  );
};

export default SiteRollupMap;
