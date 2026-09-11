import { useT } from "@transifex/react";
import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { mapboxToken } from "@/constants/environment";

/**
 * The site-rollup map for project polygon review's "rollup" mode (plan §3.2/T4) — a read-only map on
 * its own Mapbox instance, drawing one labelled circle per site centroid and firing `onSelectPolygon`
 * (a site uuid, in this case) on click so the caller can drill in.
 *
 * Copied from the prototype's `DrilldownMap`
 * (`design/project-data-experience:src/components/semanticZoom/DrilldownMap.tsx`, 318 lines) and
 * trimmed to just the site-centroid layer: the polygon fill/line/marker layers and the
 * `lossByUuid` loss-timeline overlay are dropped — this map never has per-polygon geometry to draw
 * (that's the whole point of rollup mode: no polygons are loaded at this level).
 *
 * Deliberately isolated from the app's shared map context (`MapAreaProvider`/`PolygonsMap`): this map
 * answers one question — "where are this project's sites, and how many polygons does each hold" —
 * and it never mounts alongside the editing map (rollup and drill-in are mutually exclusive views).
 */
// Pulled from the WRI palette (tailwind.theme.js) rather than picked by eye, matching the prototype.
const SITE_FILL = "#78CAED"; // primary.500
const SITE_LINE = "#11688D"; // primary.700
const ANOMALY_FILL = "#C0453B"; // risk red — sites with failed/overlapping polygons
const ANOMALY_LINE = "#7A2A24";

const SOURCE_ID = "project-site-rollup";
const POINT_LAYER = "project-site-rollup-point";
const LABEL_LAYER = "project-site-rollup-label";

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

        // Sites are drawn as centroids, not as invented boundaries: there is no site geometry at
        // this level, and a computed hull would claim land the project does not hold.
        map.addLayer({
          id: POINT_LAYER,
          type: "circle",
          source: SOURCE_ID,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 12, 12, 22],
            // Selected wins; otherwise sites with anomalies (failed / overlapping polygons) are red so
            // problem sites stand out at a glance — the project-level analog of the per-polygon overlap
            // markers in the site review.
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#A88100", // warning.500 — selection color (matches the prototype)
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
            "text-offset": [0, 1.6],
            "text-anchor": "top",
            "text-allow-overlap": true
          },
          paint: {
            // Anomaly sites get red label text (with a white halo so it stays legible on satellite),
            // matching their red marker; normal sites keep white-on-dark.
            "text-color": ["case", ["boolean", ["get", "hasAnomaly"], false], ANOMALY_FILL, "#FFFFFF"],
            "text-halo-color": ["case", ["boolean", ["get", "hasAnomaly"], false], "#FFFFFF", SITE_LINE],
            "text-halo-width": 1.6
          }
        });

        map.on("click", POINT_LAYER, event => {
          const uuid = event.features?.[0]?.properties?.uuid;
          if (typeof uuid === "string") onSelectRef.current?.(uuid);
        });
        map.on("mouseenter", POINT_LAYER, () => (map.getCanvas().style.cursor = "pointer"));
        map.on("mouseleave", POINT_LAYER, () => (map.getCanvas().style.cursor = ""));
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
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg border border-theme-neutral-200">
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
