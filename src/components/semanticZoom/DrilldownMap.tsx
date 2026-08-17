import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import { mapboxToken } from "@/constants/environment";

/**
 * A read-only map for the drill-down, on its own Mapbox instance.
 *
 * Deliberately isolated from the app's shared map context: this map answers one question — "where
 * is the thing I am currently looking at, and what can I descend into" — and coupling it to the
 * editing map would drag in selection state and tooling that would only get in the way.
 *
 * Selection is driven by the URL, not by internal state, so the map and the indicator panel can
 * never disagree about which level is being shown.
 */
// Pulled from the WRI palette (tailwind.theme.js) rather than picked by eye, so the map agrees
// with the panel beside it.
const POLYGON_FILL = "#78CAED"; // primary.500
const POLYGON_LINE = "#11688D"; // primary.700
const SELECTED = "#A88100"; // warning.500
// Loss is the one thing on this map that is bad news, so it is the one thing rendered in a warning
// hue. It sits above the base fill but below selection: what you clicked still wins.
const LOSS_FILL = "#E2725B";
const LOSS_LINE = "#8C3A28";

const SOURCE_ID = "semantic-zoom-polygons";
const FILL_LAYER = "semantic-zoom-fill";
const LINE_LAYER = "semantic-zoom-line";
const POINT_LAYER = "semantic-zoom-point";
const LABEL_LAYER = "semantic-zoom-label";
const MARKER_LAYER = "semantic-zoom-marker";

// Site centroids and per-polygon markers are both Points in the same source, so every point layer
// has to say which kind it draws or the two styles collide.
const IS_SITE_POINT: mapboxgl.FilterSpecification = [
  "all",
  ["==", ["geometry-type"], "Point"],
  ["==", ["get", "kind"], "site"]
];
const IS_POLYGON_MARKER: mapboxgl.FilterSpecification = [
  "all",
  ["==", ["geometry-type"], "Point"],
  ["==", ["get", "kind"], "polygonMarker"]
];

export interface DrilldownMapProps {
  featureCollection?: FeatureCollection | null;
  /** Polygon uuid currently selected, if any. */
  selectedId?: string | null;
  /**
   * Receives the polygon's site as well, because a click at project scope has to establish both
   * halves of the path — the panel cannot resolve a polygon without knowing its site.
   */
  onSelectPolygon?: (uuid: string, siteId?: string | null) => void;
  loading?: boolean;
  /**
   * Hectares lost in the year the timeline is parked on, keyed by feature uuid. Features present
   * here are painted as loss for that frame; everything else keeps its base colour.
   */
  lossByUuid?: Record<string, number> | null;
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

const DrilldownMap = ({ featureCollection, selectedId, onSelectPolygon, loading, lossByUuid }: DrilldownMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectRef = useRef(onSelectPolygon);
  onSelectRef.current = onSelectPolygon;
  // Kept so a resize can re-frame. fitBounds computed against a stale canvas size frames wrongly,
  // and the framing is the whole point of a zoom view.
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null);

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

    // The tab mounts inside a flex row that settles after first paint, so the canvas can be
    // created at zero width and stay blank. Watch the container and resize with it.
    const observer = new ResizeObserver(() => {
      map.resize();
      if (boundsRef.current != null) map.fitBounds(boundsRef.current, { padding: 32, duration: 0, maxZoom: 17 });
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
        map.addLayer({
          id: FILL_LAYER,
          type: "fill",
          source: SOURCE_ID,
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED,
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              LOSS_FILL,
              POLYGON_FILL
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.5,
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              0.75,
              0.3
            ]
          }
        });
        map.addLayer({
          id: LINE_LAYER,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED,
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              LOSS_LINE,
              POLYGON_LINE
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              2.5,
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              1.4,
              0.7
            ]
          }
        });

        // Sites are drawn as centroids, not as invented boundaries: there is no site geometry in
        // the data, and a computed hull would claim land the project does not hold.
        map.addLayer({
          id: POINT_LAYER,
          type: "circle",
          source: SOURCE_ID,
          filter: IS_SITE_POINT,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 12, 12, 22],
            "circle-color": ["case", [">", ["coalesce", ["feature-state", "loss"], 0], 0], LOSS_FILL, POLYGON_FILL],
            "circle-opacity": 0.85,
            "circle-stroke-width": 2,
            "circle-stroke-color": [
              "case",
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              LOSS_LINE,
              POLYGON_LINE
            ]
          }
        });
        map.addLayer({
          id: LABEL_LAYER,
          type: "symbol",
          source: SOURCE_ID,
          filter: IS_SITE_POINT,
          layout: {
            // Name first, count second: a reader needs to know which site before how big it is.
            "text-field": ["format", ["get", "name"], {}, "\n", {}, ["get", "polygonsLabel"], { "font-scale": 0.85 }],
            "text-size": 12,
            "text-offset": [0, 1.6],
            "text-anchor": "top",
            "text-allow-overlap": true
          },
          paint: { "text-color": "#FFFFFF", "text-halo-color": POLYGON_LINE, "text-halo-width": 1.5 }
        });

        // One dot per polygon inside a site. It carries the polygon's own uuid, so it inherits the
        // same selection and loss state as the shape beneath it. It shrinks away past zoom 15,
        // where the real geometry is finally big enough to speak for itself.
        map.addLayer({
          id: MARKER_LAYER,
          type: "circle",
          source: SOURCE_ID,
          filter: IS_POLYGON_MARKER,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3.5, 12, 5, 14, 6, 15.5, 0],
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              SELECTED,
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              LOSS_FILL,
              POLYGON_FILL
            ],
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0.9, 15.5, 0],
            "circle-stroke-width": ["interpolate", ["linear"], ["zoom"], 14, 1.2, 15.5, 0],
            "circle-stroke-color": [
              "case",
              [">", ["coalesce", ["feature-state", "loss"], 0], 0],
              LOSS_LINE,
              POLYGON_LINE
            ]
          }
        });

        for (const layer of [FILL_LAYER, POINT_LAYER, MARKER_LAYER]) {
          map.on("click", layer, event => {
            const properties = event.features?.[0]?.properties;
            const uuid = properties?.uuid;
            const siteId = properties?.siteId;
            if (typeof uuid === "string") onSelectRef.current?.(uuid, typeof siteId === "string" ? siteId : null);
          });
          map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
        }
      }

      // Refit on every level change: the framing IS the zoom metaphor. When a single polygon is
      // selected, frame that polygon — descending has to be visible on the map, not just in the
      // panel.
      // Markers share their polygon's uuid, so match the shape explicitly. Framing on the marker
      // would fit a zero-area point and jump straight to maxZoom instead of to the polygon.
      const focused =
        selectedId == null
          ? null
          : featureCollection.features.find(
              feature => feature.properties?.uuid === selectedId && feature.properties?.kind !== "polygonMarker"
            );
      const bounds = boundsOf(focused == null ? featureCollection : { type: "FeatureCollection", features: [focused] });
      boundsRef.current = bounds;
      if (bounds != null) map.fitBounds(bounds, { padding: 32, duration: 600, maxZoom: focused == null ? 14 : 17 });
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [featureCollection, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null || featureCollection == null || map.getSource(SOURCE_ID) == null) return;

    for (const feature of featureCollection.features) {
      const uuid = feature.properties?.uuid;
      if (typeof uuid !== "string") continue;
      // Both flags are written on every pass. Setting only the changed one leaves the previous
      // frame's loss painted on features the new year did not touch.
      map.setFeatureState(
        { source: SOURCE_ID, id: uuid },
        { selected: uuid === selectedId, loss: lossByUuid?.[uuid] ?? 0 }
      );
    }
  }, [selectedId, featureCollection, lossByUuid]);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg border border-theme-neutral-200">
      <div ref={containerRef} className="h-full w-full" />
      {loading === true && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-700">
          Loading polygons…
        </div>
      )}
      {loading !== true && (featureCollection?.features.length ?? 0) === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-theme-neutral-500">
          No polygon geometry at this level
        </div>
      )}
    </div>
  );
};

export default DrilldownMap;
